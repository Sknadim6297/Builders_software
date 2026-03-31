<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menus = [
            [
                'name' => 'customers',
                'display_name' => 'Customer Management',
                'description' => 'Manage customers and their details',
                'icon' => 'UserGroupIcon',
                'route_name' => 'customers.index',
                'href' => 'customers',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'categories',
                'display_name' => 'Categories',
                'description' => 'Manage product categories',
                'icon' => 'TagIcon',
                'route_name' => 'categories.index',
                'href' => 'categories',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'billing',
                'display_name' => 'Customer Billing',
                'description' => 'Manage billing and invoices',
                'icon' => 'DocumentIcon',
                'route_name' => 'billing.index',
                'href' => 'billing',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'gst_management',
                'display_name' => 'GST Management',
                'description' => 'Manage GST settings and calculations',
                'icon' => 'CogIcon',
                'route_name' => 'gst.index',
                'href' => 'gst',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'vendors',
                'display_name' => 'Vendor Management',
                'description' => 'Manage vendors and suppliers',
                'icon' => 'BuildingStorefrontIcon',
                'route_name' => 'vendors.index',
                'href' => 'vendors',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'items',
                'display_name' => 'Item Master',
                'description' => 'Manage items and products',
                'icon' => 'CubeIcon',
                'route_name' => 'items.index',
                'href' => 'items',
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'purchase_bills',
                'display_name' => 'Manage Purchase Bill',
                'description' => 'Manage purchase bills and orders',
                'icon' => 'ShoppingCartIcon',
                'route_name' => 'purchase-bills.index',
                'href' => 'purchase-bills',
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'stock_management',
                'display_name' => 'Stock Management',
                'description' => 'Manage inventory and stock levels',
                'icon' => 'ArchiveBoxIcon',
                'route_name' => 'stocks.index',
                'href' => 'stocks',
                'sort_order' => 8,
                'is_active' => true,
            ],
        ];

        foreach ($menus as $menu) {
            Menu::firstOrCreate(['name' => $menu['name']], $menu);
        }
    }
}
