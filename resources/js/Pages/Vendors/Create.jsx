import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { route } from '@/utils/route';

export default function Create({ flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        mobile_number: '',
        address: '',
        pincode: '',
        location: '',
        alternate_mobile: '',
        supply_of_goods: '',
        gst_number: '',
        is_active: true
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
        post(route('vendors.store'));
    };

    return (
        <SidebarLayout>
            <Head title="Add New Vendor" />
            
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Vendor</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Create a new vendor record</p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                href={route('vendors.index')}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                Back to Vendors
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Vendor Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Vendor Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 ${errors.name ? 'border-red-500' : ''}`}
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
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 ${errors.mobile_number ? 'border-red-500' : ''}`}
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
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 ${errors.address ? 'border-red-500' : ''}`}
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
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 ${errors.pincode ? 'border-red-500' : ''}`}
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
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 ${errors.location ? 'border-red-500' : ''}`}
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
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 ${errors.alternate_mobile ? 'border-red-500' : ''}`}
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
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 ${errors.supply_of_goods ? 'border-red-500' : ''}`}
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
                                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono ${errors.gst_number ? 'border-red-500' : ''}`}
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
                                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active Vendor</span>
                                </label>
                                <p className="mt-1 text-xs text-gray-500">Uncheck to mark this vendor as inactive</p>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <Link
                                href={route('vendors.index')}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Vendor'}
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
