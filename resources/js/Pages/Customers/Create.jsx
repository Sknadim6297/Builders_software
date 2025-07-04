import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Create({ flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        mobile_number: '',
        address: '',
        pincode: '',
        location: '',
        alternate_mobile: '',
        source: '',
        gst_number: '',
        is_active: true,
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

    const sourceOptions = [
        'Website',
        'Referral',
        'Social Media',
        'Advertisement',
        'Walk-in',
        'Phone Call',
        'Email',
        'Other'
    ];

    const submit = (e) => {
        e.preventDefault();

        post(route('customers.store'), {
            onSuccess: () => {
                reset();
            }
        });
    };

    return (
        <SidebarLayout>
            <Head title="Create Customer" />
            
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <Link
                        href={route('customers.index')}
                        className="mr-4 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Customer</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Add a new customer to your database</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <form onSubmit={submit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer Name */}
                            <div className="md:col-span-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Customer Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                            </div>

                            {/* Mobile Number */}
                            <div>
                                <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="mobile_number"
                                    type="tel"
                                    value={data.mobile_number}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    onChange={(e) => setData('mobile_number', e.target.value)}
                                    placeholder="Enter mobile number"
                                    required
                                />
                                {errors.mobile_number && <div className="text-red-600 text-sm mt-1">{errors.mobile_number}</div>}
                            </div>

                            {/* Alternate Mobile */}
                            <div>
                                <label htmlFor="alternate_mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Alternate Mobile
                                </label>
                                <input
                                    id="alternate_mobile"
                                    type="tel"
                                    value={data.alternate_mobile}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setData('alternate_mobile', value);
                                    }}
                                    placeholder="Enter 10-digit alternate number (optional)"
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                />
                                <p className="text-sm text-gray-500 mt-1">Optional: Enter exactly 10 digits</p>
                                {errors.alternate_mobile && <div className="text-red-600 text-sm mt-1">{errors.alternate_mobile}</div>}
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    value={data.address}
                                    rows={3}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Customer's full address"
                                />
                                {errors.address && <div className="text-red-600 text-sm mt-1">{errors.address}</div>}
                            </div>

                            {/* Pincode */}
                            <div>
                                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Pincode <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="pincode"
                                    type="text"
                                    value={data.pincode}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setData('pincode', value);
                                    }}
                                    placeholder="Enter 6-digit pincode"
                                    maxLength="6"
                                    pattern="[0-9]{6}"
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">Enter exactly 6 digits</p>
                                {errors.pincode && <div className="text-red-600 text-sm mt-1">{errors.pincode}</div>}
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Location
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    value={data.location}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="City, State"
                                />
                                {errors.location && <div className="text-red-600 text-sm mt-1">{errors.location}</div>}
                            </div>

                            {/* Source */}
                            <div>
                                <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Source <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="source"
                                    value={data.source}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    onChange={(e) => setData('source', e.target.value)}
                                    required
                                >
                                    <option value="">Select Source</option>
                                    {sourceOptions.map((source) => (
                                        <option key={source} value={source}>
                                            {source}
                                        </option>
                                    ))}
                                </select>
                                {errors.source && <div className="text-red-600 text-sm mt-1">{errors.source}</div>}
                            </div>

                            {/* GST Number */}
                            <div>
                                <label htmlFor="gst_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    GST Number
                                </label>
                                <input
                                    id="gst_number"
                                    type="text"
                                    value={data.gst_number}
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    onChange={(e) => setData('gst_number', e.target.value)}
                                    placeholder="Optional GST number"
                                />
                                {errors.gst_number && <div className="text-red-600 text-sm mt-1">{errors.gst_number}</div>}
                            </div>
                        </div>

                        <div className="flex items-center justify-end mt-6 space-x-3">
                            <Link
                                href={route('customers.index')}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Customer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
