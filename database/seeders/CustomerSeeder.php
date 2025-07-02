<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Customer::create([
            'name' => 'John Doe',
            'mobile_number' => '9876543210',
            'address' => '123 Main Street, Downtown Area',
            'pincode' => '110001',
            'location' => 'New Delhi',
            'alternate_mobile' => '9876543211',
            'source' => 'Website',
            'gst_number' => '07AABCU9603R1Z5',
            'is_active' => true
        ]);

        Customer::create([
            'name' => 'Jane Smith',
            'mobile_number' => '9876543212',
            'address' => '456 Business Park, Commercial Complex',
            'pincode' => '400001',
            'location' => 'Mumbai',
            'alternate_mobile' => null,
            'source' => 'Referral',
            'gst_number' => null,
            'is_active' => true
        ]);

        Customer::create([
            'name' => 'Raj Patel',
            'mobile_number' => '9876543213',
            'address' => '789 Tech Hub, IT Corridor',
            'pincode' => '560001',
            'location' => 'Bangalore',
            'alternate_mobile' => '9876543214',
            'source' => 'Social Media',
            'gst_number' => '29AABCU9603R1Z7',
            'is_active' => true
        ]);
    }
}
