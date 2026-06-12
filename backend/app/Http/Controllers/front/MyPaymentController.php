<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Service;
use App\Models\ServiceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class MyPaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    // ─────────────────────────────────────────────────────────
    // 1. GET /user/my-payments
    //    Returns all payments for the logged-in user
    // ─────────────────────────────────────────────────────────
    public function index(): JsonResponse
    {
        $payments = Payment::with(['service', 'serviceRequest'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get()
            ->map(fn ($p) => $this->formatPayment($p));

        return response()->json([
            'status' => true,
            'data'   => $payments,
            'summary' => [
                'total'     => $payments->count(),
                'progress'  => $payments->where('payment_status', 'progress')->count(),
                'completed' => $payments->where('payment_status', 'completed')->count(),
                'failed'    => $payments->where('payment_status', 'failed')->count(),
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────
    // 2. GET /user/my-payments/{id}
    //    Single payment detail for logged-in user
    // ─────────────────────────────────────────────────────────
    public function show($id): JsonResponse
    {
        $payment = Payment::with(['service', 'serviceRequest'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        return response()->json([
            'status' => true,
            'data'   => $this->formatPayment($payment),
        ]);
    }

    // ─────────────────────────────────────────────────────────
    // 3. POST /user/my-payments/create-intent
    //    Creates a Stripe PaymentIntent + a pending Payment row.
    //    Called when user clicks "Pay Now" on a service.
    // ─────────────────────────────────────────────────────────
    public function createIntent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_id'       => 'required|integer|exists:services,id',
            'service_request_id' => 'nullable|integer|exists:service_requests,id',
            'customer_name'    => 'required|string|max:255',
            'customer_email'   => 'required|email|max:255',
            'customer_phone'   => 'nullable|string|max:30',
            'reference_number' => 'nullable|string|max:100',
        ]);

        $service = Service::findOrFail($validated['service_id']);

        // ── Server-side amount calculation ───────────────────
        // Store base amounts in the services table (cents),
        // or derive from your own logic. Example: fixed per service.
        // For now we read from service->amount if you add that column,
        // otherwise you can add a price column to the services table.
        // Using a fallback for demo:
        $baseAmount     = $service->amount ?? 10000; // cents — add 'amount' col to services
        $processingFee  = (int) round($baseAmount * 0.029 + 30); // Stripe 2.9% + $0.30
        $totalAmount    = $baseAmount + $processingFee;

        try {
            // ── Create Stripe PaymentIntent ──────────────────
            $intent = PaymentIntent::create([
                'amount'               => $totalAmount,
                'currency'             => 'usd',
                'receipt_email'        => $validated['customer_email'],
                'description'          => $service->title,
                'automatic_payment_methods' => ['enabled' => true],
                'metadata' => [
                    'user_id'          => auth()->id(),
                    'service_id'       => $service->id,
                    'service_title'    => $service->title,
                    'reference_number' => $validated['reference_number'] ?? '',
                    'customer_name'    => $validated['customer_name'],
                ],
            ]);

            // ── Persist pending Payment row ──────────────────
            $payment = Payment::create([
                'user_id'                  => auth()->id(),
                'service_id'               => $service->id,
                'service_request_id'       => $validated['service_request_id'] ?? null,
                'stripe_payment_intent_id' => $intent->id,
                'stripe_client_secret'     => $intent->client_secret,
                'amount'                   => $baseAmount,
                'processing_fee'           => $processingFee,
                'total_amount'             => $totalAmount,
                'currency'                 => 'usd',
                'payment_status'           => 'progress',
                'customer_name'            => $validated['customer_name'],
                'customer_email'           => $validated['customer_email'],
                'customer_phone'           => $validated['customer_phone'] ?? null,
                'reference_number'         => $validated['reference_number'] ?? null,
            ]);

            return response()->json([
                'status'             => true,
                'client_secret'      => $intent->client_secret,
                'payment_intent_id'  => $intent->id,
                'payment_id'         => $payment->id,
                'amount'             => $totalAmount,
                'amount_formatted'   => '$' . number_format($totalAmount / 100, 2),
            ]);

        } catch (ApiErrorException $e) {
            Log::error('Stripe createIntent error', [
                'message' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);
            return response()->json(['status' => false, 'message' => 'Payment service unavailable.'], 500);
        }
    }

    // ─────────────────────────────────────────────────────────
    // 4. POST /user/my-payments/confirm
    //    Called by the frontend after Stripe confirms on client.
    //    Verifies with Stripe, marks payment completed/failed,
    //    and also updates the linked ServiceRequest status.
    // ─────────────────────────────────────────────────────────
    public function confirm(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_intent_id' => 'required|string',
            'payment_id'        => 'required|integer|exists:payments,id',
        ]);

        $payment = Payment::where('id', $validated['payment_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        try {
            // Re-verify with Stripe — never trust client alone
            $intent = PaymentIntent::retrieve($validated['payment_intent_id']);

            DB::transaction(function () use ($payment, $intent) {
                if ($intent->status === 'succeeded') {
                    $payment->update([
                        'payment_status' => 'completed',
                        'paid_at'        => now(),
                        'failure_reason' => null,
                    ]);

                    // ── Auto-update the linked ServiceRequest ──
                    if ($payment->service_request_id) {
                        ServiceRequest::where('id', $payment->service_request_id)
                            ->update([
                                'request_status' => 'completed',
                                'remarks'        => 'Payment completed via Stripe. TXN: ' . $intent->id,
                            ]);
                    }

                } else {
                    $payment->update([
                        'payment_status' => 'failed',
                        'failure_reason' => $intent->last_payment_error?->message ?? 'Payment not completed.',
                    ]);
                }
            });

            return response()->json([
                'status'         => true,
                'payment_status' => $payment->fresh()->payment_status,
                'message'        => $payment->fresh()->isCompleted()
                                        ? 'Payment completed successfully.'
                                        : 'Payment did not complete.',
                'data'           => $this->formatPayment($payment->fresh()->load(['service', 'serviceRequest'])),
            ]);

        } catch (ApiErrorException $e) {
            Log::error('Stripe confirm error', ['message' => $e->getMessage()]);
            return response()->json(['status' => false, 'message' => 'Could not verify payment.'], 500);
        }
    }

    // ─────────────────────────────────────────────────────────
    // Private helper: consistent payment shape for the frontend
    // ─────────────────────────────────────────────────────────
    private function formatPayment(Payment $payment): array
    {
        return [
            'id'                       => $payment->id,
            'stripe_payment_intent_id' => $payment->stripe_payment_intent_id,
            'service'                  => $payment->service ? [
                'id'    => $payment->service->id,
                'title' => $payment->service->title,
                'icon'  => $payment->service->icon,
            ] : null,
            'service_request_id'   => $payment->service_request_id,
            'amount'               => $payment->amount,
            'processing_fee'       => $payment->processing_fee,
            'total_amount'         => $payment->total_amount,
            'amount_formatted'     => $payment->amount_formatted,
            'total_formatted'      => $payment->total_formatted,
            'currency'             => strtoupper($payment->currency),
            'payment_status'       => $payment->payment_status,
            'status_label'         => $payment->status_label,
            'customer_name'        => $payment->customer_name,
            'customer_email'       => $payment->customer_email,
            'reference_number'     => $payment->reference_number,
            'failure_reason'       => $payment->failure_reason,
            'paid_at'              => $payment->paid_at?->toDateTimeString(),
            'created_at'           => $payment->created_at->toDateTimeString(),
        ];
    }
}