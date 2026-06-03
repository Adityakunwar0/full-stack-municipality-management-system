<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    //
       public function adminDashboard()
    {
        return response()->json([
            'message' => 'Welcome Admin'
        ]);
    }

    public function userDashboard()
    {
        return response()->json([
            'message' => 'Welcome User'
        ]);
    }
}
