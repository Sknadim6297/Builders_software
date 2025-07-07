import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { PlusIcon, PencilIcon, EyeIcon, TrashIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, DocumentTextIcon, TableCellsIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, purchaseBills, filters, flash }) {
    const [search, setSearch] = useState(filters?.search || '');

    // Show flash messages as toasts
    useEffect(() => {
        if (flash?.success) {
            window.showSuccess(flash.success);
        }
        if (flash?.error) {
            window.showError(flash.error);
        }
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('purchase-bills.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this purchase bill?')) {
            router.delete(route('purchase-bills.destroy', id), {
                onSuccess: () => {
                    // Let the backend flash message handle the success notification
                },
                onError: (errors) => {
                    if (window.showError) {
                        window.showError(errors.error || 'Failed to delete purchase bill.');
                    }
                }
            });
        }
    };

    const handleExportExcel = () => {
        const params = new URLSearchParams();
        if (filters?.search) {
            params.append('search', filters.search);
        }
        params.append('export', 'excel');
        window.open(`${route('purchase-bills.index')}?${params.toString()}`, '_blank');
    };

    const handleExportPDF = () => {
        const params = new URLSearchParams();
        if (filters?.search) {
            params.append('search', filters.search);
        }
        params.append('export', 'pdf');
        window.open(`${route('purchase-bills.index')}?${params.toString()}`, '_blank');
    };

    return (
        <SidebarLayout>
            <Head title="Manage Purchase Bills" />
            
            <div className="py-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
                                    Manage Purchase Bills
                                </h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Create and manage purchase orders and bills
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <div className="flex items-center space-x-3">
                                    {/* Export Buttons */}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={handleExportExcel}
                                            className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                                            title="Export to Excel"
                                        >
                                            <TableCellsIcon className="w-4 h-4 mr-1.5" />
                                            Excel
                                        </button>
                                        <button
                                            onClick={handleExportPDF}
                                            className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                                            title="Export to PDF"
                                        >
                                            <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                                            PDF
                                        </button>
                                    </div>
                                    
                                    {/* Create Button */}
                                    <Link
                                        href={route('purchase-bills.create')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                                    >
                                        <PlusIcon className="w-5 h-5 mr-2" />
                                        Create Purchase Bill
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search purchase bills..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                >
                                    Search
                                </button>
                                {filters?.search && (
                                    <Link
                                        href={route('purchase-bills.index')}
                                        className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                    >
                                        Clear
                                    </Link>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Purchase Bills Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            PO Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Vendor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            PO Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Expected Delivery
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Total Amount
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {purchaseBills?.data?.length > 0 ? (
                                        purchaseBills.data.map((bill) => (
                                            <tr key={bill.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    #{bill.po_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    {bill.vendor?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    {new Date(bill.po_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    {new Date(bill.expected_delivery).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    ${parseFloat(bill.total || 0).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link
                                                            href={route('purchase-bills.show', bill.id)}
                                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200"
                                                            title="View"
                                                        >
                                                            <EyeIcon className="w-5 h-5" />
                                                        </Link>
                                                        <Link
                                                            href={route('purchase-bills.edit', bill.id)}
                                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-200"
                                                            title="Edit"
                                                        >
                                                            <PencilIcon className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(bill.id)}
                                                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No purchase bills found</h3>
                                                    <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first purchase bill.</p>
                                                    <Link
                                                        href={route('purchase-bills.create')}
                                                        className="inline-flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                                                    >
                                                        <PlusIcon className="w-5 h-5 mr-2" />
                                                        Create Purchase Bill
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {purchaseBills?.links && (
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing {purchaseBills.from || 0} to {purchaseBills.to || 0} of {purchaseBills.total || 0} results
                                    </div>
                                    <div className="flex space-x-1">
                                        {purchaseBills.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                                    link.active
                                                        ? 'bg-blue-700 text-white'
                                                        : link.url
                                                        ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
