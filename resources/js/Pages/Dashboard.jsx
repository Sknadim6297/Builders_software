import { useMemo, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    // Memoized stats data for better performance
    const stats = useMemo(() => [
        {
            id: 'today-revenue',
            name: 'Today Revenue Generated',
            value: '₹2,850',
            icon: (
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            change: '+18%',
            changeType: 'increase',
            bgGradient: 'from-green-500 to-emerald-600',
            description: 'vs yesterday'
        },
        {
            id: 'today-services',
            name: 'Today Service Done',
            value: '12',
            icon: (
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            change: '+3',
            changeType: 'increase',
            bgGradient: 'from-blue-500 to-cyan-600',
            description: 'services completed'
        },
        {
            id: 'today-purchases',
            name: 'Today Purchase',
            value: '8',
            icon: (
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
            ),
            change: '+2',
            changeType: 'increase',
            bgGradient: 'from-purple-500 to-violet-600',
            description: 'new purchases'
        },
        {
            id: 'total-customers',
            name: 'No. of Customer',
            value: '184',
            icon: (
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
            ),
            change: '+5',
            changeType: 'increase',
            bgGradient: 'from-orange-500 to-red-500',
            description: 'total registered'
        }
    ], []);



    // Memoized recent activities data
    const recentActivities = useMemo(() => [
        { 
            id: 1, 
            action: 'Revenue generated', 
            detail: 'Payment received - ₹450', 
            time: '15 minutes ago', 
            type: 'payment',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        { 
            id: 2, 
            action: 'Service completed', 
            detail: 'Website Development - ClientXYZ', 
            time: '32 minutes ago', 
            type: 'create',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        { 
            id: 3, 
            action: 'New purchase', 
            detail: 'SEO Package - ₹200', 
            time: '1 hour ago', 
            type: 'purchase',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
            )
        },
        { 
            id: 4, 
            action: 'Customer registered', 
            detail: 'Sarah Johnson - New Account', 
            time: '2 hours ago', 
            type: 'customer',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        { 
            id: 5, 
            action: 'Service invoice created', 
            detail: 'INV-2025-007 - ₹850', 
            time: '3 hours ago', 
            type: 'invoice',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
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
                bg: 'bg-green-100 dark:bg-green-900/20',
                text: 'text-green-600 dark:text-green-400'
            },
            purchase: {
                bg: 'bg-purple-100 dark:bg-purple-900/20',
                text: 'text-purple-600 dark:text-purple-400'
            },
            customer: {
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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Today's performance overview and real-time statistics</p>
                        </div>
                        <div className="hidden sm:flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                Live Data
                            </div>
                            <div className="text-gray-300 dark:text-gray-600">•</div>
                            <div>Last updated: Just now</div>
                        </div>
                    </div>
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
                                            {stat.description}
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

                {/* Recent Activities - Full Width */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Today's business activities and transactions</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                Live Updates
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {recentActivities.map((activity) => {
                            const typeStyles = getActivityTypeStyles(activity.type);
                            return (
                                <div key={activity.id} className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md group">
                                    <div className={`flex-shrink-0 p-2 ${typeStyles.bg} rounded-lg mr-4 group-hover:scale-110 transition-transform duration-200`}>
                                        <div className={typeStyles.text}>
                                            {activity.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                            {activity.action}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
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
                    
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {recentActivities.length} recent activities from today
                            </div>
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 flex items-center font-medium">
                                <span>View all activities</span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}