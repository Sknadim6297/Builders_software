import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ auth, stock, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        item_name: stock.item_name || '',
        item_description: stock.item_description || '',
        unit: stock.unit || 'pcs',
        reorder_level: stock.reorder_level || 0,
        supplier_info: stock.supplier_info || '',
        location: stock.location || ''
    });

    const measurementUnits = ['pcs', 'kg', 'g', 'l', 'ml', 'box', 'pack', 'meter', 'feet', 'inch'];

    // Show flash messages as toasts
    useEffect(() => {
        if (flash?.success) {
            window.showSuccess(flash.success);
        }
        if (flash?.error) {
            window.showError(flash.error);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        put(route('stocks.update', stock.id), {
            onSuccess: () => {
                // No custom toast here - let backend flash message handle it
            },
            onError: (errors) => {
                console.log('Form submission errors:', errors);
                // Show validation errors in toast
                Object.keys(errors).forEach(key => {
                    if (window.showError) {
                        window.showError(`${key}: ${errors[key]}`);
                    }
                });
            }
        });
    };

    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount || 0).toFixed(2)}`;
    };

    return (
        <SidebarLayout>
            <Head title={`Edit Stock - ${stock.item_name}`} />
            
            <div className="py-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.visit(route('stocks.show', stock.id))}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                            >
                                <ArrowLeftIcon className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
                                    Edit Stock Item
                                </h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Update item information and settings
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Item Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Item Information</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Item Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.item_name}
                                        onChange={(e) => setData('item_name', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        placeholder="Enter item name"
                                    />
                                    {errors.item_name && <div className="text-red-500 text-sm mt-1">{errors.item_name}</div>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.item_description}
                                        onChange={(e) => setData('item_description', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        placeholder="Enter item description"
                                    />
                                    {errors.item_description && <div className="text-red-500 text-sm mt-1">{errors.item_description}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Unit *
                                    </label>
                                    <select
                                        value={data.unit}
                                        onChange={(e) => setData('unit', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    >
                                        {measurementUnits.map(unit => (
                                            <option key={unit} value={unit}>
                                                {unit.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.unit && <div className="text-red-500 text-sm mt-1">{errors.unit}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        placeholder="Storage location"
                                    />
                                    {errors.location && <div className="text-red-500 text-sm mt-1">{errors.location}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Current Stock Status */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Current Stock Status</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Quantity
                                    </label>
                                    <input
                                        type="text"
                                        value={`${parseFloat(stock.quantity_on_hand).toFixed(2)} ${stock.unit?.toUpperCase()}`}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                                    />
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Use stock adjustments to change quantity
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Unit Cost
                                    </label>
                                    <input
                                        type="text"
                                        value={formatCurrency(stock.unit_cost)}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                                    />
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Updated automatically with purchases
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Total Value
                                    </label>
                                    <input
                                        type="text"
                                        value={formatCurrency(stock.total_value)}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stock Settings */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Stock Settings</h2>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Reorder Level *
                                </label>
                                <input
                                    type="number"
                                    value={data.reorder_level}
                                    onChange={(e) => setData('reorder_level', e.target.value)}
                                    min="0"
                                    required
                                    className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    placeholder="0"
                                />
                                {errors.reorder_level && <div className="text-red-500 text-sm mt-1">{errors.reorder_level}</div>}
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Alert when stock falls below this level
                                </p>
                            </div>
                        </div>

                        {/* Supplier Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Supplier Information</h2>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Supplier Information
                                </label>
                                <textarea
                                    value={data.supplier_info}
                                    onChange={(e) => setData('supplier_info', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    placeholder="Enter supplier details, contact information, etc."
                                />
                                {errors.supplier_info && <div className="text-red-500 text-sm mt-1">{errors.supplier_info}</div>}
                            </div>
                        </div>

                        {/* Submit Section */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => router.visit(route('stocks.show', stock.id))}
                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
                            >
                                {processing ? 'Updating...' : 'Update Stock Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
