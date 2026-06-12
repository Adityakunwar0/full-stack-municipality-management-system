<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\ServiceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Event;
use Stripe\Stripe;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    // ─────────────────────────────────────────────────────────
    // POST /webhook/stripe
    // IMPORTANT: Exclude this route from CSRF verification.
    // Add to App\Http\Middleware\VerifyCsrfToken::$except:
    //   'webhook/stripe'
    // ─────────────────────────────────────────────────────────
    public function handle(Request $request): JsonResponse
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret    = config('services.stripe.webhook_secret');

        // ── Verify the webhook signature ─────────────────────
        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\UnexpectedValueException $e) {
            Log::warning('Stripe webhook: invalid payload');
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::warning('Stripe webhook: invalid signature');
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // ── Route to the right handler ────────────────────────
        match ($event->type) {
            'payment_intent.succeeded'       => $this->handleSucceeded($event),
            'payment_intent.payment_failed'  => $this->handleFailed($event),
            default                          => null,
        };

        return response()->json(['status' => 'ok']);
    }

    // ─────────────────────────────────────────────────────────
    // payment_intent.succeeded
    // Marks Payment as "completed" and ServiceRequest as "completed"
    // ─────────────────────────────────────────────────────────
    private function handleSucceeded(Event $event): void
    {
        $intent  = $event->data->object;
        $payment = Payment::where('stripe_payment_intent_id', $intent->id)->first();

        if (!$payment) {
            Log::warning('Stripe webhook succeeded: no matching payment', ['intent' => $intent->id]);
            return;
        }

        DB::transaction(function () use ($payment, $intent) {
            $payment->update([
                'payment_status' => 'completed',
                'paid_at'        => now(),
                'failure_reason' => null,
            ]);

            // ── Auto-update the linked ServiceRequest ─────────
            // This is what syncs admin + user panels automatically
            if ($payment->service_request_id) {
                ServiceRequest::where('id', $payment->service_request_id)
                    ->update([
                        'request_status' => 'completed',
                        'remarks'        => 'Payment completed via Stripe. TXN: ' . $intent->id,
                    ]);
            }
        });

        Log::info('Payment completed via webhook', [
            'payment_id' => $payment->id,
            'intent_id'  => $intent->id,
        ]);
    }

    // ─────────────────────────────────────────────────────────
    // payment_intent.payment_failed
    // Marks Payment as "failed"
    // ─────────────────────────────────────────────────────────
    private function handleFailed(Event $event): void
    {
        $intent  = $event->data->object;
        $payment = Payment::where('stripe_payment_intent_id', $intent->id)->first();

        if (!$payment) {
            Log::warning('Stripe webhook failed: no matching payment', ['intent' => $intent->id]);
            return;
        }

        $reason = $intent->last_payment_error?->message ?? 'Payment failed.';

        $payment->update([
            'payment_status' => 'failed',
            'failure_reason' => $reason,
        ]);

        Log::warning('Payment failed via webhook', [
            'payment_id' => $payment->id,
            'reason'     => $reason,
        ]);
    }
}