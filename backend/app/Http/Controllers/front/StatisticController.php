<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Statistic;

class StatisticController extends Controller
{
    // This method will return all active statistics
     public function index(){
       $statistics = Statistic::orderBy('created_at','DESC')->get();
         return response()->json([
                'status' => true,
                'data' => $statistics
            ]);
    }
}
