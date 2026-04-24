import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { route } from '@/utils/route';

export default function Edit({ customer, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name || '',
        email: customer.email || '',
        mobile_number: customer.mobile_number || '',
        address: customer.address || '',
        delivery_address: customer.delivery_address || '',
        pincode: customer.pincode || '',
        location: customer.location || '',
        alternate_mobile: customer.alternate_mobile || '',
        source: customer.source || '',
        gst_number: customer.gst_number || '',
        is_active: customer.is_active ?? true,
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
        put(route('customers.update', customer.id));
    };

    return (
        <SidebarLayout>
            <Head title="Edit Customer" />
            
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Edit Customer
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Update customer information
                            </p>
                        </div>
                        <a
                            href={route('customers.index')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Back to Customers
                        </a>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Customer Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Customer Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter customer name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Mobile Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter email (optional)"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Mobile Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Mobile Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.mobile_number}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setData('mobile_number', value);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter 10-digit mobile number"
                                        maxLength="10"
                                        minLength="10"
                                        inputMode="numeric"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Enter exactly 10 digits</p>
                                    {errors.mobile_number && (
                                        <p className="text-red-500 text-sm mt-1">{errors.mobile_number}</p>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Address *
                                    </label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter complete address"
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                    )}
                                </div>

                                {/* Delivery Address */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Delivery Address
                                    </label>
                                    <textarea
                                        value={data.delivery_address}
                                        onChange={(e) => setData('delivery_address', e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter delivery address for billing invoices"
                                    />
                                    {errors.delivery_address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.delivery_address}</p>
                                    )}
                                </div>

                                {/* Pincode */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Pincode *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.pincode}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setData('pincode', value);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter 6-digit pincode"
                                        maxLength="6"
                                        pattern="[0-9]{6}"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Enter exactly 6 digits</p>
                                    {errors.pincode && (
                                        <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                                    )}
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter location"
                                    />
                                    {errors.location && (
                                        <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                                    )}
                                </div>

                                {/* Alternate Mobile */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Alternate Mobile
                                    </label>
                                    <input
                                        type="text"
                                        value={data.alternate_mobile}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setData('alternate_mobile', value);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter 10-digit alternate mobile (optional)"
                                        maxLength="10"
                                        inputMode="numeric"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Optional: Enter exactly 10 digits</p>
                                    {errors.alternate_mobile && (
                                        <p className="text-red-500 text-sm mt-1">{errors.alternate_mobile}</p>
                                    )}
                                </div>

                                {/* Source */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Source *
                                    </label>
                                    <select
                                        value={data.source}
                                        onChange={(e) => setData('source', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select Source</option>
                                        <option value="Website">Website</option>
                                        <option value="Referral">Referral</option>
                                        <option value="Social Media">Social Media</option>
                                        <option value="Advertisement">Advertisement</option>
                                        <option value="Walk-in">Walk-in</option>
                                        <option value="Phone Call">Phone Call</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.source && (
                                        <p className="text-red-500 text-sm mt-1">{errors.source}</p>
                                    )}
                                </div>

                                {/* GST Number */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        GST Number
                                    </label>
                                    <input
                                        type="text"
                                        value={data.gst_number}
                                        onChange={(e) => setData('gst_number', e.target.value.toUpperCase())}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter GST number (optional)"
                                        maxLength="15"
                                    />
                                    {errors.gst_number && (
                                        <p className="text-red-500 text-sm mt-1">{errors.gst_number}</p>
                                    )}
                                    <p className="text-gray-500 text-sm mt-1">
                                        Format: 22AAAAA0000A1Z5 (15 characters)
                                    </p>
                                </div>

                                {/* Active Status */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:ring-primary-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            Active Customer
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center"
                                >
                                    {processing && (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    Update Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
