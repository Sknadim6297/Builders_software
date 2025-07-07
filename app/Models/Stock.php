<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_name',
        'item_description',
        'unit',
        'quantity_on_hand',
        'unit_cost',
        'total_value',
        'reorder_level',
        'supplier_info',
        'location',
        'last_updated_by'
    ];

    protected $casts = [
        'quantity_on_hand' => 'decimal:2',
        'unit_cost' => 'decimal:2',
        'total_value' => 'decimal:2',
        'reorder_level' => 'integer'
    ];

    /**
     * Get all stock movements for this item.
     */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Update stock quantity and recalculate total value.
     */
    public function updateQuantity(float $quantity, float $unitCost = null)
    {
        if ($unitCost !== null) {
            // Update unit cost with weighted average
            $currentValue = $this->quantity_on_hand * $this->unit_cost;
            $newValue = $quantity * $unitCost;
            $newQuantity = $this->quantity_on_hand + $quantity;
            
            if ($newQuantity > 0) {
                $this->unit_cost = ($currentValue + $newValue) / $newQuantity;
            }
        }
        
        $this->quantity_on_hand += $quantity;
        $this->total_value = $this->quantity_on_hand * $this->unit_cost;
        $this->save();
    }

    /**
     * Check if stock is below reorder level.
     */
    public function isBelowReorderLevel(): bool
    {
        return $this->quantity_on_hand <= $this->reorder_level;
    }
}
