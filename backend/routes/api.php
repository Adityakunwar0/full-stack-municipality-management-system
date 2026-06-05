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
use App\Http\Controllers\admin\MemberController;
use App\Http\Controllers\front\MemberController as FrontMemberController;
use App\Http\Controllers\admin\StatisticController;
use App\Http\Controllers\front\StatisticController as FrontStatisticController;


Route::post('authenticate', [AuthenticationController::class,'authenticate']);

Route::get('get-projects', [FrontProjectController::class,'index']);
Route::get('get-latest-projects', [FrontProjectController::class,'latestProjects']);
Route::get('get-project/{id}', [FrontProjectController::class,'project']);

Route::get('get-notices', [FrontNoticeController::class,'index']);
Route::get('get-latest-notices', [FrontNoticeController::class,'latestNotices']);
Route::get('get-notice/{id}', [FrontNoticeController::class,'notice']);

Route::get('get-members', [FrontMemberController::class,'index']);

Route::get('get-statistics', [FrontStatisticController::class,'index']);



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

        Route::post('members', [MemberController::class,'store']);
        Route::get('members', [MemberController::class,'index']);
        Route::get('members/{id}', [MemberController::class,'show']);
        Route::put('members/{id}', [MemberController::class,'update']);
        Route::delete('members/{id}', [MemberController::class,'destroy']);

        Route::post('statistics', [StatisticController::class,'store']);
        Route::get('statistics', [StatisticController::class,'index']);
        Route::get('statistics/{id}', [StatisticController::class,'show']);
        Route::put('statistics/{id}', [StatisticController::class,'update']);
        Route::delete('statistics/{id}', [StatisticController::class,'destroy']);

        

    });

    Route::middleware('role:user')->group(function () {

        Route::get('/user/dashboard', [DashboardController::class, 'userDashboard']);

    });
  

});