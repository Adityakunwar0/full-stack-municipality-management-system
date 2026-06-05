<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Quote;

class QuoteController extends Controller
{
     public function index(){
        $quotes = Quote::where('status',1)->orderBy('created_at','DESC')->get();
         return response()->json([
                'status' => true,
                'data' => $quotes
            ]);
    }
}
