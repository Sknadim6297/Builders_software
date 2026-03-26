import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { route } from '@/utils/route';
import { CalendarIcon } from '@heroicons/react/24/outline';

export default function Index({ gstSummary, outputGSTDetails, inputGSTDetails, filters, flash }) {
    const [showOutputDetails, setShowOutputDetails] = useState(false);
    const [showInputDetails, setShowInputDetails] = useState(false);
    const [fromDate, setFromDate] = useState(filters?.from_date || '');
    const [toDate, setToDate] = useState(filters?.to_date || '');
    const [gstRate, setGstRate] = useState(filters?.gst_rate || '');

    useEffect(() => {
        if (flash?.success) {
            window.showSuccess?.(flash.success);
        }
        if (flash?.error) {
            window.showError?.(flash.error);
        }
    }, [flash]);

    const handleSubmit = (event) => {
        event.preventDefault();

        router.get(route('gst.index'), {
            from_date: fromDate,
            to_date: toDate,
            gst_rate: gstRate,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setFromDate('');
        setToDate('');
        setGstRate('');

        router.get(route('gst.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const formatCurrency = (value) => {
        const num = Number(value || 0);
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);
    };

    return (
        <SidebarLayout>
            <Head title="GST Management" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GST Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">View output/input GST summary and details.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">From Date</label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">To Date</label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GST Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={gstRate}
                                    onChange={(e) => setGstRate(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="flex items-end space-x-2">
                                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">Apply</button>
                                <button type="button" onClick={clearFilters} className="px-4 py-2 border border-gray-300 rounded-lg">Reset</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                        <h2 className="font-medium text-gray-500 dark:text-gray-300">Output GST</h2>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(gstSummary.output_gst)}</p>
                        <button onClick={() => setShowOutputDetails(!showOutputDetails)} className="mt-3 text-sm text-blue-600">{showOutputDetails ? 'Hide' : 'Show'} output details</button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                        <h2 className="font-medium text-gray-500 dark:text-gray-300">Input GST</h2>
                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(gstSummary.input_gst)}</p>
                        <button onClick={() => setShowInputDetails(!showInputDetails)} className="mt-3 text-sm text-red-600">{showInputDetails ? 'Hide' : 'Show'} input details</button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                        <h2 className="font-medium text-gray-500 dark:text-gray-300">Net GST</h2>
                        <p className={gstSummary.status === 'payable' ? 'text-3xl font-bold text-orange-600' : 'text-3xl font-bold text-green-600'}>{formatCurrency(gstSummary.net_gst)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{gstSummary.status === 'payable' ? 'GST Payable' : 'GST Credit'}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CalendarIcon className="w-4 h-4" />
                        Period: {gstSummary.period.from || 'N/A'} - {gstSummary.period.to || 'N/A'}
                    </div>
                </div>

                {showOutputDetails && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto mb-6">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">Invoice</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">Customer</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-300">GST Amount</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-300">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {outputGSTDetails.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No records found</td>
                                    </tr>
                                ) : (
                                    outputGSTDetails.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-3 text-sm text-gray-900 dark:text-gray-100">{item.invoice_number}</td>
                                            <td className="px-6 py-3 text-sm text-gray-900 dark:text-gray-100">{item.invoice_date}</td>
                                            <td className="px-6 py-3 text-sm text-gray-900 dark:text-gray-100">{item.customer_name}</td>
                                            <td className="px-6 py-3 text-sm text-right text-gray-900 dark:text-gray-100">{formatCurrency(item.gst_amount)}</td>
                                            <td className="px-6 py-3 text-sm text-right text-gray-900 dark:text-gray-100">{formatCurrency(item.total_amount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {showInputDetails && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">PO Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">Vendor</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-300">GST Amount</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-300">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {inputGSTDetails.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No records found</td>
                                    </tr>
                                ) : (
                                    inputGSTDetails.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-3 text-sm text-gray-900 dark:text-gray-100">{item.po_number}</td>
                                            <td className="px-6 py-3 text-sm text-gray-900 dark:text-gray-100">{item.po_date}</td>
                                            <td className="px-6 py-3 text-sm text-gray-900 dark:text-gray-100">{item.vendor_name}</td>
                                            <td className="px-6 py-3 text-sm text-right text-gray-900 dark:text-gray-100">{formatCurrency(item.gst_amount)}</td>
                                            <td className="px-6 py-3 text-sm text-right text-gray-900 dark:text-gray-100">{formatCurrency(item.total_amount)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
