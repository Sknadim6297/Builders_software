<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        Role::updateOrCreate(
            ['name' => 'super_admin'],
            [
                'display_name' => 'Super Administrator',
                'description' => 'Full access to all features and user management'
            ]
        );

        Role::updateOrCreate(
            ['name' => 'admin'],
            [
                'display_name' => 'Administrator',
                'description' => 'Limited access based on assigned permissions'
            ]
        );

        // Create permissions based on current menu structure
        $permissions = [
            [
                'name' => 'dashboard',
                'display_name' => 'Dashboard',
                'description' => 'Access to dashboard overview',
                'icon' => '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14H8V5z" /></svg>',
                'route_name' => 'dashboard',
                'sort_order' => 1,
            ],
            [
                'name' => 'customers',
                'display_name' => 'Customer Management',
                'description' => 'Manage customer records and information',
                'icon' => '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>',
                'route_name' => 'customers.index',
                'sort_order' => 2,
            ],
            [
                'name' => 'vendors',
                'display_name' => 'Vendor Management',
                'description' => 'Manage vendor records and information',
                'icon' => '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>',
                'route_name' => 'vendors.index',
                'sort_order' => 3,
            ],
            [
                'name' => 'services',
                'display_name' => 'Service Management',
                'description' => 'Manage service catalog and pricing',
                'icon' => '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>',
                'route_name' => 'services.index',
                'sort_order' => 4,
            ],
            [
                'name' => 'admin_users',
                'display_name' => 'Admin User Creation',
                'description' => 'Create and manage admin users and permissions',
                'icon' => '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>',
                'route_name' => 'admin-users.index',
                'sort_order' => 5,
            ],
            [
                'name' => 'activity_logs',
                'display_name' => 'Log Book of User & Admin Activity',
                'description' => 'View system activity logs and audit trails',
                'icon' => '<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
                'route_name' => 'activity-logs.index',
                'sort_order' => 6,
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission['name']],
                $permission
            );
        }
    }
}
