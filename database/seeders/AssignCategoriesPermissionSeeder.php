<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AssignCategoriesPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permission = \App\Models\Permission::where('name', 'categories')->first();

        if ($permission) {
            $users = \App\Models\User::all();
            foreach ($users as $user) {
                if (!$user->permissions()->where('permission_id', $permission->id)->exists()) {
                    $user->permissions()->attach($permission->id);
                }
            }
        }
    }
}
