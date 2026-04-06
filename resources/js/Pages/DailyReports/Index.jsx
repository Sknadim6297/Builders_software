import React, { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { route } from '@/utils/route';

export default function Index({ report, filters }) {
    const [filterType, setFilterType] = useState(filters?.filter_type || 'daily');
    const [reportType, setReportType] = useState(filters?.report_type || 'all');
    const [reportDate, setReportDate] = useState(filters?.report_date || '');
    const [reportMonth, setReportMonth] = useState(filters?.report_month || '');
    const [fromDate, setFromDate] = useState(filters?.from_date || '');
    const [toDate, setToDate] = useState(filters?.to_date || '');

    const payload = useMemo(() => ({
        filter_type: filterType,
        report_type: reportType,
        report_date: filterType === 'daily' ? reportDate : '',
        report_month: filterType === 'monthly' ? reportMonth : '',
        from_date: filterType === 'custom' ? fromDate : '',
        to_date: filterType === 'custom' ? toDate : '',
    }), [filterType, reportType, reportDate, reportMonth, fromDate, toDate]);

    const formatCurrency = (value) => {
        const num = Number(value || 0);
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        }).format(num);
    };

    const formatPaymentMethodLabel = (value) => {
        switch (String(value || '').toLowerCase()) {
            case 'cash':
                return 'Cash';
            case 'card':
                return 'Card';
            case 'upi':
                return 'UPI';
            case 'bank_transfer':
                return 'Bank Transfer';
            case 'cheque':
                return 'Cheque';
            case 'other':
                return 'Other';
            default:
                return value || '-';
        }
    };

    const periodLabel = report?.period?.from === 'All Time' && report?.period?.to === 'All Time'
        ? 'All Time'
        : `${report?.period?.from || '-'} to ${report?.period?.to || '-'}`;

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(route('daily-reports.index'), payload, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setFilterType('daily');
        setReportType('all');
        setReportDate('');
        setReportMonth('');
        setFromDate('');
        setToDate('');

        router.get(route('daily-reports.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const downloadCsv = () => {
        const query = new URLSearchParams(payload);
        query.set('format', 'csv');
        window.location.href = `${route('daily-reports.export')}?${query.toString()}`;
    };

    return (
        <SidebarLayout>
            <Head title="Daily Reports" />

            <div className="p-6 space-y-6 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Reports</h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                            Purchase, Sales, Due and payment method tracking
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={downloadCsv}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Export CSV
                    </button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter Type</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="daily">Daily</option>
                                <option value="monthly">Monthly</option>
                                <option value="custom">Custom Range</option>
                                <option value="all_time">All Time</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Type</label>
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">All Reports</option>
                                <option value="purchase">Purchase Report</option>
                                <option value="sales">Sales Report</option>
                                <option value="due">Due Report</option>
                                <option value="payments">Payment Report</option>
                            </select>
                        </div>

                        {filterType === 'daily' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                                <input
                                    type="date"
                                    value={reportDate}
                                    onChange={(e) => setReportDate(e.target.value)}
                                    className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        )}

                        {filterType === 'monthly' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Month</label>
                                <input
                                    type="month"
                                    value={reportMonth}
                                    onChange={(e) => setReportMonth(e.target.value)}
                                    className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        )}

                        {filterType === 'custom' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">From Date</label>
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">To Date</label>
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex items-end gap-2 md:col-span-2">
                            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">Apply</button>
                            <button type="button" onClick={resetFilters} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">Reset</button>
                        </div>
                    </form>
                </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                Report Period: {periodLabel}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Purchase</p>
                        <p className="text-2xl font-bold text-indigo-400">{formatCurrency(report?.purchase?.total_amount)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Bills: {report?.purchase?.count || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Sales</p>
                        <p className="text-2xl font-bold text-emerald-400">{formatCurrency(report?.sales?.total_amount)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Invoices: {report?.sales?.count || 0}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Outstanding Due</p>
                        <p className="text-2xl font-bold text-amber-400">{formatCurrency(report?.due?.total_outstanding)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Due Invoices: {report?.due?.count || 0}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Payments</p>
                        <p className="text-2xl font-bold text-blue-400">{formatCurrency(report?.payments?.total_amount)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Payments: {report?.payments?.count || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {(reportType === 'all' || reportType === 'purchase') && (
                    <div className="rounded-lg border border-gray-200 bg-white overflow-x-auto shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900 dark:border-gray-700 dark:text-white">Purchase Report</div>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">PO No.</th>
                                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Date</th>
                                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Supplier</th>
                                    <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-200">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(report?.purchase?.details || []).length === 0 ? (
                                    <tr><td colSpan="4" className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">No purchase records</td></tr>
                                ) : (
                                    report.purchase.details.map((row, idx) => (
                                        <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.po_number}</td>
                                            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.po_date}</td>
                                            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.supplier_name}</td>
                                            <td className="px-4 py-2 text-right text-gray-900 dark:text-white">{formatCurrency(row.amount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    )}

                    {(reportType === 'all' || reportType === 'sales') && (
                    <div className="rounded-lg border border-gray-200 bg-white overflow-x-auto shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900 dark:border-gray-700 dark:text-white">Sales Report</div>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Invoice No.</th>
                                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Date</th>
                                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Customer</th>
                                    <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-200">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(report?.sales?.details || []).length === 0 ? (
                                    <tr><td colSpan="4" className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">No sales records</td></tr>
                                ) : (
                                    report.sales.details.map((row, idx) => (
                                        <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.invoice_number}</td>
                                            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.invoice_date}</td>
                                            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.customer_name}</td>
                                            <td className="px-4 py-2 text-right text-gray-900 dark:text-white">{formatCurrency(row.amount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    )}

                    {(reportType === 'all' || reportType === 'due') && (
                    <div className="rounded-lg border border-gray-200 bg-white overflow-x-auto shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900 dark:border-gray-700 dark:text-white">Due Report</div>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Invoice No.</th>
                                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Customer</th>
                                    <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-200">Due</th>
                                    <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-200">Overdue Days</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(report?.due?.details || []).length === 0 ? (
                                    <tr><td colSpan="4" className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">No due records</td></tr>
                                ) : (
                                    report.due.details.map((row, idx) => (
                                        <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.invoice_number}</td>
                                            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.customer_name}</td>
                                            <td className="px-4 py-2 text-right text-gray-900 dark:text-white">{formatCurrency(row.due_amount)}</td>
                                            <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-200">{row.days_overdue}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    )}

                    {(reportType === 'all' || reportType === 'payments') && (
                    <div className="rounded-lg border border-gray-200 bg-white overflow-x-auto shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900 dark:border-gray-700 dark:text-white">Payment Method Report</div>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Method</th>
                                    <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-200">Payments</th>
                                    <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-200">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(report?.payments?.method_breakdown || []).length === 0 ? (
                                    <tr><td colSpan="3" className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">No payment records</td></tr>
                                ) : (
                                    report.payments.method_breakdown.map((row, idx) => (
                                        <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                            <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{formatPaymentMethodLabel(row.payment_method_label || row.payment_method)}</td>
                                            <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-200">{row.count}</td>
                                            <td className="px-4 py-2 text-right text-gray-900 dark:text-white">{formatCurrency(row.total_amount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white overflow-x-auto shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900 dark:border-gray-700 dark:text-white">Payment Details</div>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Payment No.</th>
                                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Date</th>
                                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Invoice</th>
                                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Customer</th>
                                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Method</th>
                                <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-200">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(report?.payments?.details || []).length === 0 ? (
                                <tr><td colSpan="6" className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">No payment records</td></tr>
                            ) : (
                                report.payments.details.map((row, idx) => (
                                    <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                        <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.payment_number}</td>
                                        <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.payment_date}</td>
                                        <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.invoice_number}</td>
                                        <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.customer_name}</td>
                                        <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{formatPaymentMethodLabel(row.payment_method_label || row.payment_method)}</td>
                                        <td className="px-4 py-2 text-right text-gray-900 dark:text-white">{formatCurrency(row.amount)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white overflow-x-auto shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900 dark:border-gray-700 dark:text-white">Supplier-wise Purchase Breakdown</div>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Supplier</th>
                                <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-200">Bills</th>
                                <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-200">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(report?.purchase?.supplier_breakdown || []).length === 0 ? (
                                <tr><td colSpan="3" className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">No supplier breakdown data</td></tr>
                            ) : (
                                report.purchase.supplier_breakdown.map((row, idx) => (
                                    <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                        <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{row.supplier_name}</td>
                                        <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-200">{row.count}</td>
                                        <td className="px-4 py-2 text-right text-gray-900 dark:text-white">{formatCurrency(row.total_amount)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SidebarLayout>
    );
}
