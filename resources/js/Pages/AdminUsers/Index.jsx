import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function Index({ users, roles, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin-users.index'), {
            search: search,
            role: roleFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(route('admin-users.destroy', user.id), {
                onSuccess: () => {
                    window.showSuccess('Admin user deleted successfully!');
                },
                onError: () => {
                    window.showError('Failed to delete admin user.');
                }
            });
        }
    };

    return (
        <SidebarLayout>
            <Head title="Admin User Management" />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin User Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage admin users and their permissions</p>
                    </div>
                    <Link
                        href={route('admin-users.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add New Admin
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg mb-6">
                    <form onSubmit={handleSearch} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Search
                                </label>
                                <input
                                    id="search"
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    placeholder="Search by name or email..."
                                />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                >
                                    <option value="">All Roles</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.display_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Search
                                </button>
                                {(search || roleFilter) && (
                                    <Link
                                        href={route('admin-users.index')}
                                        className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Clear
                                    </Link>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Permissions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            No admin users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-medium text-white">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {user.name}
                                                            {user.is_super_admin && (
                                                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Super Admin
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {user.role?.display_name || 'No Role'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {user.is_super_admin ? (
                                                        <span className="text-green-600">All Permissions</span>
                                                    ) : (
                                                        <span>{user.permissions?.length || 0} permissions</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={route('admin-users.show', user.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        title="View"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </Link>
                                                    {!user.is_super_admin && (
                                                        <>
                                                            <Link
                                                                href={route('admin-users.edit', user.id)}
                                                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                                title="Edit"
                                                            >
                                                                <PencilIcon className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(user)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                title="Delete"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && (
                        <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {users.prev_page_url && (
                                        <Link
                                            href={users.prev_page_url}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {users.next_page_url && (
                                        <Link
                                            href={users.next_page_url}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Showing <span className="font-medium">{users.from}</span> to{' '}
                                            <span className="font-medium">{users.to}</span> of{' '}
                                            <span className="font-medium">{users.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {users.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        link.active
                                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } ${
                                                        !link.url ? 'cursor-not-allowed opacity-50' : ''
                                                    }`}
                                                    preserveState
                                                    preserveScroll
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
