<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed core access-control and app settings data first.
        $this->call([
            PermissionSeeder::class,
            MenuSeeder::class,
            SettingsSeeder::class,
            SuperAdminSeeder::class,
        ]);
    }
}
