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
        Schema::table('purchase_bills', function (Blueprint $table) {
            $table->dropColumn(['deliver_to_type', 'deliver_to_location', 'payment_terms']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_bills', function (Blueprint $table) {
            $table->enum('deliver_to_type', ['customer', 'organization'])->after('vendor_address');
            $table->string('deliver_to_location')->after('deliver_to_type');
            $table->string('payment_terms')->after('expected_delivery');
        });
    }
};
