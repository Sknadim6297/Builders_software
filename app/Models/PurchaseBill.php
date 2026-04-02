<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class PurchaseBill extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'po_number',
        'inv_cha_no',
        'po_date',
        'vendor_id',
        'vendor_address',
        'deliver_address',
        'expected_delivery',
        'items',
        'subtotal',
        'delivery_charges',
        'gst_type',
        'cgst_percentage',
        'sgst_percentage',
        'igst_percentage',
        'cgst_amount',
        'sgst_amount',
        'igst_amount',
        'tcs_percentage',
        'tcs_amount',
        'round_off',
        'gross_amount',
        'discount',
        'total',
        'net_amount',
        'terms',
        'notes',
        'reference',
        'status',
        'attachments',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'po_date' => 'date',
        'expected_delivery' => 'date',
        'items' => 'array',
        'attachments' => 'array',
        'subtotal' => 'decimal:2',
        'delivery_charges' => 'decimal:2',
        'cgst_percentage' => 'decimal:2',
        'sgst_percentage' => 'decimal:2',
        'igst_percentage' => 'decimal:2',
        'cgst_amount' => 'decimal:2',
        'sgst_amount' => 'decimal:2',
        'igst_amount' => 'decimal:2',
        'tcs_percentage' => 'decimal:2',
        'tcs_amount' => 'decimal:2',
        'round_off' => 'decimal:2',
        'gross_amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'net_amount' => 'decimal:2'
    ];

    /**
     * Get the vendor that owns the purchase bill.
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get all items in this purchase bill.
     */
    public function purchaseBillItems()
    {
        return $this->hasMany(PurchaseBillItem::class);
    }

    /**
     * Get the user who created the purchase bill.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated the purchase bill.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get the formatted PO number.
     */
    public function getFormattedPoNumberAttribute(): string
    {
        return $this->po_number ?? 'PO-' . str_pad($this->id, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Get the status badge color.
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'draft' => 'gray',
            'sent' => 'blue',
            'received' => 'yellow',
            'completed' => 'green',
            'cancelled' => 'red',
            default => 'gray'
        };
    }

    /**
     * Get the status label.
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'draft' => 'Draft',
            'sent' => 'Sent',
            'received' => 'Received',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            default => 'Unknown'
        };
    }

    /**
     * Scope to filter by status.
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by vendor.
     */
    public function scopeByVendor($query, $vendorId)
    {
        return $query->where('vendor_id', $vendorId);
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('po_date', [$startDate, $endDate]);
    }
}
