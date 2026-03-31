import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { route } from '@/utils/route';

export default function Show({ subAdmin }) {
    return (
        <SidebarLayout>
            <Head title={`Sub-Admin - ${subAdmin.name}`} />
            <div className="p-6">
                <div className="mb-6 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{subAdmin.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">View sub-admin details and assigned menus.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={route('sub-admins.index')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Back
                        </Link>
                        <Link
                            href={route('sub-admins.edit', subAdmin.id)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <PencilIcon className="w-5 h-5 mr-2" />
                            Edit
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="md:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                                    <p className="text-gray-900 dark:text-white font-medium">{subAdmin.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Email Address</p>
                                    <p className="text-gray-900 dark:text-white font-medium">{subAdmin.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                                    <p className="text-gray-900 dark:text-white font-medium">{subAdmin.role?.display_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Created At</p>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {new Date(subAdmin.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {new Date(subAdmin.updated_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Assigned Menus */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assigned Menus</h2>
                            {subAdmin.menus && subAdmin.menus.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {subAdmin.menus.map((menu) => (
                                        <div key={menu.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                                            <p className="font-medium text-gray-900 dark:text-white">{menu.name}</p>
                                            {menu.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{menu.description}</p>
                                            )}
                                            {menu.icon && (
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Icon: {menu.icon}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center text-gray-500 dark:text-gray-400">
                                    No menus assigned yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {subAdmin.menus?.length || 0}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Menus Assigned</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Active</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Account Status</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
