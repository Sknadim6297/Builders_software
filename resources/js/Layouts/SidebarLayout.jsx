import { useState, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Header from '../Components/Header/Header';

export default function SidebarLayout({ children }) {
    const { auth, permissions } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const toggleMobileSidebar = () => {
        if (!sidebarOpen) {
            setIsAnimating(true);
            setSidebarOpen(true);
            // Reset animation state after all animations complete
            setTimeout(() => setIsAnimating(false), 600);
        } else {
            setSidebarOpen(false);
        }
    };

    const closeMobileSidebar = () => {
        setSidebarOpen(false);
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
                name: 'Customer Billing',
                href: route('billing.index'),
                icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m-6 4h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 3v4a1 1 0 001 1h4" />
                    </svg>
                ),
                current: route().current('billing.*'),
                permission: null
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
                permission: 'vendors'
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
                name: 'Manage Purchase Bill',
                href: route('purchase-bills.index'),
                icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7l-4 4-2-2" />
                    </svg>
                ),
                current: route().current('purchase-bills.*'),
                permission: 'purchase_bills'
            },
        

            {
                name: 'Stock Management',
                href: route('stocks.index'),
                icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h.01M15 9h.01M9 12h.01M15 12h.01M9 15h.01M15 15h.01" />
                    </svg>
                ),
                current: route().current('stocks.*'),
                permission: 'stock_management'
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
                disabled: true

            }
        ];

        if (auth.user.is_super_admin) {
            return allMenus.filter(menu => !menu.disabled);
        }

        // Otherwise, filter menus based on user permissions and exclude disabled ones
        const userPermissions = permissions || [];
        return allMenus.filter(menu =>
            !menu.disabled && (!menu.permission || userPermissions.some(permission => permission.name === menu.permission))
        );
    }, [auth, permissions]);

    const handleLogout = () => {
        router.post(route('logout'), {}, {
            onBefore: () => {
                // Ensure fresh CSRF token before logout
                const token = document.head.querySelector('meta[name="csrf-token"]');
                if (token && window.axios) {
                    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
                }
            },
            onError: (errors) => {
                // If CSRF error, refresh page and try again
                if (errors && Object.keys(errors).length === 0) {
                    window.location.reload();
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 flex z-40 md:hidden transition-all duration-500 ease-out ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}>
                <div
                    className={`fixed inset-0 bg-gray-600/75 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-500 ease-out transform ${sidebarOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                        }`}
                    onClick={closeMobileSidebar}
                ></div>
                <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl transition-all duration-500 ease-out transform ${sidebarOpen ? 'translate-x-0 scale-100 rotate-0' : '-translate-x-full scale-95 -rotate-1'
                    }`}>

                    {/* Close button with enhanced animations */}
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className={`ml-1 flex items-center justify-center h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 transform hover:scale-125 hover:rotate-180 hover:bg-white/20 ${sidebarOpen ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-75'
                                }`}
                            onClick={closeMobileSidebar}
                            style={{
                                transitionDelay: sidebarOpen ? '300ms' : '0ms',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                            }}
                        >
                            <svg className="h-6 w-6 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto relative">
                        {/* Logo/Brand section with enhanced animations */}
                        <div className={`flex-shrink-0 flex items-center px-4 mb-8 transition-all duration-700 ease-out transform ${sidebarOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-90'
                            }`} style={{ transitionDelay: sidebarOpen ? '200ms' : '0ms' }}>
                            <div className={`h-16 w-16 bg-white rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-xl ${sidebarOpen ? 'animate-pulse' : ''
                                }`} style={{
                                    animation: sidebarOpen ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
                                    boxShadow: '0 10px 30px rgba(164, 125, 181, 0.3)'
                                }}>
                                <img
                                    src="/images/logo.png"
                                    alt="The Skin Studio"
                                    className="h-14 w-14 object-contain rounded-lg"
                                />
                            </div>
                            <div className="ml-3 overflow-hidden">
                                <span className={`text-lg font-bold text-gray-900 dark:text-white font-heading transition-all duration-500 ${sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                    }`} style={{ transitionDelay: sidebarOpen ? '400ms' : '0ms' }}>
                                    The Skin Studio
                                </span>
                                <p className={`text-xs text-gray-600 dark:text-gray-400 transition-all duration-500 ${sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                    }`} style={{ transitionDelay: sidebarOpen ? '500ms' : '0ms' }}>
                                    Billing System
                                </p>
                            </div>
                        </div>

                        {/* Floating particles effect */}
                        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${sidebarOpen ? 'opacity-30' : 'opacity-0'
                            }`}>
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-1 h-1 bg-primary-400 rounded-full animate-ping"
                                    style={{
                                        left: `${20 + i * 15}%`,
                                        top: `${30 + i * 10}%`,
                                        animationDelay: `${i * 0.5}s`,
                                        animationDuration: '3s'
                                    }}
                                />
                            ))}
                        </div>
                        <nav className="mt-5 px-2 space-y-2 relative">
                            {/* Navigation background glow */}
                            <div className={`absolute inset-0 bg-primary-50/20 dark:bg-primary-900/10 rounded-2xl transition-all duration-700 ${sidebarOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                }`} style={{ transitionDelay: sidebarOpen ? '300ms' : '0ms' }}></div>

                            {navigation.map((item, index) => (
                                <div
                                    key={item.name}
                                    className={`relative transition-all duration-600 ease-out transform ${sidebarOpen
                                        ? 'translate-x-0 opacity-100 scale-100'
                                        : '-translate-x-12 opacity-0 scale-90'
                                        }`}
                                    style={{
                                        transitionDelay: sidebarOpen ? `${(index + 2) * 100}ms` : '0ms'
                                    }}
                                >
                                    {/* Menu item glow effect */}
                                    <div className={`absolute inset-0 bg-primary-200/20 dark:bg-primary-600/20 rounded-xl blur-sm transition-all duration-300 ${item.current ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
                                        }`}></div>

                                    <Link
                                        href={item.href}
                                        className={`${item.current
                                            ? 'bg-primary-700 text-white shadow-xl border border-primary-600/30'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-primary-200/50 dark:hover:border-primary-700/50'
                                            } group relative flex items-center px-3 py-3 text-base font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:translate-x-2 overflow-hidden backdrop-blur-sm`}
                                        onClick={closeMobileSidebar}
                                        style={{
                                            boxShadow: item.current
                                                ? '0 8px 32px rgba(164, 125, 181, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                                                : '0 2px 8px rgba(0, 0, 0, 0.05)'
                                        }}
                                    >
                                        {/* Hover ripple effect */}
                                        <div className="absolute inset-0 bg-primary-200/10 dark:bg-primary-600/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>

                                        <div className={`mr-4 flex-shrink-0 transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 relative z-10 ${item.current ? 'text-white drop-shadow-sm' : ''
                                            }`}>
                                            {item.icon}
                                        </div>
                                        <span className="truncate relative z-10 font-medium">{item.name}</span>

                                        {/* Active indicator with animation */}
                                        <div className={`ml-auto relative z-10 transition-all duration-300 transform ${item.current ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 translate-x-4 group-hover:opacity-60 group-hover:scale-100 group-hover:translate-x-0'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full ${item.current
                                                ? 'bg-white shadow-lg animate-pulse'
                                                : 'bg-primary-400 group-hover:bg-primary-500'
                                                }`}></div>
                                        </div>

                                        {/* Shine effect for active items */}
                                        {item.current && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>
                                        )}
                                    </Link>
                                </div>
                            ))}
                        </nav>
                    </div>
                    <div className={`flex-shrink-0 flex border-t border-gray-200/50 dark:border-gray-700/50 p-4 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-700 ease-out transform ${sidebarOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
                        }`} style={{ transitionDelay: sidebarOpen ? '500ms' : '0ms' }}>
                        <div className="flex items-center w-full group">
                            <div className="flex-shrink-0 relative">
                                {/* User avatar with animated border */}
                                <div className="absolute inset-0 bg-primary-600 rounded-full animate-spin-slow opacity-75 blur-sm transition-all duration-500 group-hover:opacity-100 group-hover:blur-none"></div>
                                <div className="h-12 w-12 bg-primary-700 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 relative z-10 border-2 border-white/20">
                                    <span className="text-base font-bold text-white drop-shadow-sm">{auth.user.name.charAt(0)}</span>
                                </div>
                                {/* Online indicator */}
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                            </div>
                            <div className="ml-3 flex-1 min-w-0 overflow-hidden">
                                <p className={`text-sm font-semibold text-gray-700 dark:text-gray-200 truncate transition-all duration-500 transform ${sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                    }`} style={{ transitionDelay: sidebarOpen ? '600ms' : '0ms' }}>
                                    {auth.user.name}
                                </p>
                                <p className={`text-xs text-gray-500 dark:text-gray-400 truncate transition-all duration-500 transform ${sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                    }`} style={{ transitionDelay: sidebarOpen ? '700ms' : '0ms' }}>
                                    {auth.user.email}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={handleLogout}
                                    className={`p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transform hover:scale-110 hover:rotate-12 group relative overflow-hidden ${sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                        }`}
                                    style={{ transitionDelay: sidebarOpen ? '800ms' : '0ms' }}
                                    title="Sign out"
                                >
                                    {/* Logout button hover effect */}
                                    <div className="absolute inset-0 bg-gray-200/20 dark:bg-gray-600/20 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                    <svg className="h-5 w-5 relative z-10 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-200">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4 mb-8">
                            <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-lg p-1">
                                <img
                                    src="/images/logo.png"
                                    alt="The Skin Studio"
                                    className="h-full w-full object-contain rounded-lg"
                                />
                            </div>
                            <div className="ml-3">
                                <span className="text-lg font-bold text-gray-900 dark:text-white font-heading transition-colors duration-200">The Skin Studio</span>
                                <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">Billing System</p>
                            </div>
                        </div>
                        <nav className="flex-1 px-2 space-y-2">
                            {navigation.map((item) => (<Link
                                key={item.name}
                                href={item.href}
                                className={`${item.current
                                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg border-l-4 border-primary-500'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-800 hover:text-gray-900 dark:hover:text-white hover:border-l-4 hover:border-primary-300 dark:hover:border-primary-600'
                                    } group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105`}
                            >
                                <div className="mr-3 flex-shrink-0">{item.icon}</div>
                                <span className="truncate">{item.name}</span>
                            </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
                        <div className="flex items-center w-full">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-sm font-medium text-white">{auth.user.name.charAt(0)}</span>
                                </div>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate transition-colors duration-200">{auth.user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate transition-colors duration-200">{auth.user.email}</p>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
                <main className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    <div className="min-h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
