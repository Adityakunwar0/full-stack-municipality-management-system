<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaymentRequest;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class PaymentRequestController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    // CREATE PAYMENT REQUEST (Apply / Pay request)
    public function apply(Request $request)
    {
        $paymentRequest = PaymentRequest::create([
            'user_id' => auth()->id(),
            'service_id' => $request->service_id,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'request_status' => 'progress'
        ]);

        return response()->json([
            'message' => 'Payment Request Created Successfully',
            'data' => $paymentRequest
        ]);
    }

    public function myRequests()
    {
        return PaymentRequest::with('service')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();
    }

    public function allRequests()
    {
        return PaymentRequest::with(['user', 'service'])->latest()->get();
    }

    public function updateStatus(Request $request, $id)
    {
        $paymentRequest = PaymentRequest::findOrFail($id);
        $paymentRequest->request_status = $request->request_status;
        $paymentRequest->payment_method = $request->payment_method;
        $paymentRequest->save();

        return response()->json([
            'message' => 'Payment Status Updated',
            'data' => $paymentRequest
        ]);
    }

    public function show($id)
    {
        $paymentRequest = PaymentRequest::with(['user', 'service'])->findOrFail($id);
        return response()->json($paymentRequest);
    }

    public function destroy($id)
    {
        $paymentRequest = PaymentRequest::find($id);

        if ($paymentRequest == null) {
            return response()->json(['status' => false, 'message' => 'Payment Request not found']);
        }

        $paymentRequest->delete();

        return response()->json(['status' => true, 'message' => 'Payment Request deleted successfully']);
    }

    // CREATE A STRIPE CHECKOUT SESSION FOR A PAYMENT REQUEST
    public function createCheckoutSession(Request $request, $id)
    {
        $paymentRequest = PaymentRequest::with('service')->findOrFail($id);

        // Authorization: only the owner (or an admin) can pay this request
        if (auth()->id() !== $paymentRequest->user_id && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($paymentRequest->request_status === 'completed') {
            return response()->json(['message' => 'This payment has already been completed.'], 422);
        }

        // Always derive the amount server-side from the stored record, never trust client input here
        $amountInCents = (int) round($paymentRequest->amount * 100);

        $session = Session::create([
            'payment_method_types' => ['card'],
            'mode' => 'payment',
            'line_items' => [[
                'price_data' => [
                    'currency' => 'npr', 
                    'product_data' => [
                        'name' => $paymentRequest->service->title ?? 'Municipality Payment',
                    ],
                    'unit_amount' => $amountInCents,
                ],
                'quantity' => 1,
            ]],
            'metadata' => [
                'payment_request_id' => $paymentRequest->id,
            ],
            'success_url' => config('app.frontend_url') . '/pay/success?session_id={CHECKOUT_SESSION_ID}&payment_request_id=' . $paymentRequest->id,
            'cancel_url' => config('app.frontend_url') . '/pay/cancel?payment_request_id=' . $paymentRequest->id,
        ]);

        return response()->json([
            'checkout_url' => $session->url,
        ]);
    }
    public function cancelPayment(Request $request, $id)
{
    $paymentRequest = PaymentRequest::findOrFail($id);

    if (auth()->id() !== $paymentRequest->user_id && auth()->user()->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    // Don't override a payment that already completed (e.g. tab race condition)
    if ($paymentRequest->request_status !== 'completed') {
        $paymentRequest->request_status = 'rejected';
        $paymentRequest->save();
    }

    return response()->json([
        'message' => 'Payment marked as rejected',
        'data' => $paymentRequest
    ]);
}
public function confirmPayment(Request $request, $id)
{
    $paymentRequest = PaymentRequest::findOrFail($id);

    if (auth()->id() !== $paymentRequest->user_id && auth()->user()->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $sessionId = $request->query('session_id');

    if (!$sessionId) {
        return response()->json(['message' => 'Missing session_id'], 422);
    }

    try {
        $session = \Stripe\Checkout\Session::retrieve($sessionId);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Could not verify session with Stripe'], 422);
    }

    // Confirm this session actually belongs to this payment request
    $sessionPaymentRequestId = $session->metadata->payment_request_id ?? null;
    if ((string) $sessionPaymentRequestId !== (string) $paymentRequest->id) {
        return response()->json(['message' => 'Session does not match this payment request'], 422);
    }

    if ($session->payment_status === 'paid' && $paymentRequest->request_status !== 'completed') {
        $paymentRequest->request_status = 'completed';
        $paymentRequest->payment_method = 'stripe';
        $paymentRequest->save();
    }

    return response()->json([
        'message' => 'Payment status confirmed',
        'data' => $paymentRequest
    ]);
}
}