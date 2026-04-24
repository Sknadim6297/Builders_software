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
				'description' => 'Manage customer records and information',
				'route_name' => 'customers.index',
				'href' => '/customers',
				'sort_order' => 1,
				'is_active' => true,
			],
			[
				'name' => 'vendors',
				'display_name' => 'Vendor Management',
				'description' => 'Manage vendor records and information',
				'route_name' => 'vendors.index',
				'href' => '/vendors',
				'sort_order' => 2,
				'is_active' => true,
			],
			[
				'name' => 'categories',
				'display_name' => 'Categories',
				'description' => 'Manage service and product categories',
				'route_name' => 'categories.index',
				'href' => '/categories',
				'sort_order' => 3,
				'is_active' => true,
			],
			[
				'name' => 'items',
				'display_name' => 'Item Master',
				'description' => 'Manage item master records',
				'route_name' => 'items.index',
				'href' => '/items',
				'sort_order' => 4,
				'is_active' => true,
			],
			[
				'name' => 'billing',
				'display_name' => 'Customer Billing',
				'description' => 'Create and manage customer invoices',
				'route_name' => 'billing.index',
				'href' => '/billing',
				'sort_order' => 5,
				'is_active' => true,
			],
			[
				'name' => 'purchase_bills',
				'display_name' => 'Purchase Bill',
				'description' => 'Create and manage purchase bills',
				'route_name' => 'purchase-bills.index',
				'href' => '/purchase-bills',
				'sort_order' => 6,
				'is_active' => true,
			],
			[
				'name' => 'stock_management',
				'display_name' => 'Stock Management',
				'description' => 'Manage inventory and stock levels',
				'route_name' => 'stocks.index',
				'href' => '/stocks',
				'sort_order' => 7,
				'is_active' => true,
			],
			[
				'name' => 'gst_management',
				'display_name' => 'GST Management',
				'description' => 'View GST summary and reports',
				'route_name' => 'gst.index',
				'href' => '/gst',
				'sort_order' => 8,
				'is_active' => true,
			],
			[
				'name' => 'daily_reports',
				'display_name' => 'Daily Reports',
				'description' => 'View daily business reports',
				'route_name' => 'daily-reports.index',
				'href' => '/daily-reports',
				'sort_order' => 9,
				'is_active' => true,
			],
		];

		foreach ($menus as $menu) {
			Menu::updateOrCreate(
				['name' => $menu['name']],
				$menu
			);
		}
	}
}
