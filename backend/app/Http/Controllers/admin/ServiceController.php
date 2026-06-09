<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;


class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::orderBy('created_at', 'DESC')->get();
       
        return response()->json([
            'status' => true,
            'data' => $services
        ]); 
    }

    public function store(Request $request){

        $validated = $request->validate([
           'icon' => 'required|string|max:255',
           'title' => 'required|string|max:255',
           'description' => 'required|string',
           'btn_text' => 'nullable|string|max:255',
           'color' => 'nullable|string|max:255',
    ]);

    $service = Service::create($validated);

    return response()->json([
        'message' => 'Service Created Successfully',
        'data' => $service
    ], 201);
}

    public function update(Request $request, $id)
{
    $service = Service::findOrFail($id);

    $validated = $request->validate([
        'icon' => 'sometimes|required|string|max:255',
        'title' => 'sometimes|required|string|max:255',
        'description' => 'sometimes|required|string',
        'btn_text' => 'nullable|string|max:255',
        'color' => 'nullable|string|max:255',
    ]);

    $service->update($validated);

    return response()->json([
        'message' => 'Service Updated Successfully',
        'data' => $service
    ]);
}

    public function show($id){
        $services = Service::find($id);

        if($services == null){
            return response()->json([
                'status' => false,
                'message' => 'Service not found'
            ]);

        }
        return response()->json([
                'status' => true,
                'data' => $services
            ]);


    }
    public function destroy($id){
        $service =Service::find($id);

        if($service == null){
            return response()->json([
                'status' => false,
                'message' => 'service not found'
            ]);

        }
        $service->delete();
        
        return response()->json([
                'status' => true,
                'message' => "Service deleted sucessfully"
            ]);


    }
}
