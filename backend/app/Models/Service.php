<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ServiceRequest;

class Service extends Model
{
     protected $fillable = [         
        'icon',
        'title',
        'description',
        'btn_text',
        'color',
        'amount'
    ];
    public function requests()
    {
        return $this->hasMany(ServiceRequest::class);
    }
}
