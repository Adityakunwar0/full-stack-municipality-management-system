<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\admin\DashboardController;
use App\Http\Controllers\admin\TempImageController;
use App\Http\Controllers\admin\ProjectController;
use App\Http\Controllers\front\ProjectController as FrontProjectController;
use App\Http\Controllers\admin\NoticeController;
use App\Http\Controllers\front\NoticeController as FrontNoticeController;


Route::post('authenticate', [AuthenticationController::class,'authenticate']);

Route::get('get-projects', [FrontProjectController::class,'index']);
Route::get('get-latest-projects', [FrontProjectController::class,'latestProjects']);
Route::get('get-project/{id}', [FrontProjectController::class,'project']);

Route::get('get-notices', [FrontNoticeController::class,'index']);
Route::get('get-latest-notices', [FrontNoticeController::class,'latestNotices']);
Route::get('get-notice/{id}', [FrontNoticeController::class,'notice']);



Route::group(['middleware' => ['auth:sanctum']], function(){ 

    Route::middleware('role:admin')->group(function () {

        Route::get('admin/dashboard', [DashboardController::class, 'adminDashboard']);
        Route::post('temp-images', [TempImageController::class,'store']); 

        Route::post('projects', [ProjectController::class,'store']);
        Route::get('projects', [ProjectController::class,'index']);
        Route::put('projects/{id}', [ProjectController::class,'update']);
        Route::get('projects/{id}', [ProjectController::class,'show']);
        Route::delete('projects/{id}', [ProjectController::class,'destroy']);

        Route::post('notices', [NoticeController::class,'store']);
        Route::get('notices', [NoticeController::class,'index']);
        Route::put('notices/{id}', [NoticeController::class,'update']);
        Route::get('notices/{id}', [NoticeController::class,'show']);
        Route::delete('notices/{id}', [NoticeController::class,'destroy']);

        

    });

    Route::middleware('role:user')->group(function () {

        Route::get('/user/dashboard', [DashboardController::class, 'userDashboard']);

    });
  

});