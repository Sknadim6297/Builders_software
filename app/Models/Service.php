<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Service extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'serv_id',
        'name',
        'description',
        'price',
        'gst_percentage',
        'final_price',
        'is_active'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'gst_percentage' => 'decimal:2',
        'final_price' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    // Auto-generate service ID before saving
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($service) {
            if (empty($service->serv_id)) {
                // Find the highest existing serv_id number and increment
                $lastService = Service::where('serv_id', 'like', 'SRV-%')
                    ->orderByRaw("CAST(SUBSTRING(serv_id, 5) AS UNSIGNED) DESC")
                    ->first();
                
                $nextNumber = 1;
                if ($lastService) {
                    $lastNumber = (int) substr($lastService->serv_id, 4);
                    $nextNumber = $lastNumber + 1;
                }
                
                $service->serv_id = 'SRV-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
            }
            
            // Calculate final price with GST
            $service->calculateFinalPrice();
        });

        static::updating(function ($service) {
            // Recalculate final price when updating
            $service->calculateFinalPrice();
        });
    }

    // Calculate final price including GST
    public function calculateFinalPrice()
    {
        $price = $this->price ?? 0;
        $gstPercentage = $this->gst_percentage ?? 0;
        
        if ($gstPercentage > 0) {
            $gstAmount = ($price * $gstPercentage) / 100;
            $this->final_price = $price + $gstAmount;
        } else {
            $this->final_price = $price;
        }
    }

    // Accessor for formatted final price
    public function getFormattedFinalPriceAttribute()
    {
        return '₹' . number_format($this->final_price, 2);
    }

    // Accessor for formatted price
    public function getFormattedPriceAttribute()
    {
        return '₹' . number_format($this->price, 2);
    }

    public function consumables(): BelongsToMany
    {
        return $this->belongsToMany(Stock::class, 'service_consumables')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
