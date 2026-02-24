import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '../../Layouts/SidebarLayout';import { route } from '@/utils/route';import { 
    ArrowLeftIcon, 
    ExclamationTriangleIcon,
    ClockIcon,
    DocumentTextIcon,
    TableCellsIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

export default function Show({ auth, stock, flash }) {
    // Show flash messages as toasts
    useEffect(() => {
        if (flash?.success) {
            window.showSuccess(flash.success);
        }
        if (flash?.error) {
            window.showError(flash.error);
        }
    }, [flash]);

    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount || 0).toFixed(2)}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isLowStock = () => {
        return stock.quantity_on_hand <= stock.reorder_level;
    };

    const getMovementTypeColor = (type) => {
        switch (type) {
            case 'in':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'out':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'adjustment':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const handleExportMovementsPDF = () => {
        window.open(`${route('stocks.show', stock.id)}?export=pdf`, '_blank');
    };

    const handleExportMovementsExcel = () => {
        window.open(`${route('stocks.show', stock.id)}?export=excel`, '_blank');
    };

    return (
        <SidebarLayout>
            <Head title={`Stock - ${stock.item_name}`} />
            
            <div className="py-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => router.visit(route('stocks.index'))}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                                >
                                    <ArrowLeftIcon className="w-6 h-6" />
                                </button>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-heading">
                                        {stock.item_name}
                                    </h1>
                                    <p className="mt-1 sm:mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Automatically managed inventory item with movement history
                                    </p>
                                </div>
                            </div>
                            
                            {/* Action buttons and info - responsive */}
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                {/* Export buttons */}
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <button
                                        onClick={handleExportMovementsExcel}
                                        className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 text-sm"
                                        title="Export Movement History to Excel"
                                    >
                                        <TableCellsIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                        <span className="hidden sm:inline">Export </span>Excel
                                    </button>
                                    <button
                                        onClick={handleExportMovementsPDF}
                                        className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 text-sm"
                                        title="Export Movement History to PDF"
                                    >
                                        <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                        <span className="hidden sm:inline">Export </span>PDF
                                    </button>
                                </div>
                                
                                {/* Read-only notice */}
                                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-primary-50 dark:bg-primary-900/20 px-3 sm:px-4 py-2 rounded-lg border border-primary-200 dark:border-primary-800">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="hidden sm:inline">Read-only: </span>Auto-managed
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Stock Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Item Information</h2>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Item Name
                                        </label>
                                        <p className="text-gray-900 dark:text-white text-sm sm:text-base break-words">{stock.item_name}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Unit
                                        </label>
                                        <p className="text-gray-900 dark:text-white text-sm sm:text-base">{stock.unit?.toUpperCase()}</p>
                                    </div>
                                    
                                    {stock.item_description && (
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Description
                                            </label>
                                            <p className="text-gray-900 dark:text-white text-sm sm:text-base break-words">{stock.item_description}</p>
                                        </div>
                                    )}
                                    
                                    {stock.location && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Location
                                            </label>
                                            <p className="text-gray-900 dark:text-white text-sm sm:text-base">{stock.location}</p>
                                        </div>
                                    )}
                                    
                                    {stock.supplier_info && (
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Supplier Information
                                            </label>
                                            <p className="text-gray-900 dark:text-white text-sm sm:text-base break-words">{stock.supplier_info}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stock Movements */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Stock Movements</h2>
                                
                                {stock.stock_movements && stock.stock_movements.length > 0 ? (
                                    <div className="space-y-3 sm:space-y-4">
                                        {stock.stock_movements.map((movement) => (
                                            <div key={movement.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMovementTypeColor(movement.movement_type)}`}>
                                                            {movement.movement_type.toUpperCase()}
                                                        </span>
                                                        <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                                                            {movement.movement_type === 'out' ? '-' : '+'}{parseFloat(movement.quantity).toFixed(2)} {stock.unit?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="text-left sm:text-right">
                                                        <div className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                                                            {formatCurrency(movement.total_cost)}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                            <ClockIcon className="w-3 h-3 mr-1" />
                                                            {formatDate(movement.created_at)}
                                                        </div>
                                                    </div>
                                                </div>
                                                {movement.notes && (
                                                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                        {movement.notes}
                                                    </div>
                                                )}
                                                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0 text-xs text-gray-500 dark:text-gray-400">
                                                    <span>
                                                        {movement.created_by && `By: ${movement.created_by.name}`}
                                                    </span>
                                                    {movement.reference_type === 'purchase_bill' && (
                                                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded inline-block">
                                                            Purchase Bill #{movement.reference_id}
                                                        </span>
                                                    )}
                                                    {movement.reference_type === 'invoice' && (
                                                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded inline-block">
                                                            Invoice #{movement.reference_id}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                        <AdjustmentsHorizontalIcon className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                                        <p>No stock movements recorded</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stock Summary Sidebar */}
                        <div className="space-y-6 lg:space-y-6">
                            {/* Current Stock Status */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Stock</h3>
                                
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                            {parseFloat(stock.quantity_on_hand).toFixed(2)}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {stock.unit?.toUpperCase()} on hand
                                        </div>
                                    </div>
                                    
                                    {isLowStock() && (
                                        <div className="flex items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                                            <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                                                Low Stock Alert
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Summary</h3>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Unit Cost</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(stock.unit_cost)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Value</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(stock.total_value)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Reorder Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reorder Information</h3>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Reorder Level</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {stock.reorder_level} {stock.unit?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                                        <span className={`text-sm font-medium ${
                                            isLowStock() 
                                                ? 'text-red-600 dark:text-red-400' 
                                                : 'text-green-600 dark:text-green-400'
                                        }`}>
                                            {isLowStock() ? 'Needs Reorder' : 'Sufficient Stock'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
