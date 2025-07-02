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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('cust_id')->unique(); // Auto-generated unique customer ID
            $table->string('name'); // Customer Name
            $table->string('mobile_number'); // Mobile Number
            $table->text('address'); // Address
            $table->string('pincode'); // Pincode
            $table->string('location'); // Location
            $table->string('alternate_mobile')->nullable(); // Alternate Mobile No.
            $table->date('date'); // Date (auto fetching)
            $table->time('time'); // Time (auto fetching)
            $table->string('source'); // Source
            $table->string('gst_number')->nullable(); // GST No. (If have)
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
