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
        Schema::create('purchase_bills', function (Blueprint $table) {
            $table->id();
            $table->string('po_number')->unique();
            $table->date('po_date');
            $table->foreignId('vendor_id')->constrained()->onDelete('cascade');
            $table->text('vendor_address');
            $table->enum('deliver_to_type', ['customer', 'organization']);
            $table->string('deliver_to_location');
            $table->text('deliver_address');
            $table->date('expected_delivery')->nullable();
            $table->string('payment_terms');
            $table->json('items'); // Store itemized products
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax', 5, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->text('terms')->nullable();
            $table->text('notes')->nullable();
            $table->string('reference')->nullable();
            $table->enum('status', ['draft', 'sent', 'received', 'completed', 'cancelled'])->default('draft');
            $table->json('attachments')->nullable(); // Store file attachments
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            
            // Indexes
            $table->index(['po_date', 'status']);
            $table->index(['vendor_id', 'status']);
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_bills');
    }
};
