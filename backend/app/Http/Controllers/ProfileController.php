<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserProfile;
use App\Models\TempImage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile
     */
    public function show()
    {
        $user = auth()->user();

        $profile = UserProfile::where('user_id', $user->id)->first();

        return response()->json([
            'success' => true,
            'data' => $profile
        ]);
    }

    /**
     * Store or update the authenticated user's profile
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        $profile = UserProfile::where('user_id', $user->id)->first();

        if ($profile && $profile->is_locked) {
            return response()->json([
                'message' => 'Profile already submitted'
            ], 403);
        }

        $profile = UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'phone'          => $request->phone,
                'citizen_name'  => $request->citizen_name,
                'dob'            => $request->dob,
                'gender'         => $request->gender,
                'citizen_number' => $request->citizen_number,
                'nid_number'     => $request->nid_number,
                'address'        => $request->address,
                'about_me'       => $request->about_me,
                'is_locked'      => true
            ]
        );

        // Handle profile image via TempImage (same pattern as Testimonial)
        if ($request->imageId > 0) {
            $oldImage  = $profile->profile_image;
            $tempImage = TempImage::find($request->imageId);

            if ($tempImage != null) {
                $extArray = explode('.', $tempImage->name);
                $ext      = last($extArray);

                $fileName = strtotime('now') . $profile->id . '.' . $ext;

                $sourcePath = public_path('uploads/temp/' . $tempImage->name);
                $destPath   = public_path('uploads/profiles/' . $fileName);

                // Ensure directory exists
                if (!File::exists(public_path('uploads/profiles'))) {
                    File::makeDirectory(public_path('uploads/profiles'), 0755, true);
                }

                $manager = new ImageManager(new Driver());
                $image   = $manager->read($sourcePath);
                $image->coverDown(300, 300);
                $image->save($destPath);

                $profile->profile_image = $fileName;
                $profile->save();

                // Delete old profile image if it existed
                if ($oldImage != '') {
                    File::delete(public_path('uploads/profiles/' . $oldImage));
                }
            }
        }

        return response()->json([
            'message' => 'Profile Saved Successfully',
            'data'    => $profile
        ]);
    }
}