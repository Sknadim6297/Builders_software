import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ user, roles, permissions, flash }) {
    const [selectedPermissions, setSelectedPermissions] = useState(
        user.permissions?.map(p => p.id) || []
    );
    
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role_id: user.role_id || '',
        permissions: user.permissions?.map(p => p.id) || []
    });

    // Show flash messages as toasts
    useEffect(() => {
        if (flash?.success) {
            window.showSuccess(flash.success);
        }
        if (flash?.error) {
            window.showError(flash.error);
        }
        if (flash?.warning) {
            window.showWarning(flash.warning);
        }
        if (flash?.info) {
            window.showInfo(flash.info);
        }
    }, [flash]);

    const handlePermissionChange = (permissionId) => {
        const updatedPermissions = selectedPermissions.includes(permissionId)
            ? selectedPermissions.filter(id => id !== permissionId)
            : [...selectedPermissions, permissionId];
        
        setSelectedPermissions(updatedPermissions);
        setData('permissions', updatedPermissions);
    };

    const submit = (e) => {
        e.preventDefault();

        put(route('admin-users.update', user.id), {
            onSuccess: () => {
                window.showSuccess('Admin user updated successfully!');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                if (errors.general) {
                    window.showError(errors.general);
                }
            }
        });
    };

    return (
        <SidebarLayout>
            <Head title="Edit Admin User" />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Admin User</h1>
                        <p className="text-gray-600">Update admin user details and permissions</p>
                    </div>
                    <Link
                        href={route('admin-users.index')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back to List
                    </Link>
                </div>

                <div className="bg-white shadow rounded-lg">
                    <form onSubmit={submit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                        errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                                    }`}
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                        errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                                    }`}
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                    <span className="text-gray-500 font-normal"> (leave blank to keep current)</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                        errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                                    }`}
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Password Confirmation */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                        errors.password_confirmation ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                                    }`}
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                                )}
                            </div>

                            {/* Role */}
                            <div className="md:col-span-2">
                                <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <select
                                    id="role_id"
                                    value={data.role_id}
                                    onChange={(e) => setData('role_id', e.target.value)}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                                        errors.role_id ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                                    }`}
                                    required
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.display_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.role_id && (
                                    <p className="mt-2 text-sm text-red-600">{errors.role_id}</p>
                                )}
                            </div>
                        </div>

                        {/* Permissions */}
                        <div className="mt-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {permissions.map((permission) => (
                                    <div key={permission.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            id={`permission-${permission.id}`}
                                            checked={selectedPermissions.includes(permission.id)}
                                            onChange={() => handlePermissionChange(permission.id)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div className="flex-1">
                                            <label htmlFor={`permission-${permission.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                                                {permission.display_name}
                                            </label>
                                            {permission.description && (
                                                <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                                            )}
                                        </div>
                                        {permission.icon && (
                                            <div className="w-5 h-5 text-gray-400" dangerouslySetInnerHTML={{ __html: permission.icon }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            {errors.permissions && (
                                <p className="mt-2 text-sm text-red-600">{errors.permissions}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end space-x-3">
                            <Link
                                href={route('admin-users.index')}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Admin User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
