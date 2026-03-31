<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class Item extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'item_code',
        'name',
        'description',
        'unit_type',
        'gst_percentage',
        'is_active',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'gst_percentage' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    // Auto-generate item code before saving
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($item) {
            if (empty($item->item_code)) {
                // Find the highest existing item_code number and increment
                $lastItem = Item::where('item_code', 'like', 'ITM-%')
                    ->orderByRaw("CAST(SUBSTRING(item_code, 5) AS UNSIGNED) DESC")
                    ->first();
                
                $nextNumber = 1;
                if ($lastItem) {
                    $lastNumber = (int) substr($lastItem->item_code, 4);
                    $nextNumber = $lastNumber + 1;
                }
                
                $item->item_code = 'ITM-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
            }
        });
    }

    /**
     * Get all stocks for this item.
     */
    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }

    /**
     * Get all purchase bill items for this item.
     */
    public function purchaseBillItems(): HasMany
    {
        return $this->hasMany(PurchaseBillItem::class);
    }

    /**
     * Get the creator of this item.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this item.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get formatted item code.
     */
    public function getFormattedItemCodeAttribute(): string
    {
        return $this->item_code;
    }

    /**
     * Scope to get only active items.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
