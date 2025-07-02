<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Vendor extends Model
{
    protected $fillable = [
        'vend_id',
        'name',
        'mobile_number',
        'address',
        'pincode',
        'location',
        'alternate_mobile',
        'date',
        'time',
        'supply_of_goods',
        'gst_number',
        'is_active'
    ];

    protected $casts = [
        'date' => 'date',
        'is_active' => 'boolean'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($vendor) {
            // Auto-generate Vendor ID
            $lastVendor = static::orderBy('id', 'desc')->first();
            $nextId = $lastVendor ? $lastVendor->id + 1 : 1;
            $vendor->vend_id = 'VEND' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

            // Auto-set date and time if not provided
            if (!$vendor->date) {
                $vendor->date = Carbon::now()->toDateString();
            }
            if (!$vendor->time) {
                $vendor->time = Carbon::now()->toTimeString();
            }
        });
    }
}
