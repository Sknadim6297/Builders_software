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
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., 'dashboard', 'customers', 'vendors'
            $table->string('display_name'); // e.g., 'Dashboard', 'Customer Management'
            $table->text('description')->nullable();
            $table->text('icon')->nullable(); // SVG icon for menu (changed to text)
            $table->string('route_name')->nullable(); // Route name for navigation
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
