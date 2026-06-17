<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Complaint;

class ComplaintController extends Controller {

    public function index(){
       
        $complaints = Complaint::latest()->get();
        
        return response()->json([
            'status' => true,
            'data' => $complaints
        ]);
    }

    public function store(Request $request){
        
        $validator = Validator::make($request->all(),[
            'full_name' => 'required',
            'ward' => 'required',
            'citizenship_id' => 'required',
            'phone' => 'required',
            'subject' => 'required',
            'complaint' => 'required'
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }

        $token = 'CMP -' . strtoupper(Str::random(8));

        $complaint = Complaint::create([
            'token_number' => $token,
            'full_name' => $request->full_name,
            'ward' => $request->ward,
            'citizenship_id' => $request->citizenship_id,
            'phone' => $request->phone,
            'email' => $request->email,
            'subject' => $request->subject,
            'complaint' => $request->complaint,
            'status' => 'Pending'

        ]);

        return response()->json([
            'status' => true,
            'message' => 'Complaint submitted successfully',
            'token_number' => $token
        ]);
    }

    public function checkStatus($token){
        
        $complaint = Complaint::where(
            'token_number',
            $token
        )->first();

        if (!$complaint) {
            return response()->json([
            'status' => false,
            'message' => 'Invalid Token Number'
            ]);
        }
        return response()->json([
            'status' => true,
            'data' => $complaint
        ]);
    }

    public function updateStatus(Request $request, $id) {
        
        $complaint = Complaint::findOrFail($id);
        $complaint->status = $request->status;
        $complaint->save();

        return response()->json([
            'status' => true,
            'message' => 'Status updated successfully'
        ]);
    }
    public function show($id){

        $complaint = Complaint::find($id);
        return response()->json([
            'status' => true,
            'data' => $complaint
        ]);
    }

    public function destroy($id){
        
        $complaint = Complaint::find($id);
        
        if (!$complaint) {
            return response()->json([
                'status' => false,
                'message' => 'Complaint not found'
            ]);
        }
        $complaint->delete();
        return response()->json([
           'status' => true,
           'message' => 'Complaint deleted successfully'
        ]);
    }

}
