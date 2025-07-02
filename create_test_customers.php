<?php

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

// Create test customers for pagination testing
for ($i = 4; $i <= 15; $i++) {
    DB::table('customers')->insert([
        'name' => 'Test Customer ' . $i,
        'mobile_number' => '98765432' . str_pad($i, 2, '0', STR_PAD_LEFT),
        'address' => 'Test Address ' . $i,
        'pincode' => '123456',
        'location' => 'Test Location ' . $i,
        'source' => 'Test',
        'is_active' => true,
        'created_at' => Carbon::now(),
        'updated_at' => Carbon::now(),
    ]);
}

echo "Created test customers for pagination testing\n";
