<?php

namespace Database\Seeders;

use App\Models\Role;
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
        $superAdminRole = Role::where('name', 'super_admin')->first();

        // Keep super admin credentials deterministic for server deployment.
        User::updateOrCreate(
            ['email' => 'superadmin@gmail.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('super123'),
                'is_super_admin' => true,
                'role_id' => $superAdminRole?->id,
            ]
        );

        $this->command->info('Super admin user created successfully!');
        $this->command->info('Email: superadmin@gmail.com');
        $this->command->info('Password: super123');
    }
}
