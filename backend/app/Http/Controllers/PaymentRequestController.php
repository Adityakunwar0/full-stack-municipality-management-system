<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaymentRequest;

class PaymentRequestController extends Controller
{
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

    // USER: MY PAYMENT REQUESTS
    public function myRequests()
    {
        return PaymentRequest::with('service')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();
    }

    // ADMIN: ALL PAYMENT REQUESTS
    public function allRequests()
    {
        return PaymentRequest::with([
            'user',
            'service'
        ])->latest()->get();
    }

    // UPDATE STATUS (progress / completed / failed)
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

    // SINGLE PAYMENT REQUEST
    public function show($id)
    {
        $paymentRequest = PaymentRequest::with(['user', 'service'])
            ->findOrFail($id);

        return response()->json($paymentRequest);
    }

    // DELETE PAYMENT REQUEST
    public function destroy($id)
    {
        $paymentRequest = PaymentRequest::find($id);

        if ($paymentRequest == null) {
            return response()->json([
                'status' => false,
                'message' => 'Payment Request not found'
            ]);
        }

        $paymentRequest->delete();

        return response()->json([
            'status' => true,
            'message' => 'Payment Request deleted successfully'
        ]);
    }
}