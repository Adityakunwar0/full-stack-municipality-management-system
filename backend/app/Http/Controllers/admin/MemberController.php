<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Member;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\TempImage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class MemberController extends Controller
{
    // this method will return all members 
    public function index(){
        $members = Member::orderBy('created_at', 'DESC')->get();
       
        return response()->json([
            'status' => true,
            'data' => $members
        ]);   

    }
    
    //This method will insert a member in db 
    public function store(Request $request){

        $validator = Validator::make($request->all(),[
            'name' => 'required',
            'job_title' => 'required'
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }
        $member = new Member();
        $member->name = $request->name;
        $member->job_title = $request->job_title;
        $member->facebook_url = $request->facebook_url;
        $member->linkedin_url = $request->linkedin_url;
        $member->instagram_url = $request->instagram_url;
        $member->status = $request->status;
        $member->save();

         if ($request->imageId > 0){
            $tempImage = TempImage::find($request->imageId);
            if($tempImage != null){
                $extArray = explode('.',$tempImage->name);
                $ext = last($extArray);

                $fileName = strtotime('now').$member->id.'.'.$ext;

                //create small thumbnail here 
                $sourcePath = public_path('uploads/temp/'.$tempImage->name);
                $destPath = public_path('uploads/members/'.$fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($sourcePath);
                $image ->coverDown(400, 500);
                $image ->toJpeg()->save($destPath); 

                $member->image = $fileName;
                $member->save();

            }
        }

         return response()->json([
            'status' => true,
            'message' => 'Member added sucessfully'
        ]);


    }
    // This method will update a single member
    public function update($id, Request $request){

        $member = Member::find($id);

        if($member == null){
            return response()->json([
                'status' => false,
                'message' => 'Member not found'
            ]);

            
        }


        $validator = Validator::make($request->all(),[
            'name' => 'required',
            'job_title' => 'required'
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }
        
        $member->name = $request->name;
        $member->job_title = $request->job_title;
        $member->facebook_url = $request->facebook_url;
        $member->linkedin_url = $request->linkedin_url;
        $member->instagram_url = $request->instagram_url;
        $member->status = $request->status;
        $member->save();
       

         if ($request->imageId > 0){
            $oldImage = $member->image;
            $tempImage = TempImage::find($request->imageId);
            if($tempImage != null){
                $extArray = explode('.',$tempImage->name);
                $ext = last($extArray);

                $fileName = strtotime('now').$member->id.'.'.$ext;

                //create small thumbnail here 
                $sourcePath = public_path('uploads/temp/'.$tempImage->name);
                $destPath = public_path('uploads/members/'.$fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($sourcePath);
                $image ->coverDown(400, 500);
                $image ->toJpeg()->save($destPath);  

                $member->image = $fileName;
                $member->save();

            }
            if($oldImage != ''){
                    File::delete(public_path('uploads/members/'.$oldImage));
                }
        }

         return response()->json([
            'status' => true,
            'message' => 'Member updated sucessfully'
        ]);


    }
    //Fetch member By id
    public function show($id){
        $members = Member::find($id);

        if($members == null){
            return response()->json([
                'status' => false,
                'message' => 'Member not found'
            ]);

        }
        return response()->json([
                'status' => true,
                'data' => $members
            ]);


    }
    public function destroy($id){
        $member = Member::find($id);

        if($member == null){
            return response()->json([
                'status' => false,
                'message' => 'Member not found'
            ]);

        }
        File::delete(public_path('uploads/members/'.$member->image));
        
        $member->delete();
        
        return response()->json([
                'status' => true,
                'message' => "Member deleted sucessfully"
            ]);


    }
}
