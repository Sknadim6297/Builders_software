import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { route } from '@/utils/route';

export default function Index({ invoices, customers, filters, flash }) {
    const [search, setSearch] = useState(filters.search || '');
    const [customerId, setCustomerId] = useState(filters.customer_id || '');
    const [dateFrom, setDateFrom] = useState(filters.invoice_date_from || '');
    const [dateTo, setDateTo] = useState(filters.invoice_date_to || '');

    useEffect(() => {
        if (flash?.success) {
            window.showSuccess(flash.success);
        }
        if (flash?.error) {
            window.showError(flash.error);
        }
    }, [flash]);

    const formatCurrency = (value) => {
        const amount = parseFloat(value || 0);
        return `₹${amount.toFixed(2)}`;
    };

    const getPaymentStatusBadge = (status) => {
        const classes = {
            paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            partial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            unpaid: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        };
        const labels = {
            paid: 'Paid',
            partial: 'Partial',
            unpaid: 'Unpaid'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status] || classes.unpaid}`}>
                {labels[status] || status}
            </span>
        );
    };

    const applyFilters = () => {
        router.get(route('billing.index'), {
            search,
            customer_id: customerId,
            invoice_date_from: dateFrom,
            invoice_date_to: dateTo
        }, { preserveState: true });
    };

    const resetFilters = () => {
        setSearch('');
        setCustomerId('');
        setDateFrom('');
        setDateTo('');
        router.get(route('billing.index'));
    };

    return (
        <SidebarLayout>
            <Head title="Customer Billing" />

            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Billing</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage customer invoices</p>
                    </div>
                    <Link
                        href={route('billing.create')}
                        className="mt-4 md:mt-0 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        Create Invoice
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Invoice or customer"
                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer</label>
                            <select
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                            >
                                <option value="">All</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex space-x-3">
                        <button
                            onClick={applyFilters}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={resetFilters}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {invoices.data?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Invoice</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Total</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Due</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {invoices.data.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{invoice.invoice_number}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{invoice.customer?.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{formatCurrency(invoice.total)}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={invoice.due_amount > 0 ? 'text-orange-600 dark:text-orange-400 font-medium' : 'text-green-600 dark:text-green-400'}>
                                                    {invoice.due_amount > 0 ? formatCurrency(invoice.due_amount) : 'Paid'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">{getPaymentStatusBadge(invoice.payment_status)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end space-x-3">
                                                    <Link
                                                        href={route('billing.show', invoice.id)}
                                                        className="text-primary-600 hover:text-primary-700 text-sm"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={route('billing.edit', invoice.id)}
                                                        className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 text-sm"
                                                    >
                                                        Edit
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400">No invoices found.</p>
                        </div>
                    )}
                </div>

                {invoices?.links && (
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                        <span>Showing {invoices.from || 0} to {invoices.to || 0} of {invoices.total || 0} results</span>
                        <div className="flex space-x-2">
                            {invoices.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 rounded ${link.active ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
