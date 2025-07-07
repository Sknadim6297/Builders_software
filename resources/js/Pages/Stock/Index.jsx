import { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { 
    MagnifyingGlassIcon, 
    EyeIcon, 
    ExclamationTriangleIcon,
    AdjustmentsHorizontalIcon,
    DocumentTextIcon,
    TableCellsIcon
} from '@heroicons/react/24/outline';

export default function Index({ auth, stocks, filters, flash }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showLowStock, setShowLowStock] = useState(filters.low_stock || false);

    // Show flash messages as toasts
    useEffect(() => {
        if (flash?.success) {
            window.showSuccess(flash.success);
        }
        if (flash?.error) {
            window.showError(flash.error);
        }
    }, [flash]);

    const handleSearch = () => {
        router.get(route('stocks.index'), {
            search: searchTerm,
            low_stock: showLowStock ? 1 : 0
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setShowLowStock(false);
        router.get(route('stocks.index'));
    };

    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount || 0).toFixed(2)}`;
    };

    const isLowStock = (stock) => {
        return stock.quantity_on_hand <= stock.reorder_level;
    };

    const handleExportPDF = () => {
        const params = new URLSearchParams();
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        if (showLowStock) {
            params.append('low_stock', '1');
        }
        params.append('export', 'pdf');
        window.open(`${route('stocks.index')}?${params.toString()}`, '_blank');
    };

    const handleExportExcel = () => {
        const params = new URLSearchParams();
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        if (showLowStock) {
            params.append('low_stock', '1');
        }
        params.append('export', 'excel');
        window.open(`${route('stocks.index')}?${params.toString()}`, '_blank');
    };

    return (
        <SidebarLayout>
            <Head title="Stock Management" />
            
            <div className="py-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
                                    Stock Management
                                </h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    View inventory levels automatically updated from purchase bills
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleExportExcel}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                                        title="Export to Excel"
                                    >
                                        <TableCellsIcon className="w-5 h-5 mr-2" />
                                        Export Excel
                                    </button>
                                    <button
                                        onClick={handleExportPDF}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                                        title="Export to PDF"
                                    >
                                        <DocumentTextIcon className="w-5 h-5 mr-2" />
                                        Export PDF
                                    </button>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Stock is automatically updated from purchase bills
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by item name or description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="lowStock"
                                    checked={showLowStock}
                                    onChange={(e) => setShowLowStock(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="lowStock" className="text-sm text-gray-700 dark:text-gray-300">
                                    Show low stock only
                                </label>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSearch}
                                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200"
                                >
                                    Search
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stock Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-blue-700 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Item Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Unit
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Unit Cost
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Total Value
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Last Updated
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                            View Details
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {stocks.data?.length > 0 ? (
                                        stocks.data.map((stock) => (
                                            <tr key={stock.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {stock.item_name}
                                                        </div>
                                                        {stock.item_description && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {stock.item_description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                    {stock.unit?.toUpperCase()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                    <div className="flex items-center">
                                                        {parseFloat(stock.quantity_on_hand).toFixed(2)}
                                                        {isLowStock(stock) && (
                                                            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 ml-2" title="Low Stock" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                    {formatCurrency(stock.unit_cost)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                    {formatCurrency(stock.total_value)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isLowStock(stock) ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                                                            Low Stock
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                            In Stock
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(stock.updated_at).toLocaleDateString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={route('stocks.show', stock.id)}
                                                        className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                                                        title="View Stock Details"
                                                    >
                                                        <EyeIcon className="w-4 h-4 mr-1" />
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <AdjustmentsHorizontalIcon className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" />
                                                    <p className="text-lg">No stock items found</p>
                                                    <p className="text-sm">Stock will appear here when purchase bills are created</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {stocks.last_page > 1 && (
                            <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                        Showing {stocks.from} to {stocks.to} of {stocks.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        {stocks.links?.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-1 text-sm rounded ${
                                                    link.active
                                                        ? 'bg-blue-700 text-white'
                                                        : link.url
                                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
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
