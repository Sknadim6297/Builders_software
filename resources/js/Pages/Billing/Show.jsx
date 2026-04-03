import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { route } from '@/utils/route';
import { useState, useEffect } from 'react';

export default function Show({ invoice, flash }) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        transaction_reference: '',
        notes: ''
    });

    useEffect(() => {
        if (flash?.success) {
            window.showSuccess(flash.success);
            setShowPaymentModal(false);
            reset();
        }
        if (flash?.error) {
            window.showError(flash.error);
        }
    }, [flash]);

    const formatCurrency = (value) => {
        const amount = parseFloat(value || 0);
        return `₹${amount.toFixed(2)}`;
    };

    const handleAddPayment = (e) => {
        e.preventDefault();
        post(route('billing.payments.add', invoice.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowPaymentModal(false);
                reset();
            }
        });
    };

    const getPaymentStatusBadge = () => {
        const status = invoice.payment_status;
        const classes = {
            paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            partial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            unpaid: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        };
        const labels = {
            paid: 'Paid',
            partial: 'Partial Payment',
            unpaid: 'Unpaid'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${classes[status] || classes.unpaid}`}>
                {labels[status] || status}
            </span>
        );
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
            category: item.category?.name || item.stock?.item?.category?.name || '-',
            description: item.stock?.item_description || '-',
            measurement: item.stock?.unit || '-',
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount_percentage: item.discount_percentage || 0,
            discount_amount: item.discount_amount || 0,
            total: item.total
        }))
    ];

    return (
        <SidebarLayout>
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice {invoice.invoice_number}</h1>
                            {getPaymentStatusBadge()}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Created on {new Date(invoice.invoice_date).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                        {invoice.payment_status !== 'paid' && (
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                Add Payment
                            </button>
                        )}
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
                                {invoice.buyer_logo && (
                                    <div>
                                        <p className="text-gray-500">Buyer Logo</p>
                                        <img src={`/storage/${invoice.buyer_logo}`} alt="Buyer Logo" className="h-16 mt-1 object-contain" />
                                    </div>
                                )}
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
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Category</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Description</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Qty</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Unit Price</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Discount</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Measurement</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {lineItems.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.category}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.description}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{parseFloat(item.quantity).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{formatCurrency(item.unit_price)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{parseFloat(item.discount_percentage || 0).toFixed(2)}% / -{formatCurrency(item.discount_amount || 0)}</td>
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
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(invoice.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">C G.S.T ({parseFloat(invoice.cgst_percentage || 0).toFixed(2)}%)</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency((parseFloat(invoice.subtotal || 0) * (parseFloat(invoice.cgst_percentage || 0) || 0)) / 100)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">S G.S.T ({parseFloat(invoice.sgst_percentage || 0).toFixed(2)}%)</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency((parseFloat(invoice.subtotal || 0) * (parseFloat(invoice.sgst_percentage || 0) || 0)) / 100)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Total GST ({parseFloat(invoice.gst_percentage || ((parseFloat(invoice.cgst_percentage || 0)+parseFloat(invoice.sgst_percentage || 0))) ).toFixed(2)}%)</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency((parseFloat(invoice.subtotal || 0) * (parseFloat(invoice.gst_percentage || ((parseFloat(invoice.cgst_percentage || 0)+parseFloat(invoice.sgst_percentage || 0))) ) || 0)) / 100)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Discount ({parseFloat(invoice.invoice_discount_percent || 0).toFixed(2)}%)</span>
                                    <span className="text-gray-900 dark:text-white">-{formatCurrency(invoice.discount)}</span>
                                </div>
                                <div className="flex justify-between text-base font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                                    <span className="text-gray-900 dark:text-white">Total Amount</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(invoice.total)}</span>
                                </div>
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <span className="font-medium">Amount Paid</span>
                                    <span className="font-semibold">{formatCurrency(invoice.amount_paid)}</span>
                                </div>
                                <div className={`flex justify-between text-base font-bold border-t border-gray-200 dark:border-gray-700 pt-2 ${
                                    invoice.due_amount > 0 
                                        ? 'text-orange-600 dark:text-orange-400' 
                                        : 'text-green-600 dark:text-green-400'
                                }`}>
                                    <span>Due Amount</span>
                                    <span>{invoice.due_amount > 0 ? formatCurrency(invoice.due_amount) : 'No Pending'}</span>
                                </div>
                            </div>
                        </div>

                        {invoice.payments && invoice.payments.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment History</h2>
                                <div className="space-y-3">
                                    {invoice.payments.map((payment) => (
                                        <div key={payment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {payment.payment_number}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {new Date(payment.payment_date).toLocaleDateString()} • {payment.payment_method.replace('_', ' ').toUpperCase()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                        {formatCurrency(payment.amount)}
                                                    </p>
                                                    <a
                                                        href={route('payments.receipt', payment.id)}
                                                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                                                    >
                                                        Download Receipt
                                                    </a>
                                                </div>
                                            </div>
                                            {payment.transaction_reference && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Ref: {payment.transaction_reference}
                                                </p>
                                            )}
                                            {payment.notes && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {payment.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {invoice.notes && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notes</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{invoice.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Modal */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Payment</h2>
                            <form onSubmit={handleAddPayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Payment Amount <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0.01"
                                        max={invoice.due_amount}
                                        step="0.01"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                        placeholder="0.00"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Due amount: {formatCurrency(invoice.due_amount)}</p>
                                    {errors.amount && <div className="text-red-600 text-sm mt-1">{errors.amount}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Payment Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.payment_date}
                                        onChange={(e) => setData('payment_date', e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                        required
                                    />
                                    {errors.payment_date && <div className="text-red-600 text-sm mt-1">{errors.payment_date}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Payment Method <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                        required
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="card">Card</option>
                                        <option value="upi">UPI</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="cheque">Cheque</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Transaction Reference
                                    </label>
                                    <input
                                        type="text"
                                        value={data.transaction_reference}
                                        onChange={(e) => setData('transaction_reference', e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                        placeholder="Transaction ID, Cheque No, etc."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                        placeholder="Additional payment notes..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPaymentModal(false);
                                            reset();
                                        }}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Add Payment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
