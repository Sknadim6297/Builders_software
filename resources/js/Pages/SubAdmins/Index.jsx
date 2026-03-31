import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { route } from '@/utils/route';

export default function Index({ subAdmins, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const { delete: deleteSubAdmin } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this sub-admin?')) {
            deleteSubAdmin(route('sub-admins.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        window.location.href = `${route('sub-admins.index')}${params.toString() ? '?' + params.toString() : ''}`;
    };

    return (
        <SidebarLayout>
            <Head title="Sub-Admin Management" />
            <div className="p-6">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sub-Admin Management</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Create and manage sub-admins with specific menu access.</p>
                    </div>
                    <Link
                        href={route('sub-admins.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        New Sub-Admin
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    {subAdmins.data.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                            No sub-admins found. Create one to get started.
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Menus Assigned</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {subAdmins.data.map((subAdmin) => (
                                    <tr key={subAdmin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{subAdmin.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{subAdmin.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{subAdmin.role?.display_name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                                {subAdmin.menus_count || 0} menus
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm flex gap-2">
                                            <Link
                                                href={route('sub-admins.show', subAdmin.id)}
                                                className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                                                title="View"
                                            >
                                                <EyeIcon className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                href={route('sub-admins.edit', subAdmin.id)}
                                                className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                                                title="Edit"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(subAdmin.id)}
                                                className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {subAdmins.links && subAdmins.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {subAdmins.links.map((link) => (
                            <Link
                                key={link.label}
                                href={link.url || '#'}
                                className={`px-3 py-2 rounded-lg ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                        : 'text-gray-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
