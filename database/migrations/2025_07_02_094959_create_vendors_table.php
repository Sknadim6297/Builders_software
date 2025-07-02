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
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->string('vend_id')->unique(); // Auto-generated Vendor ID
            $table->string('name'); // Vendor Name
            $table->string('mobile_number', 10); // Mobile Number
            $table->text('address'); // Address
            $table->string('pincode', 6); // Pincode
            $table->string('location'); // Location
            $table->string('alternate_mobile', 10)->nullable(); // Alternate Mobile No.
            $table->date('date'); // Date
            $table->time('time'); // Time
            $table->string('supply_of_goods'); // Supply of Goods
            $table->string('gst_number', 15)->nullable(); // GST No.
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
