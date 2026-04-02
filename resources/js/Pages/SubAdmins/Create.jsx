import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { route } from '@/utils/route';

export default function Create({ menus, roles }) {
    const sidebarMenuLabels = {
        customers: 'Customer Management',
        categories: 'Categories',
        billing: 'Customer Billing',
        gst_management: 'GST Management',
        vendors: 'Vendor Management',
        items: 'Item Master',
        purchase_bills: 'Purchase Bill',
        stock_management: 'Stock Management'
    };

    const getMenuLabel = (menu) => sidebarMenuLabels[menu.name] || menu.display_name || menu.name;

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        selected_menus: []
    });

    const [selectedRole, setSelectedRole] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sub-admins.store'));
    };

    const handleMenuToggle = (menuId) => {
        setData('selected_menus',
            data.selected_menus.includes(menuId)
                ? data.selected_menus.filter(id => id !== menuId)
                : [...data.selected_menus, menuId]
        );
    };

    const handleRoleChange = (roleId) => {
        setSelectedRole(roles.find(r => r.id == roleId));
        setData('role_id', roleId);
    };

    return (
        <SidebarLayout>
            <Head title="Create Sub-Admin" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Sub-Admin</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Add a new sub-admin account with specific menu access.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Full Name"
                            />
                            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="email@example.com"
                            />
                            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password *</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password *</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                    errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="••••••••"
                            />
                            {errors.password_confirmation && <p className="text-red-600 text-sm mt-1">{errors.password_confirmation}</p>}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role *</label>
                            <select
                                value={data.role_id}
                                onChange={(e) => handleRoleChange(e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                                    errors.role_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select Role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.display_name}</option>
                                ))}
                            </select>
                            {errors.role_id && <p className="text-red-600 text-sm mt-1">{errors.role_id}</p>}
                        </div>
                    </div>

                    {/* Menu Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Menus Access *</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {menus.map((menu) => (
                                <label key={menu.id} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.selected_menus.includes(menu.id)}
                                        onChange={() => handleMenuToggle(menu.id)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{getMenuLabel(menu)}</p>
                                        {menu.description && <p className="text-xs text-gray-500 dark:text-gray-400">{menu.description}</p>}
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.selected_menus && <p className="text-red-600 text-sm mt-2">{errors.selected_menus}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                        <a
                            href={route('sub-admins.index')}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {processing ? 'Creating...' : 'Create Sub-Admin'}
                        </button>
                    </div>
                </form>
            </div>
        </SidebarLayout>
    );
}
