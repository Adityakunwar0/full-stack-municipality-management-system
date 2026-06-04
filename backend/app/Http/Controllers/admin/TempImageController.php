<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use App\Models\TempImage; 

class TempImageController extends Controller
{
    public function store (Request $request){

    $validator = Validator::make($request->all(),[
         'image' => 'required|mimes:jpg,png,jpeg,gif'

    ]);
    if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }
        $image = $request->image;
        $ext = $image->getClientOriginalExtension();
        $imageName = strtotime('now').'.'.$ext;

        $model = new TempImage();
        $model->name = $imageName;
        $model->save();

        $image->move(public_path('uploads/temp'), $imageName);  

        $sourcePath = public_path('uploads/temp/'.$imageName);
        $destPath = public_path('uploads/temp/thumb/'.$imageName);

        $manager = new ImageManager(new Driver());
        $interventionImage = $manager->read($sourcePath);   
        $interventionImage->coverDown(300, 300);
       $interventionImage->toJpeg()->save($destPath);

            return response()->json([
                'status' => true,
                'data' => $model,
                'message' => 'Image upload successfully.'
            ]);





    }
}
