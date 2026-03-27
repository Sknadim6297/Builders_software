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
        Schema::table('invoices', function (Blueprint $table) {
            $table->decimal('cgst_percentage', 5, 2)->default(0)->after('gst_percentage');
            $table->decimal('sgst_percentage', 5, 2)->default(0)->after('cgst_percentage');
            $table->string('buyer_logo')->nullable()->after('due_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['cgst_percentage', 'sgst_percentage', 'buyer_logo']);
        });
    }
};
