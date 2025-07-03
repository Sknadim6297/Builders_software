import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { ArrowLeftIcon, CalendarIcon, UserIcon, ComputerDesktopIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function Show({ log, flash }) {
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

    const getEventBadgeColor = (event) => {
        const colors = {
            'created': 'bg-green-100 text-green-800',
            'updated': 'bg-blue-100 text-blue-800',
            'deleted': 'bg-red-100 text-red-800',
            'login': 'bg-purple-100 text-purple-800',
            'logout': 'bg-gray-100 text-gray-800',
            'viewed': 'bg-yellow-100 text-yellow-800',
        };
        return colors[event] || 'bg-gray-100 text-gray-800';
    };

    const getLogNameBadgeColor = (logName) => {
        const colors = {
            'auth': 'bg-purple-100 text-purple-800',
            'admin': 'bg-red-100 text-red-800',
            'user': 'bg-blue-100 text-blue-800',
            'customer': 'bg-green-100 text-green-800',
            'vendor': 'bg-orange-100 text-orange-800',
            'service': 'bg-indigo-100 text-indigo-800',
        };
        return colors[logName] || 'bg-gray-100 text-gray-800';
    };

    const formatJson = (obj) => {
        if (!obj) return 'N/A';
        return JSON.stringify(obj, null, 2);
    };

    const hasChanges = log.properties?.changes && Object.keys(log.properties.changes).length > 0;
    const hasOldValues = log.properties?.old && Object.keys(log.properties.old).length > 0;
    const hasNewValues = log.properties?.attributes && Object.keys(log.properties.attributes).length > 0;

    return (
        <SidebarLayout>
            <Head title={`Activity Log #${log.id}`} />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Activity Log Details</h1>
                        <p className="text-gray-600">View detailed information about this activity</p>
                    </div>
                    <Link
                        href={route('activity-logs.index')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back to Activity Logs
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Activity Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {/* Description */}
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{log.description}</dd>
                                    </div>

                                    {/* Category and Event */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Category</dt>
                                            <dd className="mt-1">
                                                {log.log_name ? (
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLogNameBadgeColor(log.log_name)}`}>
                                                        {log.log_name.charAt(0).toUpperCase() + log.log_name.slice(1)}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-500">N/A</span>
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Event</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventBadgeColor(log.event)}`}>
                                                    {log.event.charAt(0).toUpperCase() + log.event.slice(1)}
                                                </span>
                                            </dd>
                                        </div>
                                    </div>

                                    {/* Subject Information */}
                                    {log.subject_type && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Subject</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {log.subject_type.split('\\').pop()} #{log.subject_id}
                                                {log.subject && (
                                                    <span className="text-gray-500">
                                                        {log.subject.name && ` - ${log.subject.name}`}
                                                        {log.subject.email && ` (${log.subject.email})`}
                                                        {log.subject.title && ` - ${log.subject.title}`}
                                                    </span>
                                                )}
                                            </dd>
                                        </div>
                                    )}

                                    {/* Batch UUID */}
                                    {log.batch_uuid && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Batch ID</dt>
                                            <dd className="mt-1 text-sm text-gray-900 font-mono">{log.batch_uuid}</dd>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Changes Information */}
                        {(hasChanges || hasOldValues || hasNewValues) && (
                            <div className="bg-white shadow rounded-lg mt-6">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Changes Details</h3>
                                </div>
                                <div className="p-6">
                                    {hasChanges && (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-medium text-gray-900 mb-3">Changed Fields</h4>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                                                    {formatJson(log.properties.changes)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}

                                    {hasOldValues && (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-medium text-gray-900 mb-3">Old Values</h4>
                                            <div className="bg-red-50 rounded-lg p-4">
                                                <pre className="text-xs text-red-800 whitespace-pre-wrap">
                                                    {formatJson(log.properties.old)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}

                                    {hasNewValues && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-3">New Values</h4>
                                            <div className="bg-green-50 rounded-lg p-4">
                                                <pre className="text-xs text-green-800 whitespace-pre-wrap">
                                                    {formatJson(log.properties.attributes)}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Metadata</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {/* User Information */}
                                    <div>
                                        <dt className="flex items-center text-sm font-medium text-gray-500">
                                            <UserIcon className="w-4 h-4 mr-2" />
                                            Performed By
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {log.causer ? (
                                                <div>
                                                    <div className="font-medium">{log.causer.name}</div>
                                                    <div className="text-gray-500">{log.causer.email}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">System</span>
                                            )}
                                        </dd>
                                    </div>

                                    {/* Date & Time */}
                                    <div>
                                        <dt className="flex items-center text-sm font-medium text-gray-500">
                                            <CalendarIcon className="w-4 h-4 mr-2" />
                                            Date & Time
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            <div>{new Date(log.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</div>
                                            <div className="text-gray-500">{new Date(log.created_at).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })}</div>
                                        </dd>
                                    </div>

                                    {/* IP Address */}
                                    {log.ip_address && (
                                        <div>
                                            <dt className="flex items-center text-sm font-medium text-gray-500">
                                                <GlobeAltIcon className="w-4 h-4 mr-2" />
                                                IP Address
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 font-mono">{log.ip_address}</dd>
                                        </div>
                                    )}

                                    {/* User Agent */}
                                    {log.user_agent && (
                                        <div>
                                            <dt className="flex items-center text-sm font-medium text-gray-500">
                                                <ComputerDesktopIcon className="w-4 h-4 mr-2" />
                                                User Agent
                                            </dt>
                                            <dd className="mt-1 text-xs text-gray-900 break-all">{log.user_agent}</dd>
                                        </div>
                                    )}

                                    {/* Record ID */}
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Log ID</dt>
                                        <dd className="mt-1 text-sm text-gray-900 font-mono">#{log.id}</dd>
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
