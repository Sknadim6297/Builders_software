<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class StockMovement extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'stock_id',
        'movement_type', // 'in', 'out', 'adjustment'
        'quantity',
        'unit_cost',
        'total_cost',
        'reference_type', // 'purchase_bill', 'sale', 'adjustment'
        'reference_id',
        'notes',
        'created_by'
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_cost' => 'decimal:2',
        'total_cost' => 'decimal:2'
    ];

    /**
     * Get the stock item that this movement belongs to.
     */
    public function stock(): BelongsTo
    {
        return $this->belongsTo(Stock::class);
    }

    /**
     * Get the user who created this movement.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the reference model (polymorphic relation).
     */
    public function reference()
    {
        if ($this->reference_type === 'purchase_bill') {
            return $this->belongsTo(PurchaseBill::class, 'reference_id');
        }
        
        return null;
    }
}
