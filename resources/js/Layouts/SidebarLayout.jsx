import { useState, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Header from '../Components/Header/Header';

export default function SidebarLayout({ children }) {
    const { auth, permissions } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleMobileSidebar = () => {
        setSidebarOpen(true);
    };

    // Create navigation based on user permissions
    const navigation = useMemo(() => {
        const allMenus = [
            {
                name: 'Dashboard',
                href: route('dashboard'),
                icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14H8V5z" />
                    </svg>
                ),
                current: route().current('dashboard'),
                permission: 'dashboard'
            },
            {
                name: 'Customer Management',
                href: route('customers.index'),
                icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                ),
                current: route().current('customers.*'),
                permission: 'customers',

            },
            {
                name: 'Vendor Management',
                href: route('vendors.index'),
                icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                ),
                current: route().current('vendors.*'),
                permission: 'vendors',
            },
            {
                name: 'Service Management',
                href: route('services.index'),
                icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                ),
                current: route().current('services.*'),
                permission: 'services'
            },
            {
                name: 'Admin User Creation',
                href: route('admin-users.index'),
                icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                ),
                current: route().current('admin-users.*'),
                permission: 'admin_users',
                disabled: true 
            },
            {
                name: 'Log Book of User & Admin Activity',
                href: route('activity-logs.index'),
                icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                ),
                current: route().current('activity-logs.*'),
                permission: 'activity_logs',
                 disabled: true // This menu will be hidden
            }
        ];

        // If user is super admin, show all menus (excluding disabled ones)
        if (auth.user.is_super_admin) {
            return allMenus.filter(menu => !menu.disabled);
        }

        // Otherwise, filter menus based on user permissions and exclude disabled ones
        const userPermissions = permissions || [];
        return allMenus.filter(menu => 
            !menu.disabled && userPermissions.some(permission => permission.name === menu.permission)
        );
    }, [auth, permissions]);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 transition-colors duration-200">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                        <div className="flex-shrink-0 flex items-center px-4">
                            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">Billing System</span>
                        </div>
                        <nav className="mt-5 px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${
                                        item.current
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200`}
                                >
                                    <div className="mr-4">{item.icon}</div>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-white">{auth.user.name.charAt(0)}</span>
                                </div>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{auth.user.name}</p>
                                <div className="flex items-center space-x-3 mt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">Billing System</span>
                        </div>
                        <nav className="mt-8 flex-1 px-2 space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`${
                                        item.current
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    } group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105`}
                                >
                                    <div className="mr-3">{item.icon}</div>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center w-full">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-sm font-medium text-white">{auth.user.name.charAt(0)}</span>
                                </div>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{auth.user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{auth.user.email}</p>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                                    title="Sign out"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="md:pl-64 flex flex-col flex-1">
                <Header onMobileSidebarToggle={toggleMobileSidebar} />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}