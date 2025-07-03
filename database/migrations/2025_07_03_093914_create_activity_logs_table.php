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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->string('log_name')->nullable(); // Group/category of the activity
            $table->text('description'); // Human readable description
            $table->string('subject_type')->nullable(); // Model class name (e.g., App\Models\User)
            $table->unsignedBigInteger('subject_id')->nullable(); // Model ID
            $table->string('event'); // Action type (created, updated, deleted, etc.)
            $table->string('causer_type')->nullable(); // Who caused the action (User model)
            $table->unsignedBigInteger('causer_id')->nullable(); // User ID who performed the action
            $table->json('properties')->nullable(); // Additional data (old/new values)
            $table->string('batch_uuid')->nullable(); // For grouping related activities
            $table->string('ip_address')->nullable(); // IP address of the user
            $table->string('user_agent')->nullable(); // Browser/device information
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['subject_type', 'subject_id']);
            $table->index(['causer_type', 'causer_id']);
            $table->index('log_name');
            $table->index('event');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
