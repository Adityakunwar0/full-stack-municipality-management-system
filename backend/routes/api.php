<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\admin\DashboardController;

Route::post('authenticate', [AuthenticationController::class,'authenticate']);


Route::group(['middleware' => ['auth:sanctum']], function(){ 

    Route::middleware('role:admin')->group(function () {

        Route::get('/admin/dashboard', [DashboardController::class, 'adminDashboard']);

    });

    Route::middleware('role:user')->group(function () {

        Route::get('/user/dashboard', [DashboardController::class, 'userDashboard']);

    });
  

});