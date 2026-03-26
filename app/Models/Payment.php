<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class Payment extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'payment_number',
        'invoice_id',
        'payment_date',
        'amount',
        'payment_method',
        'transaction_reference',
        'notes',
        'created_by'
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2'
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    protected function getActivityLogAttributes(): array
    {
        return [
            'payment_number' => $this->payment_number,
            'invoice_number' => $this->invoice->invoice_number ?? null,
            'amount' => $this->amount,
            'payment_method' => $this->payment_method
        ];
    }
}
