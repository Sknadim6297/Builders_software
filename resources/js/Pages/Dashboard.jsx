import { useMemo, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    // Memoized stats data for better performance
    const stats = useMemo(() => [
        {
            id: 'total-services',
            name: 'Total Services',
            value: '24',
            icon: (
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            change: '+12%',
            changeType: 'increase',
            bgGradient: 'from-blue-500 to-blue-600'
        },
        {
            id: 'active-customers',
            name: 'Active Customers',
            value: '156',
            icon: (
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
            ),
            change: '+8%',
            changeType: 'increase',
            bgGradient: 'from-green-500 to-green-600'
        },
        {
            id: 'registered-vendors',
            name: 'Registered Vendors',
            value: '42',
            icon: (
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            change: '+3%',
            changeType: 'increase',
            bgGradient: 'from-purple-500 to-purple-600'
        },
        {
            id: 'monthly-revenue',
            name: 'Monthly Revenue',
            value: '$12,450',
            icon: (
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            change: '+15%',
            changeType: 'increase',
            bgGradient: 'from-orange-500 to-orange-600'
        }
    ], []);

    // Memoized quick actions data
    const quickActions = useMemo(() => [
        {
            id: 'add-service',
            title: 'Add New Service',
            description: 'Create a new billing service',
            href: route('services.create'),
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
            bgGradient: 'from-blue-600 to-purple-600',
            hoverGradient: 'hover:from-blue-700 hover:to-purple-700'
        },
        {
            id: 'manage-services',
            title: 'Manage Services',
            description: 'View and edit existing services',
            href: route('services.index'),
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            bgGradient: 'from-green-600 to-teal-600',
            hoverGradient: 'hover:from-green-700 hover:to-teal-700'
        },
        {
            id: 'test-success',
            title: 'Test Success Toast',
            description: 'Demo success notification',
            action: () => window.showSuccess('🎉 Success! Dashboard action completed successfully!'),
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgGradient: 'from-emerald-600 to-green-600',
            hoverGradient: 'hover:from-emerald-700 hover:to-green-700'
        },
        {
            id: 'test-info',
            title: 'Test Info Toast',
            description: 'Demo information notification',
            action: () => window.showInfo('ℹ️ Info: Dashboard features are now fully optimized!'),
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgGradient: 'from-cyan-600 to-blue-600',
            hoverGradient: 'hover:from-cyan-700 hover:to-blue-700'
        }
    ], []);

    // Memoized recent activities data
    const recentActivities = useMemo(() => [
        { 
            id: 1, 
            action: 'New service created', 
            detail: 'Web Development Package', 
            time: '2 hours ago', 
            type: 'create',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            )
        },
        { 
            id: 2, 
            action: 'Customer profile updated', 
            detail: 'John Doe - Contact info', 
            time: '4 hours ago', 
            type: 'update',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            )
        },
        { 
            id: 3, 
            action: 'Invoice generated', 
            detail: 'INV-2025-001 - $1,200', 
            time: '6 hours ago', 
            type: 'invoice',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            )
        },
        { 
            id: 4, 
            action: 'Payment received', 
            detail: 'Client ABC Corp - $850', 
            time: '8 hours ago', 
            type: 'payment',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        { 
            id: 5, 
            action: 'Vendor registration', 
            detail: 'Tech Solutions Ltd', 
            time: '1 day ago', 
            type: 'vendor',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        }
    ], []);

    // Optimized event handlers with useCallback
    const handleQuickAction = useCallback((action) => {
        if (action.href) {
            // Navigation handled by Link component
            return;
        }
        if (action.action && typeof action.action === 'function') {
            action.action();
        }
    }, []);

    // Activity type styles helper
    const getActivityTypeStyles = useCallback((type) => {
        const styles = {
            create: {
                bg: 'bg-green-100 dark:bg-green-900/20',
                text: 'text-green-600 dark:text-green-400'
            },
            update: {
                bg: 'bg-blue-100 dark:bg-blue-900/20',
                text: 'text-blue-600 dark:text-blue-400'
            },
            invoice: {
                bg: 'bg-purple-100 dark:bg-purple-900/20',
                text: 'text-purple-600 dark:text-purple-400'
            },
            payment: {
                bg: 'bg-orange-100 dark:bg-orange-900/20',
                text: 'text-orange-600 dark:text-orange-400'
            },
            vendor: {
                bg: 'bg-indigo-100 dark:bg-indigo-900/20',
                text: 'text-indigo-600 dark:text-indigo-400'
            }
        };
        return styles[type] || styles.create;
    }, []);

    return (
        <SidebarLayout>
            <Head title="Dashboard" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome to your billing system dashboard</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                        <div 
                            key={stat.id} 
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        {stat.name}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {stat.value}
                                    </p>
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            <svg 
                                                className={`w-4 h-4 mr-1 ${
                                                    stat.changeType === 'increase' 
                                                        ? 'text-green-500 dark:text-green-400' 
                                                        : 'text-red-500 dark:text-red-400'
                                                }`} 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth="2" 
                                                    d={stat.changeType === 'increase' ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
                                                />
                                            </svg>
                                            <span className={`text-sm font-semibold ${
                                                stat.changeType === 'increase' 
                                                    ? 'text-green-600 dark:text-green-400' 
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {stat.change}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                            vs last month
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                    <div className={`p-3 bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {quickActions.map((action) => (
                                action.href ? (
                                    <Link
                                        key={action.id}
                                        href={action.href}
                                        className={`group p-4 bg-gradient-to-r ${action.bgGradient} ${action.hoverGradient} rounded-xl text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                                                <p className="text-sm text-white/80">{action.description}</p>
                                            </div>
                                            <div className="ml-3 p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-200">
                                                {action.icon}
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <button
                                        key={action.id}
                                        onClick={() => handleQuickAction(action)}
                                        className={`group p-4 bg-gradient-to-r ${action.bgGradient} ${action.hoverGradient} rounded-xl text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 focus:ring-blue-500`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 text-left">
                                                <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                                                <p className="text-sm text-white/80">{action.description}</p>
                                            </div>
                                            <div className="ml-3 p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-200">
                                                {action.icon}
                                            </div>
                                        </div>
                                    </button>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => {
                                const typeStyles = getActivityTypeStyles(activity.type);
                                return (
                                    <div key={activity.id} className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                        <div className={`flex-shrink-0 p-2 ${typeStyles.bg} rounded-lg mr-4`}>
                                            <div className={typeStyles.text}>
                                                {activity.icon}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                {activity.action}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                {activity.detail}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center justify-center">
                                <span>View all activities</span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Overview</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monthly revenue trends and analytics</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="month">This Month</option>
                                <option value="quarter">This Quarter</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="relative h-72 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Advanced Analytics Coming Soon
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                Interactive charts and detailed revenue analytics will be available in the next update. 
                                Track your billing performance with advanced visualizations.
                            </p>
                            <div className="mt-6 flex items-center justify-center space-x-4">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                    Revenue Trends
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    Payment Analytics
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                    Service Performance
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
