<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\UserProfile;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;

class ProfileController extends Controller
{
    /**
     * List all profiles with their user
     */
    public function index()
    {
        $profiles = UserProfile::with('user')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $profiles
        ]);
    }

    /**
     * Get a single profile
     */
    public function show($id)
    {
        $profile = UserProfile::with('user')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $profile
        ]);
    }

    /**
     * Update profile fields + optional new profile image
     */
    public function update(Request $request, $id)
    {
        $profile = UserProfile::findOrFail($id);

        $validated = $request->validate([
            'citizen_name'  => 'nullable|string|max:255',
            'citizen_number' => 'nullable|string|max:255',
            'nid_number' => 'nullable|string|max:255',
            'phone'       => 'nullable|string|max:20',
            'dob'         => 'nullable|date',           
            'gender'         => 'nullable|in:male,female,other',
            'address'     => 'nullable|string',
            'about_me'    => 'nullable|string',
        ]);

        $profile->update($validated);

        // Handle profile image via TempImage (same pattern as TestimonialController)
        if ($request->imageId > 0) {
            $oldImage  = $profile->profile_image;
            $tempImage = TempImage::find($request->imageId);

            if ($tempImage != null) {
                $extArray = explode('.', $tempImage->name);
                $ext = last($extArray);

                $fileName = strtotime('now') . $profile->id . '.' . $ext;

                $sourcePath = public_path('uploads/temp/' . $tempImage->name);
                $destPath   = public_path('uploads/profiles/' . $fileName);

                $manager = new ImageManager(Driver::class);
                $image   = $manager->read($sourcePath);
                $image->coverDown(300, 300);
                $image->toJpeg()->save($destPath); 

                $profile->profile_image = $fileName;
                $profile->save();

                // Delete old image if one existed
                if ($oldImage != '') {
                    File::delete(public_path('uploads/profiles/' . $oldImage));
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile Updated Successfully',
            'data'    => $profile
        ]);
    }

   
    public function destroy($id)
    {
        $profile = UserProfile::find($id);

        if ($profile == null) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found'
            ]);
        }

        if ($profile->profile_image != '') {
            File::delete(public_path('uploads/profiles/' . $profile->profile_image));
        }

        $profile->delete();

        return response()->json([
            'success' => true,
            'message' => 'Profile deleted successfully'
        ]);
    }
}