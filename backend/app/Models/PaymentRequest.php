<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Service;
use App\Models\User;

class PaymentRequest extends Model
{
    protected $fillable = [
        'user_id',
        'service_id',
        'request_status',
        'amount',
        'payment_method',
        'status'
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
