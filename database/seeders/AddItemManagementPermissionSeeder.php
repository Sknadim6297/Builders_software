<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddItemManagementPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Add item_management permission if it doesn't exist
        $permission = DB::table('permissions')->firstOrCreate(
            ['name' => 'item_management'],
            [
                'name' => 'item_management',
                'description' => 'Manage Item Master',
                'created_at' => now(),
                'updated_at' => now()
            ]
        );

        // Get admin role (adjust based on your role names)
        $adminRole = DB::table('roles')->whereIn('name', ['admin', 'superadmin', 'administrator'])->first();
        
        if ($adminRole) {
            // Assign permission to admin role
            DB::table('role_permission')->updateOrInsert(
                [
                    'role_id' => $adminRole->id,
                    'permission_id' => $permission->id
                ],
                [
                    'role_id' => $adminRole->id,
                    'permission_id' => $permission->id
                ]
            );
        }
    }
}
