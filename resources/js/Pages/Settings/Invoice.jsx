import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function InvoiceSettings(props) {
    const [loading, setLoading] = useState(false);

    const { data, setData, patch, processing, errors, reset } = useForm({
        payment_tc: props.payment_tc || '',
        payment_mode: props.payment_mode || 'CREDIT',
        godown: props.godown || 'CHALITAPARA',
        transport: props.transport || 'VAN (SELF)',
        bank: props.bank || 'Development Bank of Singapore',
        account_no: props.account_no || '8828210000007429',
        ifsc: props.ifsc || 'DBSS0IN0828',
        branch: props.branch || 'KOLKATA MAIN BRANCH',
        account_type: props.account_type || 'Trade & Forex CURRENT ACCOUNT',
        invoice_logo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        patch(route('settings.invoice.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                window.showSuccess?.('Invoice settings updated successfully!');
            },
            onError: (formErrors) => {
                console.error('Validation errors:', formErrors);
                window.showError?.('Failed to update invoice settings.');
                setLoading(false);
            },
        });
    };

    return (
        <SidebarLayout auth={props.auth} errors={props.errors}>
            <Head title="Invoice Settings" />

            <div className="px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage payment terms, bank details, and invoice branding.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg max-w-4xl">
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Terms & Conditions</h2>
                            <textarea
                                value={data.payment_tc}
                                onChange={(e) => setData('payment_tc', e.target.value)}
                                rows="8"
                                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.payment_tc && <p className="text-red-500 text-sm mt-1">{errors.payment_tc}</p>}
                        </div>

                        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bank Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Mode</label>
                                    <input type="text" value={data.payment_mode} onChange={(e) => setData('payment_mode', e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {errors.payment_mode && <p className="text-red-500 text-sm mt-1">{errors.payment_mode}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Godown</label>
                                    <input type="text" value={data.godown} onChange={(e) => setData('godown', e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {errors.godown && <p className="text-red-500 text-sm mt-1">{errors.godown}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transport</label>
                                    <input type="text" value={data.transport} onChange={(e) => setData('transport', e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {errors.transport && <p className="text-red-500 text-sm mt-1">{errors.transport}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bank Name</label>
                                    <input type="text" value={data.bank} onChange={(e) => setData('bank', e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {errors.bank && <p className="text-red-500 text-sm mt-1">{errors.bank}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Number</label>
                                    <input type="text" value={data.account_no} onChange={(e) => setData('account_no', e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {errors.account_no && <p className="text-red-500 text-sm mt-1">{errors.account_no}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">IFSC</label>
                                    <input type="text" value={data.ifsc} onChange={(e) => setData('ifsc', e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {errors.ifsc && <p className="text-red-500 text-sm mt-1">{errors.ifsc}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Branch</label>
                                    <input type="text" value={data.branch} onChange={(e) => setData('branch', e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Type</label>
                                    <input type="text" value={data.account_type} onChange={(e) => setData('account_type', e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {errors.account_type && <p className="text-red-500 text-sm mt-1">{errors.account_type}</p>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Invoice Logo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('invoice_logo', e.target.files?.[0] || null)}
                                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.invoice_logo && <p className="text-red-500 text-sm mt-1">{errors.invoice_logo}</p>}

                            {props.invoice_logo_url && !data.invoice_logo && (
                                <div className="mt-4 flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3">
                                    <img src={props.invoice_logo_url} alt="Current invoice logo" className="h-16 w-16 object-contain rounded-md bg-white p-2 border border-gray-200" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Current logo preview</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">This logo appears on invoice PDF.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-4">
                            <SecondaryButton type="button" onClick={() => reset()} disabled={loading || processing}>Reset</SecondaryButton>
                            <PrimaryButton type="submit" disabled={loading || processing}>
                                {loading || processing ? 'Saving...' : 'Save Invoice Settings'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
