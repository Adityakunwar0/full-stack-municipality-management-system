<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notice;


class NoticeController extends Controller
{
    public function index(){
        $notices = Notice::where('status',1)->orderBy('created_at','DESC')->get();
         return response()->json([
                'status' => true,
                'data' => $notices
            ]);
    }

    // This method will return latest active projects
    public function latestNotices(Request $request){
        $notices = Notice::where('status',1)
                   ->take($request->get('limit'))
                   ->orderBy('created_at','DESC')->get();
        return response()->json([
                'status' => true,
                'data' => $notices
            ]);
    }
     // This method will return a single service
    public function notice($id){
        $notice = Notice::find($id);

        if($notice == null){
            return response()->json([
                'status' => false,
                'data' => "notice not found"
            ]);

        }
         return response()->json([
                'status' => true,
                'data' => $notice
            ]);
    }
}
