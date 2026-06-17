<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaymentRequest;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;
use Illuminate\Support\Facades\Log;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (SignatureVerificationException $e) {
            Log::warning('Stripe webhook signature verification failed: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], 400);
        } catch (\Exception $e) {
            Log::error('Stripe webhook error: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid payload'], 400);
        }

        switch ($event->type) {
            case 'checkout.session.completed':
                $this->markPaymentRequest($event->data->object, 'completed');
                break;

            case 'checkout.session.expired':
                $this->markPaymentRequest($event->data->object, 'rejected');
                break;
        }

        return response()->json(['status' => 'success']);
    }

    private function markPaymentRequest($session, string $status)
    {
        $paymentRequestId = $session->metadata->payment_request_id ?? null;

        if (!$paymentRequestId) {
            return;
        }

        $paymentRequest = PaymentRequest::find($paymentRequestId);

        if (!$paymentRequest) {
            return;
        }

        // Don't downgrade a request that's already completed
        if ($paymentRequest->request_status === 'completed' && $status === 'rejected') {
            return;
        }

        $paymentRequest->request_status = $status;
        $paymentRequest->payment_method = 'stripe';
        $paymentRequest->save();
    }
}