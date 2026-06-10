<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServiceRequest;

class ServiceRequestController extends Controller
{
    public function apply(Request $request)
    {
        $serviceRequest = ServiceRequest::create([
            'user_id' => auth()->id(),
            'service_id' => $request->service_id,
            'remarks' => $request->remarks,
            'request_status' => 'progress'
        ]);

        return response()->json([
            'message' => 'Application Submitted Successfully',
            'data' => $serviceRequest
        ]);
    }

    public function myRequests()
    {
        return ServiceRequest::with('service')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();
    }

    public function allRequests()
    {
        return ServiceRequest::with([
            'user',
            'service'
        ])->latest()->get();
    }

   public function updateStatus(Request $request,$id)
{
    $requestData = ServiceRequest::findOrFail($id);

    $requestData->request_status = $request->request_status;
    $requestData->save();

    return response()->json([
        'message' => 'Status Updated',
        'data' => $requestData
    ]);
}
    public function show($id)
{
    $request = ServiceRequest::with(['user', 'service'])->findOrFail($id);
    return response()->json($request);
}
}
