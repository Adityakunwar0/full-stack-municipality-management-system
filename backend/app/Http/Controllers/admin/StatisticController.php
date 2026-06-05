<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Statistic; 

class StatisticController extends Controller
{
    // this method will return all statistics 
    public function index(){
        $statistics = Statistic::orderBy('created_at', 'DESC')->get();
       
        return response()->json([
            'status' => true,
            'data' => $statistics
        ]);   

    }
    //This method will insert a statstic in db 

    public function store(Request $request){
        
        
        $statistic = new Statistic();
        $statistic->icon_name = $request->icon_name;
        $statistic->number = $request->number;
        $statistic->title = $request->title;
        $statistic->slog = $request->slog;
        $statistic->save();

        return response()->json([
            'status' => true,
            'message' => 'statistic added sucessfully'
        ]);


    }
    public function update( Request $request, $id){

        $statistic = Statistic::find($id);

        if($statistic == null){
            return response()->json([
                'status' => false,
                'message' => 'Statistic not found'
            ]);

            
        }       
        $statistic->icon_name = $request->icon_name;
        $statistic->number = $request->number;
        $statistic->title = $request->title;
        $statistic->slog = $request->slog;
        $statistic->save();

        return response()->json([
            'status' => true,
            'message' => 'statistic updated sucessfully'
        ]);


    }
    public function show($id){
        $statistic= Statistic::find($id);

        if($statistic == null){
            return response()->json([
                'status' => false,
                'message' => 'Statistic not found'
            ]);

        }
        return response()->json([
                'status' => true,
                'data' => $statistic
            ]);


    }
    public function destroy($id){
        $statistic = Statistic::find($id);

        if($statistic == null){
            return response()->json([
                'status' => false,
                'message' => 'Statistic not found'
            ]);

        }
        
        $statistic->delete();
        
        return response()->json([
                'status' => true,
                'message' => "Statistic deleted sucessfully"
            ]);


    }

}
