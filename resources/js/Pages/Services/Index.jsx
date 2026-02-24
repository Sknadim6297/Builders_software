import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { route } from '@/utils/route';
import Pagination from '@/Components/Pagination';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Index({ services, flash, filters }) {
    const [isDeleting, setIsDeleting] = useState(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [fromDate, setFromDate] = useState(filters?.from_date || '');
    const [toDate, setToDate] = useState(filters?.to_date || '');
    const [showFilters, setShowFilters] = useState(false);

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

    const handleSearch = () => {
        router.get(route('services.index'), {
            search: search,
            from_date: fromDate,
            to_date: toDate
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleReset = () => {
        setSearch('');
        setFromDate('');
        setToDate('');
        router.get(route('services.index'), {}, {
            preserveState: true,
            replace: true
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleDelete = (service) => {
        if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
            setIsDeleting(service.id);
            router.delete(route('services.destroy', service.id), {
                onFinish: () => setIsDeleting(null)
            });
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    return (
        <SidebarLayout>
            <Head title="Service Management" />
            
            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Management</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your billing services</p>
                        </div>
                        <Link
                            href={route('services.create')}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Add New Service
                        </Link>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                    <div className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search Input */}
                            <div className="flex-1">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        placeholder="Search services..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <FunnelIcon className="w-4 h-4 mr-2" />
                                Filters
                            </button>

                            {/* Search Button */}
                            <button
                                onClick={handleSearch}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                Search
                            </button>

                            {/* Reset Button */}
                            {(search || fromDate || toDate) && (
                                <button
                                    onClick={handleReset}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                                >
                                    <XMarkIcon className="w-4 h-4 mr-2" />
                                    Reset
                                </button>
                            )}
                        </div>

                        {/* Date Filters */}
                        {showFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            From Date
                                        </label>
                                        <input
                                            type="date"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            To Date
                                        </label>
                                        <input
                                            type="date"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Flash Messages - Now handled by toasts */}
                
                {/* Services Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                    {services.data.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No services found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {(search || fromDate || toDate) ? 'Try adjusting your search criteria.' : 'Get started by creating your first service.'}
                            </p>
                            {!(search || fromDate || toDate) && (
                                <Link
                                    href={route('services.create')}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Add New Service
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            S.No
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Serv ID
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Service Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            GST%
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Final Price
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {services.data.map((service, index) => (
                                        <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {services.from + index}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100">
                                                    {service.serv_id}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {service.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs" title={service.description}>
                                                    {service.description}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                                                {formatPrice(service.price)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {service.gst_percentage ? `${service.gst_percentage}%` : 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
                                                {formatPrice(service.final_price)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <Link
                                                        href={route('services.edit', service.id)}
                                                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                                                    >
                                                        <PencilIcon className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(service)}
                                                        disabled={isDeleting === service.id}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isDeleting === service.id ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Deleting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <TrashIcon className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {services.data.length > 0 && (
                        <Pagination links={services.links} meta={services} />
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}
