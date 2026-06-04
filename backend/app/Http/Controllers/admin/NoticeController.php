<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TempImage; 
use App\Models\Notice;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;      


class NoticeController extends Controller
{
    public function index(){
        $notices = Notice::orderBy('created_at', 'DESC')->get();
       
        return response()->json([
            'status' => true,
            'data' => $notices
        ]);   

    }
    public function store(Request $request){
        
        //Dummy title change into dummy-title
        $request->merge(['slug' => Str::slug($request->slug)]);

        $validator = Validator::make($request->all(),[
            'title' => 'required',
            'slug' => 'required|unique:notices,slug'
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }
        $notice = new Notice();
        $notice->title = $request->title;
        $notice->slug = Str::slug($request->slug);
        $notice->short_desc = $request->short_desc;
        $notice->content = $request->content;
        $notice->status = $request->status;
        $notice->location = $request->location;
        $notice->save();

         if ($request->imageId > 0){
            $tempImage = TempImage::find($request->imageId);
            if($tempImage != null){
                $extArray = explode('.',$tempImage->name);
                $ext = last($extArray);

                $fileName = strtotime('now').$notice->id.'.'.$ext;

                //create small thumbnail here 
                $sourcePath = public_path('uploads/temp/'.$tempImage->name);
                $destPath = public_path('uploads/notices/small/'.$fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($sourcePath);
                $image ->coverDown(500, 600);
                $image ->toJpeg()->save($destPath);  

                //create large thumbnail here 
                $destPath = public_path('uploads/notices/large/'.$fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($sourcePath);
                $image ->scaleDown(1200);
                $image ->toJpeg()->save($destPath);  

                $notice->image = $fileName;
                $notice->save();

            }
        }

         return response()->json([
            'status' => true,
            'message' => 'notice added sucessfully'
        ]);


    }
    public function update( Request $request, $id){

        $notice = Notice::find($id);

        if($notice == null){
            return response()->json([
                'status' => false,
                'message' => 'Notice not found'
            ]);

            
        }

        $request->merge(['slug' => Str::slug($request->slug)]);

        $validator = Validator::make($request->all(),[
            'title' => 'required',
            'slug' => 'required|unique:notices,slug,'.$id.',id'
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }
        
        $notice->title = $request->title;
        $notice->slug = Str::slug($request->slug);
        $notice->short_desc = $request->short_desc;
        $notice->content = $request->content;
        $notice->status = $request->status;
        $notice->location = $request->location;
        $notice->save();

         if ($request->imageId > 0){
            $oldImage = $notice->image;
            $tempImage = TempImage::find($request->imageId);
            if($tempImage != null){
                $extArray = explode('.',$tempImage->name);
                $ext = last($extArray);

                $fileName = strtotime('now').$notice->id.'.'.$ext;

                //create small thumbnail here 
                $sourcePath = public_path('uploads/temp/'.$tempImage->name);
                $destPath = public_path('uploads/notices/small/'.$fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($sourcePath);
                $image ->coverDown(500, 600);
                $image ->toJpeg()->save($destPath);  

                //create large thumbnail here 
                $destPath = public_path('uploads/notices/large/'.$fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($sourcePath);
                $image ->scaleDown(1200);
                $image ->toJpeg()->save($destPath);  

                $notice->image = $fileName;
                $notice->save();

            }
            if($oldImage != ''){
                    File::delete(public_path('uploads/notices/large/'.$oldImage));
                    File::delete(public_path('uploads/notices/small/'.$oldImage));
                }
        }

         return response()->json([
            'status' => true,
            'message' => 'notice updated sucessfully'
        ]);


    }
    public function show($id){
        $notice = Notice::find($id);

        if($notice == null){
            return response()->json([
                'status' => false,
                'message' => 'Notice not found'
            ]);

        }
        return response()->json([
                'status' => true,
                'data' => $notice
            ]);


    }
    public function destroy($id){
        $notice= Notice::find($id);

        if($notice == null){
            return response()->json([
                'status' => false,
                'message' => 'Notice not found'
            ]);

        }
        File::delete(public_path('uploads/notices/large/'.$notice->image));
        File::delete(public_path('uploads/notices/small/'.$notice->image));
        
        $notice->delete();
        
        return response()->json([
                'status' => true,
                'message' => "Notice deleted sucessfully"
            ]);


    }
}
