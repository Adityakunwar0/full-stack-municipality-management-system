<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Quote;
use Illuminate\Support\Facades\Validator;
use App\Models\TempImage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;  

class QuoteController extends Controller
{
    public function index(){
        $quotes = Quote::orderBy('created_at', 'DESC')->get();
       
        return response()->json([
            'status' => true,
            'data' => $quotes
        ]);   

    }
    
    //This method will insert a quote in db 
    public function store(Request $request){

        $validator = Validator::make($request->all(),[
            'quote' => 'required',
            'name' => 'required'
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }
        $quote = new Quote();
        $quote->quote = $request->quote;
        $quote->name = $request->name;
        $quote->designation_title = $request->designation_title;
        $quote->status = $request->status;
        $quote->save();

         if ($request->imageId > 0){
            $tempImage = TempImage::find($request->imageId);
            if($tempImage != null){
                $extArray = explode('.',$tempImage->name);
                $ext = last($extArray);

                $fileName = strtotime('now').$quote->id.'.'.$ext;

                //create small thumbnail here 
                $sourcePath = public_path('uploads/temp/'.$tempImage->name);
                $destPath = public_path('uploads/quotes/'.$fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($sourcePath);
                $image ->coverDown(800, 800);
                $image ->toJpeg()->save($destPath); 

                $quote->image = $fileName;
                $quote->save();

            }
        }

         return response()->json([
            'status' => true,
            'message' => 'Quote added sucessfully'
        ]);


    }
    // This method will update a single quote
   public function update($id, Request $request){

    $quote = Quote::find($id);

    if($quote == null){
        return response()->json([
            'status' => false,
            'message' => 'Quote not found'
        ]);
    }

    $validator = Validator::make($request->all(),[
        'quote' => 'required',
        'name' => 'required'
    ]);

    if($validator->fails()){
        return response()->json([
            'status' => false,
            'errors' => $validator->errors()
        ]);
    }
    
    // ✅ Fixed: was "new Quote()" which creates a new record instead of updating
    $quote->quote = $request->quote;
    $quote->name = $request->name;
    $quote->designation_title = $request->designation_title;
    $quote->status = $request->status;
    $quote->save();

    if ($request->imageId > 0){
        $oldImage = $quote->image; // ✅ Fixed: moved BEFORE image is overwritten
        $tempImage = TempImage::find($request->imageId);
        if($tempImage != null){
            $extArray = explode('.',$tempImage->name);
            $ext = last($extArray);

            $fileName = strtotime('now').$quote->id.'.'.$ext;

            $sourcePath = public_path('uploads/temp/'.$tempImage->name);
            $destPath = public_path('uploads/quotes/'.$fileName);
            $manager = new ImageManager(Driver::class);
            $image = $manager->read($sourcePath);
            $image->coverDown(800, 800);
            $image->toJpeg()->save($destPath);

            $quote->image = $fileName;
            $quote->save();

            // ✅ Fixed: delete old image after saving new one
            if($oldImage != ''){
                File::delete(public_path('uploads/quotes/'.$oldImage));
            }
        }
    }

    return response()->json([
        'status' => true,
        'message' => 'Quote updated successfully'
    ]);
}
    //Fetch quote By id
    public function show($id){
        $quotes = Quote::find($id);

        if($quotes == null){
            return response()->json([
                'status' => false,
                'message' => 'Quote not found'
            ]);

        }
        return response()->json([
                'status' => true,
                'data' => $quotes
            ]);


    }
    public function destroy($id){
        $quote = Quote::find($id);

        if($quote == null){
            return response()->json([
                'status' => false,
                'message' => 'Quote not found'
            ]);

        }
        File::delete(public_path('uploads/quotes/'.$quote->image));
        
        $quote->delete();
        
        return response()->json([
                'status' => true,
                'message' => "Quote deleted sucessfully"
            ]);


    }
}
