import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { route } from '@/utils/route';

export default function Show({ item }) {
    return (
        <SidebarLayout>
            <Head title={`Item - ${item.name}`} />
            <div className="p-6">
                <div className="mb-6 flex items-center gap-4">
                    <Link href={route('items.index')} className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{item.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Code: {item.item_code}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Item Details</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Item Code</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{item.item_code}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {item.category?.name || 'Unassigned'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{item.name}</p>
                                </div>

                                {item.description && (
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                                        <p className="text-lg text-gray-900 dark:text-white whitespace-pre-wrap">{item.description}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Unit Type</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{item.unit_type}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">GST Percentage</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{item.gst_percentage}%</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                                        item.is_active
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                    }`}>
                                        {item.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link href={route('items.edit', item.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    <PencilIcon className="w-4 h-4" />
                                    Edit Item
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Created Info</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">By: {item.creator?.name || 'System'}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">On: {new Date(item.created_at).toLocaleDateString()}</p>
                        </div>

                        {item.updater && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Last Updated</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">By: {item.updater?.name || 'System'}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">On: {new Date(item.updated_at).toLocaleDateString()}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
