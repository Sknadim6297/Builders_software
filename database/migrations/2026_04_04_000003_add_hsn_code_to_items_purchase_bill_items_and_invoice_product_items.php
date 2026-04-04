<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            if (!Schema::hasColumn('items', 'hsn_code')) {
                $table->string('hsn_code', 32)->nullable()->after('name');
            }
        });

        Schema::table('purchase_bill_items', function (Blueprint $table) {
            if (!Schema::hasColumn('purchase_bill_items', 'hsn_code')) {
                $table->string('hsn_code', 32)->nullable()->after('item_id');
            }
        });

        Schema::table('invoice_product_items', function (Blueprint $table) {
            if (!Schema::hasColumn('invoice_product_items', 'hsn_code')) {
                $table->string('hsn_code', 32)->nullable()->after('stock_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoice_product_items', function (Blueprint $table) {
            if (Schema::hasColumn('invoice_product_items', 'hsn_code')) {
                $table->dropColumn('hsn_code');
            }
        });

        Schema::table('purchase_bill_items', function (Blueprint $table) {
            if (Schema::hasColumn('purchase_bill_items', 'hsn_code')) {
                $table->dropColumn('hsn_code');
            }
        });

        Schema::table('items', function (Blueprint $table) {
            if (Schema::hasColumn('items', 'hsn_code')) {
                $table->dropColumn('hsn_code');
            }
        });
    }
};
