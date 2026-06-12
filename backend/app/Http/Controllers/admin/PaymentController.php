<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // ─────────────────────────────────────────────────────────
    // GET /admin/payments
    // All payments across all users with summary counts
    // ─────────────────────────────────────────────────────────
    public function index(): JsonResponse
    {
        $payments = Payment::with(['user', 'service', 'serviceRequest'])
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
    // GET /admin/payments/{id}
    // Single payment detail
    // ─────────────────────────────────────────────────────────
    public function show($id): JsonResponse
    {
        $payment = Payment::with(['user', 'service', 'serviceRequest'])->findOrFail($id);

        return response()->json([
            'status' => true,
            'data'   => $this->formatPayment($payment),
        ]);
    }

    // ─────────────────────────────────────────────────────────
    // Private helper: full payment shape including user info
    // ─────────────────────────────────────────────────────────
    private function formatPayment(Payment $payment): array
    {
        return [
            'id'                       => $payment->id,
            'stripe_payment_intent_id' => $payment->stripe_payment_intent_id,
            'user'    => $payment->user ? [
                'id'    => $payment->user->id,
                'name'  => $payment->user->name,
                'email' => $payment->user->email,
            ] : null,
            'service' => $payment->service ? [
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