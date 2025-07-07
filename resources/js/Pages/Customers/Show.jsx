import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Show({ customer }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <SidebarLayout>
            <Head title={`Customer - ${customer.name}`} />
            
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Customer Details
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                View customer information and history
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                href={route('customers.edit', customer.id)}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                Edit Customer
                            </Link>
                            <Link
                                href={route('customers.index')}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                Back to Customers
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Customer Information */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Customer Information
                                        </h2>
                                        <div className="flex items-center">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                customer.is_active 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                                {customer.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Customer ID
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white font-mono">
                                                {customer.cust_id}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Customer Name
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {customer.name}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Mobile Number
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                <a href={`tel:+91${customer.mobile_number}`} className="hover:text-primary-600">
                                                    +91 {customer.mobile_number}
                                                </a>
                                            </p>
                                        </div>

                                        {customer.alternate_mobile && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Alternate Mobile
                                                </label>
                                                <p className="mt-1 text-gray-900 dark:text-white">
                                                    <a href={`tel:+91${customer.alternate_mobile}`} className="hover:text-primary-600">
                                                        +91 {customer.alternate_mobile}
                                                    </a>
                                                </p>
                                            </div>
                                        )}

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Address
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {customer.address}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Pincode
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {customer.pincode}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Location
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {customer.location}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Source
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {customer.source}
                                            </p>
                                        </div>

                                        {customer.gst_number && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    GST Number
                                                </label>
                                                <p className="mt-1 text-gray-900 dark:text-white font-mono">
                                                    {customer.gst_number}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Registration Date
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {formatDate(customer.created_at)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Last Updated
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {formatDate(customer.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions & Statistics */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-3">
                                        <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Create Bill
                                        </button>
                                        <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View Bills
                                        </button>
                                        <a
                                            href={`tel:+91${customer.mobile_number}`}
                                            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            Call Customer
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Statistics */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Customer Statistics
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Total Bills</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">0</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">₹0.00</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Last Bill</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">Never</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Status</span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                customer.is_active 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                                {customer.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bills History Section */}
                    <div className="mt-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Bills History
                                    </h3>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm">
                                        Create New Bill
                                    </button>
                                </div>
                                
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        No Bills Found
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        This customer doesn't have any bills yet. Create the first bill to get started.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
