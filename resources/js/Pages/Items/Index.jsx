import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { route } from '@/utils/route';

export default function Index({     items, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const { delete: deleteItem } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteItem(route('items.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        window.location.href = `${route('items.index')}${params.toString() ? '?' + params.toString() : ''}`;
    };

    const formatCurrency = (value) => {
        return `₹${parseFloat(value || 0).toFixed(2)}`;
    };

    return (
        <SidebarLayout>
            <Head title="Item Master" />
            <div className="p-6">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Item Master</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all items for purchase and billing.</p>
                    </div>
                    <Link href={route('items.create')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <PlusIcon className="w-5 h-5" />
                        New Item
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6">
                    <form onSubmit={handleSearch} className="flex gap-4 flex-wrap items-end">
                        <div className="flex-1 min-w-48">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Code, name, or unit type..."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                            />
                        </div>
                        <div className="w-40">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                            >
                                <option value="">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Search
                        </button>
                    </form>
                </div>

                {/* Items Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Unit Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">GST %</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {items.data && items.data.length > 0 ? (
                                items.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.item_code}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.category?.name || 'Unassigned'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.unit_type}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.gst_percentage}%</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                                item.is_active
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                            }`}>
                                                {item.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm space-x-2">
                                            <Link href={route('items.show', item.id)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 dark:hover:text-blue-400">
                                                <EyeIcon className="w-4 h-4" />
                                            </Link>
                                            <Link href={route('items.edit', item.id)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 dark:hover:text-blue-400">
                                                <PencilIcon className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(item.id)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-900 dark:hover:text-red-400">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
                                        No items found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {items.links && items.links.length > 0 && (
                    <div className="mt-6 flex justify-center gap-1">
                        {items.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                as={link.url ? 'a' : 'span'}
                                className={`px-3 py-1 rounded border ${
                                    link.active
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                } ${
                                    !link.url ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
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
