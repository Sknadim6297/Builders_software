import { Head, Link } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';

export default function Show({ invoice }) {
    const formatCurrency = (value) => {
        const amount = parseFloat(value || 0);
        return `₹${amount.toFixed(2)}`;
    };

    const lineItems = [
        ...(invoice.service_items || []).map((item) => ({
            id: `service-${item.id}`,
            type: 'Service',
            name: item.service?.name || 'Service',
            description: item.service?.description || '-',
            measurement: '-',
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total
        })),
        ...(invoice.product_items || []).map((item) => ({
            id: `product-${item.id}`,
            type: 'Product',
            name: item.stock?.item_name || 'Product',
            description: item.stock?.item_description || '-',
            measurement: item.stock?.unit || '-',
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total
        }))
    ];

    return (
        <SidebarLayout>
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice {invoice.invoice_number}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Created on {new Date(invoice.invoice_date).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                        <a
                            href={route('billing.download', invoice.id)}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Download Invoice
                        </a>
                        <Link
                            href={route('billing.index')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Back to Billing
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Name</p>
                                    <p className="text-gray-900 dark:text-white">{invoice.customer?.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Customer ID</p>
                                    <p className="text-gray-900 dark:text-white">{invoice.customer?.cust_id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Mobile</p>
                                    <p className="text-gray-900 dark:text-white">{invoice.customer?.mobile_number}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Address</p>
                                    <p className="text-gray-900 dark:text-white">{invoice.customer?.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Invoice Items</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Item</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Description</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Qty</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Unit Price</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Measurement</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {lineItems.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.description}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{parseFloat(item.quantity).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{formatCurrency(item.unit_price)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.measurement}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{formatCurrency(item.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(invoice.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Discount</span>
                                    <span className="text-gray-900 dark:text-white">-{formatCurrency(invoice.discount)}</span>
                                </div>
                                <div className="flex justify-between text-base font-semibold">
                                    <span className="text-gray-900 dark:text-white">Total</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(invoice.total)}</span>
                                </div>
                            </div>
                        </div>
                        {invoice.notes && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notes</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{invoice.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
