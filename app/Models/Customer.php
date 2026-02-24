<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Customer extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'cust_id',
        'name',
        'mobile_number',
        'address',
        'pincode',
        'location',
        'alternate_mobile',
        'date',
        'time',
        'source',
        'gst_number',
        'is_active'
    ];

    protected $casts = [
        'date' => 'date',
        'is_active' => 'boolean'
    ];

    // Auto-generate customer ID and set date/time before saving
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($customer) {
            if (empty($customer->cust_id)) {
                $customer->cust_id = 'CUST-' . str_pad(Customer::count() + 1, 6, '0', STR_PAD_LEFT);
            }
            
            // Auto fetch current date and time
            if (empty($customer->date)) {
                $customer->date = Carbon::now()->toDateString();
            }
            if (empty($customer->time)) {
                $customer->time = Carbon::now()->toTimeString();
            }
        });
    }

    // Accessor for formatted mobile number
    public function getFormattedMobileAttribute()
    {
        return '+91 ' . $this->mobile_number;
    }

    // Accessor for formatted alternate mobile
    public function getFormattedAlternateMobileAttribute()
    {
        return $this->alternate_mobile ? '+91 ' . $this->alternate_mobile : null;
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
