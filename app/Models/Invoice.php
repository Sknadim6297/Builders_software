<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\LogsActivity;

class Invoice extends Model
{
    use HasFactory, LogsActivity;

    protected static function boot()
    {
        parent::boot();

        // Auto-sync payment status when retrieved
        static::retrieved(function ($invoice) {
            $invoice->syncPaymentStatus();
        });
    }

    protected $fillable = [
        'invoice_number',
        'invoice_date',
        'customer_id',
        'subtotal',
        'gst_percentage',
        'discount',
        'total',
        'amount_paid',
        'due_amount',
        'payment_status',
        'notes',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'invoice_date' => 'date',
        'subtotal' => 'decimal:2',
        'gst_percentage' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'due_amount' => 'decimal:2'
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function serviceItems(): HasMany
    {
        return $this->hasMany(InvoiceServiceItem::class);
    }

    public function productItems(): HasMany
    {
        return $this->hasMany(InvoiceProductItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Sync payment status without saving (for display consistency)
     */
    public function syncPaymentStatus(): void
    {
        $paidAmount = (float) ($this->amount_paid ?? 0);
        $totalAmount = (float) ($this->total ?? 0);

        if ($paidAmount >= $totalAmount) {
            $this->attributes['payment_status'] = 'paid';
            $this->attributes['due_amount'] = 0;
        } elseif ($paidAmount > 0) {
            $this->attributes['payment_status'] = 'partial';
            $this->attributes['due_amount'] = $totalAmount - $paidAmount;
        } else {
            $this->attributes['payment_status'] = 'unpaid';
            $this->attributes['due_amount'] = $totalAmount;
        }
    }

    /**
     * Update payment status based on amounts paid
     */
    public function updatePaymentStatus(): void
    {
        if ($this->amount_paid >= $this->total) {
            $this->payment_status = 'paid';
            $this->due_amount = 0;
        } elseif ($this->amount_paid > 0) {
            $this->payment_status = 'partial';
            $this->due_amount = $this->total - $this->amount_paid;
        } else {
            $this->payment_status = 'unpaid';
            $this->due_amount = $this->total;
        }
        $this->save();
    }

    /**
     * Add a payment to this invoice
     */
    public function addPayment(float $amount, array $paymentData = []): Payment
    {
        $this->amount_paid += $amount;
        $this->updatePaymentStatus();

        return $this->payments()->create(array_merge($paymentData, [
            'amount' => $amount
        ]));
    }
}
