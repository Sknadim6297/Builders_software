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
            $table->decimal('default_unit_price', 12, 2)->default(0)->after('unit_type');
            $table->decimal('default_discount_percentage', 5, 2)->default(0)->after('default_unit_price');
        });

        Schema::table('purchase_bills', function (Blueprint $table) {
            $table->string('inv_cha_no')->nullable()->after('po_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn(['default_unit_price', 'default_discount_percentage']);
        });

        Schema::table('purchase_bills', function (Blueprint $table) {
            $table->dropColumn('inv_cha_no');
        });
    }
};
