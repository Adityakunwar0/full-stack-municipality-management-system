<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
     protected $fillable = [
        'token_number',
        'full_name',
        'ward',
        'citizenship_id',
        'phone',
        'email',
        'subject',
        'complaint',
        'status',
    ];
}
