<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update payment_status for all invoices based on amount_paid and total
        DB::statement("
            UPDATE invoices 
            SET payment_status = CASE 
                WHEN amount_paid >= total THEN 'paid'
                WHEN amount_paid > 0 THEN 'partial'
                ELSE 'unpaid'
            END,
            due_amount = total - amount_paid
            WHERE payment_status IS NULL OR due_amount IS NULL
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reverse needed
    }
};
