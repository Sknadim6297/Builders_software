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
        Schema::create('purchase_bill_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('purchase_bill_id');
            $table->unsignedBigInteger('item_id');
            $table->decimal('quantity', 10, 2);
            $table->decimal('unit_price', 12, 2);
            $table->decimal('discount_percentage', 5, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->decimal('gst_percentage', 5, 2)->default(0);
            $table->timestamps();

            // Foreign keys
            $table->foreign('purchase_bill_id')->references('id')->on('purchase_bills')->onDelete('cascade');
            $table->foreign('item_id')->references('id')->on('items')->onDelete('restrict');

            // Indexes
            $table->index('purchase_bill_id');
            $table->index('item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_bill_items');
    }
};
