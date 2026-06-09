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
use App\Http\Controllers\admin\QuoteController;
use App\Http\Controllers\front\QuoteController as FrontQuoteController;
use App\Http\Controllers\front\ContactController;
use App\Http\Controllers\admin\ComplaintController;
use App\Http\Controllers\front\ServiceController as FrontServiceController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\admin\ServiceController;


Route::post('authenticate', [AuthenticationController::class,'authenticate']);

Route::get('get-projects', [FrontProjectController::class,'index']);
Route::get('get-latest-projects', [FrontProjectController::class,'latestProjects']);
Route::get('get-project/{id}', [FrontProjectController::class,'project']);

Route::get('get-notices', [FrontNoticeController::class,'index']);
Route::get('get-latest-notices', [FrontNoticeController::class,'latestNotices']);
Route::get('get-notice/{id}', [FrontNoticeController::class,'notice']);

Route::get('get-services', [FrontServiceController::class,'index']);
Route::get('get-latest-services', [FrontServiceController::class,'latestServices']);
Route::get('get-service/{id}', [FrontServiceController::class,'service']);

Route::get('get-members', [FrontMemberController::class,'index']);

Route::get('get-statistics', [FrontStatisticController::class,'index']);

Route::get('get-quotes', [FrontQuoteController::class,'index']);

Route::post('contact-now', [ContactController::class,'index']);

Route::post('complaints', [ComplaintController::class, 'store']);
 Route::get( 'complaints/status/{token}', [ComplaintController::class, 'checkStatus']);


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

        Route::post('quotes', [QuoteController::class,'store']);
        Route::get('quotes', [QuoteController::class,'index']);
        Route::get('quotes/{id}', [QuoteController::class,'show']);
        Route::put('quotes/{id}', [QuoteController::class,'update']);
        Route::delete('quotes/{id}', [QuoteController::class,'destroy']);

        
        Route::get('complaints', [ComplaintController::class,'index']);
        Route::get('complaints/{id}', [ComplaintController::class,'show']);
       
        Route::put('complaints/{id}/status',[ComplaintController::class, 'updateStatus']);

         Route::get('admin/requests', [ServiceRequestController::class, 'allRequests']);
         Route::get('admin/request/{id}', [ServiceRequestController::class, 'show']);
         Route::put('admin/request/{id}', [ServiceRequestController::class, 'updateStatus']);

        Route::post('services', [ServiceController::class,'store']);
        Route::get('services', [ServiceController::class,'index']);
        Route::get('services/{id}', [ServiceController::class,'show']);
        Route::put('services/{id}', [ServiceController::class,'update']);
        Route::delete('services/{id}', [ServiceController::class,'destroy']);


        

    });

    Route::middleware('role:user')->group(function () {

        Route::get('/user/dashboard', [DashboardController::class, 'userDashboard']);



        Route::post('user/apply-service', [ServiceRequestController::class, 'apply']);
        Route::get('user/my-requests', [ServiceRequestController::class, 'myRequests']);

    });
  

});