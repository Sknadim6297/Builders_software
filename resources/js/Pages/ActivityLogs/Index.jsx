import React, { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, DocumentArrowDownIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Index({ logs, filters, logNames, events, users, flash }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [logNameFilter, setLogNameFilter] = useState(filters.log_name || '');
    const [eventFilter, setEventFilter] = useState(filters.event || '');
    const [userFilter, setUserFilter] = useState(filters.user_id || '');
    const [dateFromFilter, setDateFromFilter] = useState(filters.date_from || '');
    const [dateToFilter, setDateToFilter] = useState(filters.date_to || '');
    const [showFilters, setShowFilters] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);

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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showExportDropdown && !event.target.closest('.relative')) {
                setShowExportDropdown(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showExportDropdown]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('activity-logs.index'), {
            search: searchTerm,
            log_name: logNameFilter,
            event: eventFilter,
            user_id: userFilter,
            date_from: dateFromFilter,
            date_to: dateToFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleExport = (format) => {
        // Create a form and submit it to trigger file download
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('activity-logs.export');
        form.style.display = 'none';
        
        // Add CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
        
        // Add format
        const formatInput = document.createElement('input');
        formatInput.type = 'hidden';
        formatInput.name = 'format';
        formatInput.value = format;
        form.appendChild(formatInput);
        
        // Add current filters
        const filters = {
            search: searchTerm,
            log_name: logNameFilter,
            event: eventFilter,
            user_id: userFilter,
            date_from: dateFromFilter,
            date_to: dateToFilter,
        };
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            }
        });
        
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
        setShowExportDropdown(false);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setLogNameFilter('');
        setEventFilter('');
        setUserFilter('');
        setDateFromFilter('');
        setDateToFilter('');
        router.get(route('activity-logs.index'));
    };

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

    return (
        <SidebarLayout>
            <Head title="Activity Logs" />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
                        <p className="text-gray-600">Monitor all user and admin activities</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <FunnelIcon className="w-4 h-4 mr-2" />
                            Filters
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowExportDropdown(!showExportDropdown)}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                                Export
                                <ChevronDownIcon className="w-4 h-4 ml-2" />
                            </button>
                            
                            {showExportDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                    <div className="py-1">
                                        <button
                                            onClick={() => handleExport('csv')}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Export as CSV
                                        </button>
                                        <button
                                            onClick={() => handleExport('excel')}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Export as Excel
                                        </button>
                                        <button
                                            onClick={() => handleExport('pdf')}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Export as PDF
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="p-4">
                        <form onSubmit={handleSearch} className="space-y-4">
                            {/* Search Bar */}
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            placeholder="Search activity logs..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Search
                                </button>
                            </div>

                            {/* Advanced Filters */}
                            {showFilters && (
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={logNameFilter}
                                            onChange={(e) => setLogNameFilter(e.target.value)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">All Categories</option>
                                            {logNames.map((logName) => (
                                                <option key={logName} value={logName}>
                                                    {logName.charAt(0).toUpperCase() + logName.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
                                        <select
                                            value={eventFilter}
                                            onChange={(e) => setEventFilter(e.target.value)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">All Events</option>
                                            {events.map((event) => (
                                                <option key={event} value={event}>
                                                    {event.charAt(0).toUpperCase() + event.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                                        <select
                                            value={userFilter}
                                            onChange={(e) => setUserFilter(e.target.value)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">All Users</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                                        <input
                                            type="date"
                                            value={dateFromFilter}
                                            onChange={(e) => setDateFromFilter(e.target.value)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                                        <input
                                            type="date"
                                            value={dateToFilter}
                                            onChange={(e) => setDateToFilter(e.target.value)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="flex items-end space-x-2 lg:col-span-5">
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Activity Logs Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Activity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date/Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{log.description}</div>
                                            {log.ip_address && (
                                                <div className="text-xs text-gray-500">IP: {log.ip_address}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {log.causer ? log.causer.name : 'System'}
                                            </div>
                                            {log.causer && (
                                                <div className="text-xs text-gray-500">{log.causer.email}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {log.log_name && (
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLogNameBadgeColor(log.log_name)}`}>
                                                    {log.log_name.charAt(0).toUpperCase() + log.log_name.slice(1)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventBadgeColor(log.event)}`}>
                                                {log.event.charAt(0).toUpperCase() + log.event.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div>{new Date(log.created_at).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-500">{new Date(log.created_at).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <Link
                                                href={route('activity-logs.show', log.id)}
                                                className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                                            >
                                                <EyeIcon className="w-4 h-4 mr-1" />
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs.links && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {logs.prev_page_url && (
                                        <Link href={logs.prev_page_url} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                            Previous
                                        </Link>
                                    )}
                                    {logs.next_page_url && (
                                        <Link href={logs.next_page_url} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{logs.from}</span> to <span className="font-medium">{logs.to}</span> of{' '}
                                            <span className="font-medium">{logs.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {logs.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        link.active
                                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } ${index === 0 ? 'rounded-l-md' : ''} ${index === logs.links.length - 1 ? 'rounded-r-md' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
