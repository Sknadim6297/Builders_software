import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { route } from '@/utils/route';
import { PencilIcon, BuildingOfficeIcon, PhoneIcon, MapPinIcon, ClipboardDocumentListIcon, CalendarIcon, ClockIcon, CheckBadgeIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Show({ vendor, flash }) {
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

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '-';
        const time = timeStr.slice(0, 5); // HH:MM format
        return time;
    };

    return (
        <SidebarLayout>
            <Head title={`${vendor.name} - Vendor Details`} />
            
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{vendor.name}</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Vendor Details</p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                href={route('vendors.edit', vendor.id)}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                <PencilIcon className="w-4 h-4 mr-2 inline" />
                                Edit Vendor
                            </Link>
                            <Link
                                href={route('vendors.index')}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                Back to Vendors
                            </Link>
                        </div>
                    </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Information Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vendor Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Vendor ID</label>
                                            <p className="mt-1 text-lg font-semibold text-primary-600 dark:text-primary-400">{vendor.vend_id}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Vendor Name</label>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white font-medium">{vendor.name}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Mobile Number</label>
                                            <div className="mt-1 flex items-center">
                                                <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                <p className="text-sm text-gray-900 dark:text-white">{vendor.mobile_number}</p>
                                            </div>
                                        </div>

                                        {vendor.alternate_mobile && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Alternate Mobile</label>
                                                <div className="mt-1 flex items-center">
                                                    <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                    <p className="text-sm text-gray-900 dark:text-white">{vendor.alternate_mobile}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Supply of Items</label>
                                            <div className="mt-1 flex items-center">
                                                <ClipboardDocumentListIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100">
                                                    {vendor.supply_of_goods}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                                            <div className="mt-1 flex items-start">
                                                <MapPinIcon className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-gray-900 dark:text-white">{vendor.address}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Location</label>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{vendor.location}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Pincode</label>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{vendor.pincode}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">GST Number</label>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{vendor.gst_number}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                            <div className="mt-1 flex items-center">
                                                {vendor.is_active ? (
                                                    <>
                                                        <CheckBadgeIcon className="w-4 h-4 text-green-500 mr-2" />
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                                            Active
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XMarkIcon className="w-4 h-4 text-red-500 mr-2" />
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                                                            Inactive
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Information */}
                    <div className="space-y-6">
                        {/* Record Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Record Details</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Created Date</label>
                                    <div className="mt-1 flex items-center">
                                        <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-900 dark:text-white">{formatDate(vendor.date)}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Created Time</label>
                                    <div className="mt-1 flex items-center">
                                        <ClockIcon className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-900 dark:text-white">{formatTime(vendor.time)}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                                    <div className="mt-1 flex items-center">
                                        <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-900 dark:text-white">{formatDate(vendor.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <Link
                                    href={route('vendors.edit', vendor.id)}
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <PencilIcon className="w-4 h-4 mr-2" />
                                    Edit Details
                                </Link>
                                
                                <Link
                                    href={route('vendors.index')}
                                    className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    Back to List
                                </Link>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contact Info</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <div>
                                    <a 
                                        href={`tel:${vendor.mobile_number}`}
                                        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                                    >
                                        <PhoneIcon className="w-4 h-4 mr-2" />
                                        Call Primary
                                    </a>
                                </div>
                                
                                {vendor.alternate_mobile && (
                                    <div>
                                        <a 
                                            href={`tel:${vendor.alternate_mobile}`}
                                            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                                        >
                                            <PhoneIcon className="w-4 h-4 mr-2" />
                                            Call Alternate
                                        </a>
                                    </div>
                                )}
                                
                                <div>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.address + ', ' + vendor.location + ', ' + vendor.pincode)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                                    >
                                        <MapPinIcon className="w-4 h-4 mr-2" />
                                        View on Map
                                    </a>
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
