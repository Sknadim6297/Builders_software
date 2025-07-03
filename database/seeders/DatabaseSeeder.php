<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // First create roles and permissions
        $this->call([
            PermissionSeeder::class,
        ]);

        // Update existing admin user or create super admin user
        $user = User::where('email', 'admin@gmail.com')->first();
        
        if ($user) {
            $user->update([
                'name' => 'Super Admin',
                'is_super_admin' => true,
                'role_id' => 1, // super_admin role
            ]);
        } else {
            User::create([
                'name' => 'Super Admin',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('admin123'),
                'is_super_admin' => true,
                'role_id' => 1, // super_admin role
            ]);
        }
    }
}
