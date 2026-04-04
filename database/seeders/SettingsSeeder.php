<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Company Information Settings
        Setting::updateOrCreate(
            ['key' => 'company_name'],
            [
                'value' => 'SAYAN SITA BUILDERS',
                'description' => 'Company Name'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'company_address'],
            [
                'value' => 'Chalitapara, Ajodhya, Shyampur, Howrah – 711312',
                'description' => 'Company Address'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'company_phone_1'],
            [
                'value' => '6289249399',
                'description' => 'Company Primary Phone Number'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'company_phone_2'],
            [
                'value' => '9609142692',
                'description' => 'Company Secondary Phone Number'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'company_phone_3'],
            [
                'value' => '9732771768',
                'description' => 'Company Tertiary Phone Number'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'company_logo'],
            [
                'value' => '/images/sayan-sita-logo.png',
                'description' => 'Company Logo URL (used on login page and throughout system)'
            ]
        );

        // Billing Settings (existing defaults)
        Setting::updateOrCreate(
            ['key' => 'payment_mode'],
            [
                'value' => 'CREDIT',
                'description' => 'Default Payment Mode'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'godown'],
            [
                'value' => 'CHALITAPARA',
                'description' => 'Default Godown/Warehouse'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'transport'],
            [
                'value' => 'VAN (SELF)',
                'description' => 'Default Transport Mode'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'bank'],
            [
                'value' => 'Development Bank of Singapore',
                'description' => 'Bank Name'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'account_no'],
            [
                'value' => '8828210000007429',
                'description' => 'Bank Account Number'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'ifsc'],
            [
                'value' => 'DBSS0IN0828',
                'description' => 'IFSC Code'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'branch'],
            [
                'value' => 'KOLKATA MAIN BRANCH',
                'description' => 'Bank Branch'
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'account_type'],
            [
                'value' => 'Trade & Forex CURRENT ACCOUNT',
                'description' => 'Bank Account Type'
            ]
        );
    }
}
