<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Service;
use App\Models\User;
use App\Models\ServiceRequest;
 
class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'service_id',
        'service_request_id',
        'stripe_payment_intent_id',
        'stripe_client_secret',
        'amount',
        'processing_fee',
        'total_amount',
        'currency',
        'payment_status',
        'customer_name',
        'customer_email',
        'customer_phone',
        'reference_number',
        'failure_reason',
        'paid_at',
    ];
 
    protected $casts = [
        'paid_at' => 'datetime',
    ];
 
    // ── Relationships ─────────────────────────────────────────
 
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
 
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
 
    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class);
    }
 
    // ── Accessors ─────────────────────────────────────────────
 
    /** Amount in dollars (e.g. "$150.00") */
    public function getAmountFormattedAttribute(): string
    {
        return '$' . number_format($this->amount / 100, 2);
    }
 
    /** Total in dollars */
    public function getTotalFormattedAttribute(): string
    {
        return '$' . number_format($this->total_amount / 100, 2);
    }
 
    /** Human-readable label for status */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->payment_status) {
            'progress'  => 'In Progress',
            'completed' => 'Completed',
            'failed'    => 'Failed',
            default     => ucfirst($this->payment_status),
        };
    }
 
    // ── Helpers ───────────────────────────────────────────────
 
    public function isCompleted(): bool
    {
        return $this->payment_status === 'completed';
    }
 
    public function isFailed(): bool
    {
        return $this->payment_status === 'failed';
    }
 
    public function isProgress(): bool
    {
        return $this->payment_status === 'progress';
    }
}