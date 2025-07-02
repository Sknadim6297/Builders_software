import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ vendor, flash }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: vendor.name || '',
        mobile_number: vendor.mobile_number || '',
        address: vendor.address || '',
        pincode: vendor.pincode || '',
        location: vendor.location || '',
        alternate_mobile: vendor.alternate_mobile || '',
        supply_of_goods: vendor.supply_of_goods || '',
        gst_number: vendor.gst_number || '',
        is_active: vendor.is_active ?? true
    });

    // Show flash messages as toasts
    useEffect(() => {
        if (flash?.success) {
            window.showSuccess(flash.success);
        }
        if (flash?.error) {
            window.showError(flash.error);
        }
        if (flash?.warning) {
            window.showWarning(flash.warning);
        }
        if (flash?.info) {
            window.showInfo(flash.info);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('vendors.update', vendor.id), {
            onSuccess: () => {
                window.showSuccess('Vendor updated successfully!');
            },
            onError: () => {
                window.showError('Please check the form for errors.');
            }
        });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN');
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '-';
        return timeStr.slice(0, 5); // HH:MM format
    };

    return (
        <SidebarLayout>
            <Head title={`Edit ${vendor.name}`} />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('vendors.index')}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            Back to Vendors
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Vendor</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Update vendor information</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                    {/* Vendor Details Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vendor ID</p>
                                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{vendor.vend_id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created Date</p>
                                <p className="text-sm text-gray-900 dark:text-white">{formatDate(vendor.date)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created Time</p>
                                <p className="text-sm text-gray-900 dark:text-white">{formatTime(vendor.time)}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Vendor Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Vendor Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                                    placeholder="Enter vendor name"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Mobile Number */}
                            <div>
                                <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="mobile_number"
                                    value={data.mobile_number}
                                    onChange={(e) => setData('mobile_number', e.target.value)}
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.mobile_number ? 'border-red-500' : ''}`}
                                    placeholder="Enter mobile number"
                                    maxLength="10"
                                />
                                {errors.mobile_number && <p className="mt-1 text-sm text-red-600">{errors.mobile_number}</p>}
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="address"
                                    rows="3"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.address ? 'border-red-500' : ''}`}
                                    placeholder="Enter complete address"
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>

                            {/* Pincode */}
                            <div>
                                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Pincode <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="pincode"
                                    value={data.pincode}
                                    onChange={(e) => setData('pincode', e.target.value)}
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.pincode ? 'border-red-500' : ''}`}
                                    placeholder="Enter 6-digit pincode"
                                    maxLength="6"
                                />
                                {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.location ? 'border-red-500' : ''}`}
                                    placeholder="Enter location/city"
                                />
                                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                            </div>

                            {/* Alternate Mobile */}
                            <div>
                                <label htmlFor="alternate_mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Alternate Mobile
                                </label>
                                <input
                                    type="text"
                                    id="alternate_mobile"
                                    value={data.alternate_mobile}
                                    onChange={(e) => setData('alternate_mobile', e.target.value)}
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.alternate_mobile ? 'border-red-500' : ''}`}
                                    placeholder="Enter alternate mobile number"
                                    maxLength="10"
                                />
                                {errors.alternate_mobile && <p className="mt-1 text-sm text-red-600">{errors.alternate_mobile}</p>}
                            </div>

                            {/* Supply of Goods */}
                            <div>
                                <label htmlFor="supply_of_goods" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Supply of Items <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="supply_of_goods"
                                    value={data.supply_of_goods}
                                    onChange={(e) => setData('supply_of_goods', e.target.value)}
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.supply_of_goods ? 'border-red-500' : ''}`}
                                    placeholder="e.g., Electronics, Furniture, Raw Materials"
                                />
                                {errors.supply_of_goods && <p className="mt-1 text-sm text-red-600">{errors.supply_of_goods}</p>}
                            </div>

                            {/* GST Number */}
                            <div className="md:col-span-2">
                                <label htmlFor="gst_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    GST Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="gst_number"
                                    value={data.gst_number}
                                    onChange={(e) => setData('gst_number', e.target.value.toUpperCase())}
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono ${errors.gst_number ? 'border-red-500' : ''}`}
                                    placeholder="Enter 15-digit GST number (e.g., 22AAAAA0000A1Z5)"
                                    maxLength="15"
                                    required
                                />
                                {errors.gst_number && <p className="mt-1 text-sm text-red-600">{errors.gst_number}</p>}
                                <p className="mt-1 text-xs text-gray-500">GST number must be exactly 15 characters (e.g., 22AAAAA0000A1Z5)</p>
                            </div>

                            {/* Status */}
                            <div className="md:col-span-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active Vendor</span>
                                </label>
                                <p className="mt-1 text-xs text-gray-500">Uncheck to mark this vendor as inactive</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end mt-6 space-x-3">
                            <Link
                                href={route('vendors.index')}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Vendor'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
