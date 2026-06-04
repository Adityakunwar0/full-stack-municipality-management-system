<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Member;

class MemberController extends Controller
{
     public function index(){
        $members = Member::where('status',1)->orderBy('created_at','DESC')->get();
         return response()->json([
                'status' => true,
                'data' => $members
            ]);
    }
}
