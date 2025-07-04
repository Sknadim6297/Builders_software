<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create super admin user if not exists
        User::firstOrCreate(
            ['email' => 'sknadim6297@gmail.com'],
            [
                'name' => 'Super Administrator',
                'email' => 'sknadim6297@gmail.com',
                'password' => Hash::make('nadim123'),
                'is_super_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Super admin user created successfully!');
        $this->command->info('Email: sknadim6297@gmail.com');
        $this->command->info('Password: nadim123');
    }
}
