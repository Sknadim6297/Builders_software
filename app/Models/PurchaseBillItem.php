<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class PurchaseBillItem extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'purchase_bill_id',
        'item_id',
        'hsn_code',
        'quantity',
        'unit_price',
        'discount_percentage',
        'total',
        'gst_percentage'
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'total' => 'decimal:2',
        'gst_percentage' => 'decimal:2'
    ];

    /**
     * Get the purchase bill this item belongs to.
     */
    public function purchaseBill(): BelongsTo
    {
        return $this->belongsTo(PurchaseBill::class);
    }

    /**
     * Get the item master record.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
