<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthenticationController extends Controller
{
    public function authenticate(Request $request){
        $validator = Validator::make($request->all(),[
            'email' => 'required|email',
            'password' => 'required',
        ]);
         if($validator->fails()){
                return response()->json([
                    'status' => false,
                    'error' => $validator->errors()
                ]);
            }
            $credentials = [
                'email' => $request->email,
                'password' => $request->password,
            ];

            if(Auth::attempt($credentials)){
                $user = Auth::user();
                $token = $user->createToken('token')->plainTextToken;
                return response()->json([
                    'status' => true,
                    'token' => $token,
                    'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Either email/password is incorrect.'
                ]);
            }
    }

    public function logout(){
        $user = User::find(Auth::user()->id);
        $user->tokens()->delete();
        return response()->json([
            'status' => true,
            'message' => 'Logout Sucessfully.'
        ]);


    }
}
