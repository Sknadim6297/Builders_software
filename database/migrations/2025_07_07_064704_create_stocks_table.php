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
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->string('item_name');
            $table->text('item_description')->nullable();
            $table->string('unit', 50)->default('pcs'); // units like pcs, kg, liter, etc.
            $table->decimal('quantity_on_hand', 10, 2)->default(0);
            $table->decimal('unit_cost', 10, 2)->default(0);
            $table->decimal('total_value', 12, 2)->default(0);
            $table->integer('reorder_level')->default(0);
            $table->text('supplier_info')->nullable();
            $table->string('location')->nullable();
            $table->unsignedBigInteger('last_updated_by')->nullable();
            $table->timestamps();

            $table->foreign('last_updated_by')->references('id')->on('users')->onDelete('set null');
            $table->index(['item_name']);
            $table->index(['quantity_on_hand']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
