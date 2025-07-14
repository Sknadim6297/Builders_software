import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { PlusIcon, PencilIcon, EyeIcon, TrashIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, DocumentTextIcon, TableCellsIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Index({ auth, purchaseBills, filters, flash, vendors }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [showFilters, setShowFilters] = useState(false);
    const [filterData, setFilterData] = useState({
        vendor_id: filters?.vendor_id || '',
        po_date_from: filters?.po_date_from || '',
        po_date_to: filters?.po_date_to || '',
        expected_delivery_from: filters?.expected_delivery_from || '',
        expected_delivery_to: filters?.expected_delivery_to || '',
        min_amount: filters?.min_amount || '',
        max_amount: filters?.max_amount || '',
        status: filters?.status || ''
    });

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

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const params = { search };
        
        // Add non-empty filters
        Object.keys(filterData).forEach(key => {
            if (filterData[key]) {
                params[key] = filterData[key];
            }
        });
        
        router.get(route('purchase-bills.index'), params, { preserveState: true });
    };

    const handleFilterChange = (field, value) => {
        setFilterData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearFilters = () => {
        setFilterData({
            vendor_id: '',
            po_date_from: '',
            po_date_to: '',
            expected_delivery_from: '',
            expected_delivery_to: '',
            min_amount: '',
            max_amount: '',
            status: ''
        });
        setSearch('');
        router.get(route('purchase-bills.index'), {}, { preserveState: true });
    };

    const hasActiveFilters = () => {
        return search || Object.values(filterData).some(value => value);
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
        if (search) params.append('search', search);
        
        // Add filter parameters
        Object.keys(filterData).forEach(key => {
            if (filterData[key]) {
                params.append(key, filterData[key]);
            }
        });
        
        params.append('export', 'excel');
        window.open(`${route('purchase-bills.index')}?${params.toString()}`, '_blank');
    };

    const handleExportPDF = () => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        
        // Add filter parameters
        Object.keys(filterData).forEach(key => {
            if (filterData[key]) {
                params.append(key, filterData[key]);
            }
        });
        
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
                                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Create Purchase Bill
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-6 space-y-4">
                        {/* Search Bar */}
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
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        />
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                    >
                                        Search
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                                            showFilters || hasActiveFilters()
                                                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        <FunnelIcon className="w-4 h-4" />
                                        <span>Filters</span>
                                        {hasActiveFilters() && (
                                            <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                !
                                            </span>
                                        )}
                                    </button>
                                    {hasActiveFilters() && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-200"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Advanced Filters Panel */}
                        {showFilters && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Advanced Filters</h3>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleFilterSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Vendor Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Vendor
                                            </label>
                                            <select
                                                value={filterData.vendor_id}
                                                onChange={(e) => handleFilterChange('vendor_id', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                            >
                                                <option value="">All Vendors</option>
                                                {vendors?.map(vendor => (
                                                    <option key={vendor.id} value={vendor.id}>
                                                        {vendor.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Status Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Status
                                            </label>
                                            <select
                                                value={filterData.status}
                                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                            >
                                                <option value="">All Status</option>
                                                <option value="draft">Draft</option>
                                                <option value="sent">Sent</option>
                                                <option value="received">Received</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        {/* Amount Range */}
                                        <div className="md:col-span-2 lg:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Amount Range
                                            </label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={filterData.min_amount}
                                                    onChange={(e) => handleFilterChange('min_amount', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Max"
                                                    value={filterData.max_amount}
                                                    onChange={(e) => handleFilterChange('max_amount', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date Filters */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* PO Date Range */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                PO Date Range
                                            </label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="date"
                                                    value={filterData.po_date_from}
                                                    onChange={(e) => handleFilterChange('po_date_from', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                                />
                                                <span className="px-2 py-2 text-gray-500 dark:text-gray-400">to</span>
                                                <input
                                                    type="date"
                                                    value={filterData.po_date_to}
                                                    onChange={(e) => handleFilterChange('po_date_to', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                                />
                                            </div>
                                        </div>

                                        {/* Expected Delivery Date Range */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Expected Delivery Range
                                            </label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="date"
                                                    value={filterData.expected_delivery_from}
                                                    onChange={(e) => handleFilterChange('expected_delivery_from', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                                />
                                                <span className="px-2 py-2 text-gray-500 dark:text-gray-400">to</span>
                                                <input
                                                    type="date"
                                                    value={filterData.expected_delivery_to}
                                                    onChange={(e) => handleFilterChange('expected_delivery_to', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Filter Actions */}
                                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            Reset Filters
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        bill.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                        bill.status === 'sent' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' :
                                                        bill.status === 'received' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                        bill.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                                    }`}>
                                                        {bill.status?.charAt(0).toUpperCase() + bill.status?.slice(1) || 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link
                                                            href={route('purchase-bills.show', bill.id)}
                                                            className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors duration-200"
                                                            title="View"
                                                        >
                                                            <EyeIcon className="w-5 h-5" />
                                                        </Link>
                                                        <Link
                                                            href={route('purchase-bills.edit', bill.id)}
                                                            className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors duration-200"
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
                                            <td colSpan="7" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No purchase bills found</h3>
                                                    <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first purchase bill.</p>
                                                    <Link
                                                        href={route('purchase-bills.create')}
                                                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                                                    >
                                                        <PlusIcon className="w-4 h-4 mr-2" />
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
                                                        ? 'bg-primary-600 text-white'
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
