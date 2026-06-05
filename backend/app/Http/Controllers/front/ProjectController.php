<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
     // This method will return all active projects
    public function index(){
        $projects = Project::where('status',1)->orderBy('created_at','DESC')->get();
         return response()->json([
                'status' => true,
                'data' => $projects
            ]);
    }

    // This method will return latest active projects
    public function latestProjects(Request $request){
        $projects = Project::where('status',1)
                   ->take($request->get('limit'))
                   ->orderBy('created_at','DESC')->get();
        return response()->json([
                'status' => true,
                'data' => $projects
            ]);
    }
     // This method will return a single service
    public function project($id){
        $project= Project::find($id);

        if($project == null){
            return response()->json([
                'status' => false,
                'data' => "project not found"
            ]);

        }
         return response()->json([
                'status' => true,
                'data' => $project
            ]);
    }
}