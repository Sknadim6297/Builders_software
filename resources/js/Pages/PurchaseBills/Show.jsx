import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '../../Layouts/SidebarLayout';import { route } from '@/utils/route';import { ArrowLeftIcon, PencilIcon, TrashIcon, DocumentIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, purchaseBill }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this purchase bill?')) {
            router.delete(route('purchase-bills.destroy', purchaseBill.id));
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'draft': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
            'sent': 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
            'received': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        return colors[status] || colors.draft;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return (
        <SidebarLayout>
            <Head title={`Purchase Bill ${purchaseBill.po_number}`} />
            
            <div className="py-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={route('purchase-bills.index')}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                                >
                                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                    Back to Purchase Bills
                                </Link>
                                <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
                                        Purchase Bill {purchaseBill.po_number}
                                    </h1>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchaseBill.status)}`}>
                                            {purchaseBill.status_label}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Created {new Date(purchaseBill.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Link
                                    href={route('purchase-bills.edit', purchaseBill.id)}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                                >
                                    <PencilIcon className="w-4 h-4 mr-2" />
                                    Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PO Date</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(purchaseBill.po_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Delivery</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {purchaseBill.expected_delivery ? new Date(purchaseBill.expected_delivery).toLocaleDateString() : 'Not specified'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reference</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{purchaseBill.reference || 'None'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Vendor Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Vendor Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{purchaseBill.vendor?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor Address</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{purchaseBill.vendor_address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Delivery Information</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Address</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{purchaseBill.deliver_address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Items</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sl. No</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">HSN Code</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rate</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Discount %</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Net Rate</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {purchaseBill.items && purchaseBill.items.map((item, index) => {
                                                const quantity = parseFloat(item.quantity) || 0;
                                                const rate = parseFloat(item.unit_price) || 0;
                                                const discountPct = parseFloat(item.discount_percentage) || 0;
                                                const netRate = rate - (rate * discountPct / 100);
                                                const amount = netRate * quantity;
                                                return (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3">{index + 1}</td>
                                                        <td className="px-4 py-3">{item.product || '-'}</td>
                                                        <td className="px-4 py-3">{item.hsn_code || '-'}</td>
                                                        <td className="px-4 py-3">{quantity}</td>
                                                        <td className="px-4 py-3">{item.measurement || '-'}</td>
                                                        <td className="px-4 py-3">{formatCurrency(rate)}</td>
                                                        <td className="px-4 py-3">{discountPct}%</td>
                                                        <td className="px-4 py-3">{formatCurrency(netRate)}</td>
                                                        <td className="px-4 py-3">{formatCurrency(amount)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Terms & Notes */}
                            {(purchaseBill.terms || purchaseBill.notes) && (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Terms & Notes</h2>
                                    <div className="space-y-4">
                                        {purchaseBill.terms && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Terms & Conditions</label>
                                                <p className="text-sm text-gray-900 dark:text-gray-100">{purchaseBill.terms}</p>
                                            </div>
                                        )}
                                        {purchaseBill.notes && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Notes</label>
                                                <p className="text-sm text-gray-900 dark:text-gray-100">{purchaseBill.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Summary */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Summary</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(purchaseBill.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Delivery Charges</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(purchaseBill.delivery_charges)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Discount</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">-{formatCurrency(purchaseBill.discount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">CGST ({purchaseBill.cgst_percentage}%)</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(purchaseBill.cgst_amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">SGST ({purchaseBill.sgst_percentage}%)</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(purchaseBill.sgst_amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">IGST ({purchaseBill.igst_percentage}%)</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(purchaseBill.igst_amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">TCS ({purchaseBill.tcs_percentage}%)</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(purchaseBill.tcs_amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Round Off</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(purchaseBill.round_off)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Gross Amount</span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(purchaseBill.gross_amount)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Net Amount</span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(purchaseBill.net_amount)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Attachments */}
                            {purchaseBill.attachments && purchaseBill.attachments.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Attachments</h2>
                                    <div className="space-y-3">
                                        {purchaseBill.attachments.map((attachment, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <DocumentIcon className="w-5 h-5 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{attachment.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {(attachment.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                                <a
                                                    href={`/storage/${attachment.path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                                                >
                                                    View
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Audit Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Audit Information</h2>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Created By</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{purchaseBill.creator?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Created At</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(purchaseBill.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Updated</label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(purchaseBill.updated_at).toLocaleString()}</p>
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
