import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, DocumentArrowDownIcon, TrashIcon, ChevronDownIcon, CheckIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function Index({ logs, filters, logNames, events, users, flash }) {
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [logNameFilter, setLogNameFilter] = useState(filters.log_name || '');
    const [eventFilter, setEventFilter] = useState(filters.event || '');
    const [userFilter, setUserFilter] = useState(filters.user_id || '');
    const [dateFromFilter, setDateFromFilter] = useState(filters.date_from || '');
    const [dateToFilter, setDateToFilter] = useState(filters.date_to || '');
    const [showFilters, setShowFilters] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    
    // Deletion related states
    const [selectedLogs, setSelectedLogs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [pendingDeletion, setPendingDeletion] = useState(null);
    const [otpLoading, setOtpLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [otpError, setOtpError] = useState('');

    // Check if user is super admin
    const isSuperAdmin = auth.user?.is_super_admin;

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

    // Handle select all functionality
    useEffect(() => {
        if (selectAll) {
            setSelectedLogs(logs.data.map(log => log.id));
        } else {
            setSelectedLogs([]);
        }
    }, [selectAll, logs.data]);

    // Update select all state based on individual selections
    useEffect(() => {
        if (selectedLogs.length === logs.data.length && logs.data.length > 0) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedLogs, logs.data]);

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

    // Selection handlers
    const handleSelectLog = (logId) => {
        setSelectedLogs(prev => 
            prev.includes(logId) 
                ? prev.filter(id => id !== logId)
                : [...prev, logId]
        );
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
    };

    // Deletion handlers
    const handleDeleteSelected = () => {
        if (selectedLogs.length === 0) return;
        
        setPendingDeletion({
            type: 'bulk',
            ids: selectedLogs,
            count: selectedLogs.length
        });
        setShowConfirmDialog(true);
    };

    const handleDeleteSingle = (logId) => {
        setPendingDeletion({
            type: 'single',
            ids: [logId],
            count: 1
        });
        setShowConfirmDialog(true);
    };

    const confirmDeletion = async () => {
        if (!pendingDeletion) return;
        
        setShowConfirmDialog(false);
        setOtpLoading(true);
        setOtpError('');
        
        try {
            const response = await axios.post(route('activity-logs.request-delete-otp'), {
                log_ids: pendingDeletion.ids
            });
            
            if (response.data.success) {
                setShowOtpModal(true);
                window.showSuccess(response.data.message);
                
                // If debug OTP is provided (development mode), pre-fill it
                if (response.data.debug_otp) {
                    setOtpCode(response.data.debug_otp);
                }
            } else {
                window.showError(response.data.message || 'Failed to send OTP');
                setPendingDeletion(null);
            }
        } catch (error) {
            console.error('Error requesting OTP:', error);
            window.showError(error.response?.data?.message || 'Failed to send OTP');
            setPendingDeletion(null);
        } finally {
            setOtpLoading(false);
        }
    };

    const verifyOtpAndDelete = async () => {
        if (!otpCode.trim() || !pendingDeletion) return;
        
        setVerifyLoading(true);
        setOtpError('');
        
        try {
            const response = await axios.post(route('activity-logs.verify-delete-otp'), {
                log_ids: pendingDeletion.ids,
                otp: otpCode.trim()
            });
            
            if (response.data.success) {
                setShowOtpModal(false);
                setOtpCode('');
                setPendingDeletion(null);
                setSelectedLogs([]);
                setSelectAll(false);
                
                // Refresh the page to show updated data
                router.reload();
                
                window.showSuccess(`Successfully deleted ${pendingDeletion.count} log(s)`);
            } else {
                setOtpError(response.data.message || 'Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setOtpError(error.response?.data?.message || 'Failed to verify OTP');
        } finally {
            setVerifyLoading(false);
        }
    };

    const cancelDeletion = () => {
        setShowConfirmDialog(false);
        setShowOtpModal(false);
        setOtpCode('');
        setOtpError('');
        setPendingDeletion(null);
    };

    const getEventBadgeColor = (event) => {
        const colors = {
            'created': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'updated': 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
            'deleted': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            'login': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            'logout': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
            'viewed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        };
        return colors[event] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    };

    const getLogNameBadgeColor = (logName) => {
        const colors = {
            // Authentication related
            'auth': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            
            // User management
            'admin': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            'user': 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
            'admin_users': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            
            // Business entities
            'customer': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'customers': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'vendor': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            'vendors': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            'service': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
            'services': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
            
            // Purchase and billing
            'purchase_bill': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
            'purchase_bills': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
            'purchase-bills': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
            
            // Stock management
            'stock': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'stocks': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'stock_management': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'stock_movement': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
            'stock_movements': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
            
            // Activity logs
            'activity_log': 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
            'activity_logs': 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
            
            // System
            'system': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
            'default': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
        };
        
        // Return specific color if found, otherwise return a default color for new log types
        return colors[logName] || colors[logName?.toLowerCase()] || colors['default'];
    };

    return (
        <SidebarLayout>
            <Head title="Activity Logs" />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-heading transition-colors duration-200">Activity Logs</h1>
                        <p className="text-gray-600 dark:text-gray-400 font-body transition-colors duration-200">Monitor all user and admin activities</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {isSuperAdmin && selectedLogs.length > 0 && (
                            <button
                                onClick={handleDeleteSelected}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                            >
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Delete Selected ({selectedLogs.length})
                            </button>
                        )}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
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
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10 transition-colors duration-200">
                                    <div className="py-1">
                                        <button
                                            onClick={() => handleExport('csv')}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            Export as CSV
                                        </button>
                                        <button
                                            onClick={() => handleExport('excel')}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            Export as Excel
                                        </button>
                                        <button
                                            onClick={() => handleExport('pdf')}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
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
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6 transition-colors duration-200">
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
                                            className="pl-10 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
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
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Category</label>
                                        <select
                                            value={logNameFilter}
                                            onChange={(e) => setLogNameFilter(e.target.value)}
                                            className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Event</label>
                                        <select
                                            value={eventFilter}
                                            onChange={(e) => setEventFilter(e.target.value)}
                                            className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">User</label>
                                        <select
                                            value={userFilter}
                                            onChange={(e) => setUserFilter(e.target.value)}
                                            className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">From Date</label>
                                        <input
                                            type="date"
                                            value={dateFromFilter}
                                            onChange={(e) => setDateFromFilter(e.target.value)}
                                            className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">To Date</label>
                                        <input
                                            type="date"
                                            value={dateToFilter}
                                            onChange={(e) => setDateToFilter(e.target.value)}
                                            className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        />
                                    </div>

                                    <div className="flex items-end space-x-2 lg:col-span-5">
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
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
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {isSuperAdmin && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 bg-white dark:bg-gray-700"
                                            />
                                        </th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Activity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Date/Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                        {isSuperAdmin && (
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLogs.includes(log.id)}
                                                    onChange={() => handleSelectLog(log.id)}
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 bg-white dark:bg-gray-700"
                                                />
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white transition-colors duration-200">{log.description}</div>
                                            {log.ip_address && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">IP: {log.ip_address}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white transition-colors duration-200">
                                                {log.causer ? log.causer.name : 'System'}
                                            </div>
                                            {log.causer && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">{log.causer.email}</div>
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
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white transition-colors duration-200">
                                            <div>{new Date(log.created_at).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">{new Date(log.created_at).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={route('activity-logs.show', log.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center transition-colors duration-200"
                                                >
                                                    <EyeIcon className="w-4 h-4 mr-1" />
                                                    View
                                                </Link>
                                                {isSuperAdmin && (
                                                    <button
                                                        onClick={() => handleDeleteSingle(log.id)}
                                                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                                                    >
                                                        <TrashIcon className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
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

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50 transition-colors duration-200">
                    <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-700 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800 transition-colors duration-200">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4 font-heading transition-colors duration-200">
                                Confirm Deletion
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                    {pendingDeletion?.type === 'bulk' 
                                        ? `Are you sure you want to delete ${pendingDeletion.count} selected log(s)? This action cannot be undone.`
                                        : 'Are you sure you want to delete this log? This action cannot be undone.'
                                    }
                                </p>
                            </div>
                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={cancelDeletion}
                                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeletion}
                                    disabled={otpLoading}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-200"
                                >
                                    {otpLoading ? 'Sending OTP...' : 'Proceed'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* OTP Verification Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50 transition-colors duration-200">
                    <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-700 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800 transition-colors duration-200">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900">
                                <CheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4 font-heading transition-colors duration-200">
                                Enter OTP Code
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200">
                                    We've sent a verification code to your email. Please enter it below to confirm the deletion.
                                </p>
                                <input
                                    type="text"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    maxLength="6"
                                    autoComplete="off"
                                />
                                {otpError && (
                                    <p className="text-red-600 dark:text-red-400 text-sm mt-2 transition-colors duration-200">{otpError}</p>
                                )}
                            </div>
                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={cancelDeletion}
                                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={verifyOtpAndDelete}
                                    disabled={verifyLoading || !otpCode.trim()}
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-200"
                                >
                                    {verifyLoading ? 'Verifying...' : 'Verify & Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
}
