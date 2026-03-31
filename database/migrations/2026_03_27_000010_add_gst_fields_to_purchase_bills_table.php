<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchase_bills', function (Blueprint $table) {
            $table->decimal('delivery_charges', 10, 2)->default(0)->after('subtotal');
            $table->enum('gst_type', ['intra', 'inter'])->default('intra')->after('delivery_charges');
            $table->decimal('cgst_percentage', 5, 2)->default(0)->after('gst_type');
            $table->decimal('sgst_percentage', 5, 2)->default(0)->after('cgst_percentage');
            $table->decimal('igst_percentage', 5, 2)->default(0)->after('sgst_percentage');

            $table->decimal('cgst_amount', 12, 2)->default(0)->after('igst_percentage');
            $table->decimal('sgst_amount', 12, 2)->default(0)->after('cgst_amount');
            $table->decimal('igst_amount', 12, 2)->default(0)->after('sgst_amount');
            $table->decimal('tcs_percentage', 5, 2)->default(0)->after('igst_amount');
            $table->decimal('tcs_amount', 12, 2)->default(0)->after('tcs_percentage');
            $table->decimal('round_off', 10, 2)->default(0)->after('tcs_amount');
            $table->decimal('gross_amount', 12, 2)->default(0)->after('round_off');
            $table->decimal('net_amount', 12, 2)->default(0)->after('gross_amount');
        });
    }

    public function down(): void
    {
        Schema::table('purchase_bills', function (Blueprint $table) {
            $table->dropColumn([
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
                'net_amount'
            ]);
        });
    }
};