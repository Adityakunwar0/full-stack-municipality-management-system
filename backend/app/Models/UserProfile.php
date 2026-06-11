<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable = [
        'user_id',
        'citizen_name',
        'dob',
        'phone',
        'gender',
        'citizen_number',
        'nid_number',
        'address',
        'about_me',
        'profile_image',
        'is_locked'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
