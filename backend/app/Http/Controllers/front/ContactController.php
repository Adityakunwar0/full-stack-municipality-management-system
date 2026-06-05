<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactEmail;

class ContactController extends Controller
{
    public function index(Request $request) {
    $validator = Validator::make($request->all(), [
        'name' => 'required',
        'email' => 'required'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'errors' => $validator->errors()
        ]);
    }

    $mailData = [
        'name'    => $request->name,
        'phone'   => $request->phone,
        'email'   => $request->email,
        'subject' => $request->subject,
        'message' => $request->message,
    ];

    
        Mail::to(env('MAIL_FROM_ADDRESS'))->send(new ContactEmail($mailData));
        return response()->json([
            'status'  => true,
            'message' => 'Thanks For Contacting us.'
        ]);
    }
}
