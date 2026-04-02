import React, { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { route } from '@/utils/route';

export default function Index({ report, filters }) {
    const [filterType, setFilterType] = useState(filters?.filter_type || 'daily');
    const [reportDate, setReportDate] = useState(filters?.report_date || '');
    const [reportMonth, setReportMonth] = useState(filters?.report_month || '');
    const [fromDate, setFromDate] = useState(filters?.from_date || '');
    const [toDate, setToDate] = useState(filters?.to_date || '');

    const payload = useMemo(() => ({
        filter_type: filterType,
        report_date: filterType === 'daily' ? reportDate : '',
        report_month: filterType === 'monthly' ? reportMonth : '',
        from_date: filterType === 'custom' ? fromDate : '',
        to_date: filterType === 'custom' ? toDate : '',
    }), [filterType, reportDate, reportMonth, fromDate, toDate]);

    const formatCurrency = (value) => {
        const num = Number(value || 0);
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        }).format(num);
    };

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(route('daily-reports.index'), payload, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setFilterType('daily');
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

            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Reports</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Purchase, Sales, Due and Daily Cash tracking
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

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
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

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Report Period: {report?.period?.from || '-'} to {report?.period?.to || '-'}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <p className="text-sm text-gray-500">Total Purchase</p>
                        <p className="text-2xl font-bold text-indigo-600">{formatCurrency(report?.purchase?.total_amount)}</p>
                        <p className="text-xs text-gray-500">Bills: {report?.purchase?.count || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <p className="text-sm text-gray-500">Total Sales</p>
                        <p className="text-2xl font-bold text-emerald-600">{formatCurrency(report?.sales?.total_amount)}</p>
                        <p className="text-xs text-gray-500">Invoices: {report?.sales?.count || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <p className="text-sm text-gray-500">Outstanding Due</p>
                        <p className="text-2xl font-bold text-amber-600">{formatCurrency(report?.due?.total_outstanding)}</p>
                        <p className="text-xs text-gray-500">Due Invoices: {report?.due?.count || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <p className="text-sm text-gray-500">Closing Cash</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(report?.cash?.closing_balance)}</p>
                        <p className="text-xs text-gray-500">Opening: {formatCurrency(report?.cash?.opening_balance)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold">Purchase Report</div>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left">PO No.</th>
                                    <th className="px-4 py-2 text-left">Date</th>
                                    <th className="px-4 py-2 text-left">Supplier</th>
                                    <th className="px-4 py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(report?.purchase?.details || []).length === 0 ? (
                                    <tr><td colSpan="4" className="px-4 py-3 text-center text-gray-500">No purchase records</td></tr>
                                ) : (
                                    report.purchase.details.map((row, idx) => (
                                        <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                            <td className="px-4 py-2">{row.po_number}</td>
                                            <td className="px-4 py-2">{row.po_date}</td>
                                            <td className="px-4 py-2">{row.supplier_name}</td>
                                            <td className="px-4 py-2 text-right">{formatCurrency(row.amount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold">Sales Report</div>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left">Invoice No.</th>
                                    <th className="px-4 py-2 text-left">Date</th>
                                    <th className="px-4 py-2 text-left">Customer</th>
                                    <th className="px-4 py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(report?.sales?.details || []).length === 0 ? (
                                    <tr><td colSpan="4" className="px-4 py-3 text-center text-gray-500">No sales records</td></tr>
                                ) : (
                                    report.sales.details.map((row, idx) => (
                                        <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                            <td className="px-4 py-2">{row.invoice_number}</td>
                                            <td className="px-4 py-2">{row.invoice_date}</td>
                                            <td className="px-4 py-2">{row.customer_name}</td>
                                            <td className="px-4 py-2 text-right">{formatCurrency(row.amount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold">Due Report</div>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left">Invoice No.</th>
                                    <th className="px-4 py-2 text-left">Customer</th>
                                    <th className="px-4 py-2 text-right">Due</th>
                                    <th className="px-4 py-2 text-right">Overdue Days</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(report?.due?.details || []).length === 0 ? (
                                    <tr><td colSpan="4" className="px-4 py-3 text-center text-gray-500">No due records</td></tr>
                                ) : (
                                    report.due.details.map((row, idx) => (
                                        <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                            <td className="px-4 py-2">{row.invoice_number}</td>
                                            <td className="px-4 py-2">{row.customer_name}</td>
                                            <td className="px-4 py-2 text-right">{formatCurrency(row.due_amount)}</td>
                                            <td className="px-4 py-2 text-right">{row.days_overdue}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold">Daily Cash Report</div>
                        <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="text-gray-500">Opening Cash</div>
                            <div className="text-right font-semibold">{formatCurrency(report?.cash?.opening_balance)}</div>
                            <div className="text-gray-500">Cash Received</div>
                            <div className="text-right font-semibold text-green-600">{formatCurrency(report?.cash?.cash_received)}</div>
                            <div className="text-gray-500">Cash Paid</div>
                            <div className="text-right font-semibold text-red-600">{formatCurrency(report?.cash?.cash_paid)}</div>
                            <div className="text-gray-500">Closing Cash</div>
                            <div className="text-right font-semibold text-blue-600">{formatCurrency(report?.cash?.closing_balance)}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold">Supplier-wise Purchase Breakdown</div>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left">Supplier</th>
                                <th className="px-4 py-2 text-right">Bills</th>
                                <th className="px-4 py-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(report?.purchase?.supplier_breakdown || []).length === 0 ? (
                                <tr><td colSpan="3" className="px-4 py-3 text-center text-gray-500">No supplier breakdown data</td></tr>
                            ) : (
                                report.purchase.supplier_breakdown.map((row, idx) => (
                                    <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                        <td className="px-4 py-2">{row.supplier_name}</td>
                                        <td className="px-4 py-2 text-right">{row.count}</td>
                                        <td className="px-4 py-2 text-right">{formatCurrency(row.total_amount)}</td>
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
