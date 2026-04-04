import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { route } from '@/utils/route';

const UNIT_TYPES = ['Packet', 'Box', 'Piece', 'KG', 'Liter', 'Meter', 'Square Meter', 'Bundle', 'Bag', 'Carton'];

export default function Edit({ item, categories, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        category_id: item.category_id ? String(item.category_id) : '',
        name: item.name || '',
        hsn_code: item.hsn_code || '',
        description: item.description || '',
        unit_type: item.unit_type || 'Piece',
        default_unit_price: item.default_unit_price || '0',
        default_discount_percentage: item.default_discount_percentage || '0',
        gst_percentage: item.gst_percentage || '0',
        is_active: item.is_active || true
    });

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
        put(route('items.update', item.id));
    };

    return (
        <SidebarLayout>
            <Head title={`Edit Item - ${item.name}`} />
            <div className="p-6">
                <div className="mb-6 flex items-center gap-4">
                    <Link href={route('items.index')} className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Item</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Code: {item.item_code}</p>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select category</option>
                                    {categories?.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name} {category.discount_percentage ? `(${parseFloat(category.discount_percentage).toFixed(2)}% default discount)` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.name && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HSN Code</label>
                                <input
                                    type="text"
                                    value={data.hsn_code}
                                    onChange={(e) => setData('hsn_code', e.target.value)}
                                    placeholder="e.g., 9405"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.hsn_code && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.hsn_code}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.description && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.description}</p>}
                            </div>

                            {/* Unit Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit Type *</label>
                                <select
                                    value={data.unit_type}
                                    onChange={(e) => setData('unit_type', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    {UNIT_TYPES.map(unit => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                                {errors.unit_type && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.unit_type}</p>}
                            </div>

                            {/* GST Percentage */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Unit Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.default_unit_price}
                                    onChange={(e) => setData('default_unit_price', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.default_unit_price && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.default_unit_price}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Discount (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={data.default_discount_percentage}
                                    onChange={(e) => setData('default_discount_percentage', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.default_discount_percentage && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.default_discount_percentage}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GST Percentage (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={data.gst_percentage}
                                    onChange={(e) => setData('gst_percentage', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.gst_percentage && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.gst_percentage}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Item'}
                                </button>
                                <Link href={route('items.index')} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
