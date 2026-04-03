import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { route } from '@/utils/route';

export default function Show({ category }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <SidebarLayout>
            <Head title={`Category - ${category.name}`} />

            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Category Details</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">View category information</p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                href={route('categories.edit', category.id)}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                Edit Category
                            </Link>
                            <Link
                                href={route('categories.index')}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                Back to Categories
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Category Information */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Category Information
                                        </h2>
                                        <div className="flex items-center">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                category.is_active
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Category ID
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white font-mono">
                                                {category.id}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Category Name
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {category.name}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Discount (%)
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {parseFloat(category.discount_percentage || 0).toFixed(2)}%
                                            </p>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Description
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {category.description || 'No description provided'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Created Date
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {formatDate(category.created_at)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Last Updated
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {formatDate(category.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions & Statistics */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-3">
                                        <Link
                                            href={route('categories.edit', category.id)}
                                            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit Category
                                        </Link>
                                        <Link
                                            href={route('stocks.create', { category_id: category.id })}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add Stock Item
                                        </Link>
                                        <Link
                                            href={route('stocks.index', { category_id: category.id })}
                                            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View Stock Items
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Category Statistics */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Category Statistics
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Status</span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                category.is_active
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Stock Items</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {category.stocks_count || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Total Value</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                ₹{category.total_value || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stock Items Section */}
                    <div className="mt-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Stock Items in this Category
                                    </h3>
                                    <div className="space-y-3">
                                        <Link
                                            href={route('stocks.create', { category_id: category.id })}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add Stock Item
                                        </Link>
                                        <Link
                                            href={route('stocks.index', { category_id: category.id })}
                                            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View All Stock Items
                                        </Link>
                                    </div>
                                </div>

                                {(!category.stocks || category.stocks.length === 0) ? (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            No Stock Items
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            This category doesn't have any stock items yet. Add the first stock item to get started.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Item</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Quantity</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Price</th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {category.stocks.slice(0, 5).map((stock) => (
                                                    <tr key={stock.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{stock.name}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{stock.quantity} {stock.unit}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">₹{parseFloat(stock.price || 0).toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <Link
                                                                href={route('stocks.show', stock.id)}
                                                                className="text-primary-600 hover:text-primary-700 text-sm"
                                                            >
                                                                View
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {category.stocks.length > 5 && (
                                            <div className="text-center py-4">
                                                <Link
                                                    href={route('stocks.index', { category_id: category.id })}
                                                    className="text-primary-600 hover:text-primary-700 text-sm"
                                                >
                                                    View all {category.stocks.length} stock items
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}