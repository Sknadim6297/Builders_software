import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function SettingsIndex(props) {
    const [loading, setLoading] = useState(false);

    const { data, setData, patch, processing, errors, reset } = useForm({
        company_name: props.company_name || 'SAYAN SITA BUILDERS',
        company_address: props.company_address || 'Chalitapara, Ajodhya, Shyampur, Howrah – 711312',
        company_phone_1: props.company_phone_1 || '6289249399',
        company_phone_2: props.company_phone_2 || '9609142692',
        company_phone_3: props.company_phone_3 || '9732771768',
        company_logo: null,
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

    const submitSection = (section) => {
        setLoading(true);

        const payload = section === 'website'
            ? {
                section: 'website',
                company_name: data.company_name,
                company_address: data.company_address,
                company_phone_1: data.company_phone_1,
                company_phone_2: data.company_phone_2,
                company_phone_3: data.company_phone_3,
                company_logo: data.company_logo,
            }
            : {
                section: 'invoice',
                payment_tc: data.payment_tc,
                payment_mode: data.payment_mode,
                godown: data.godown,
                transport: data.transport,
                bank: data.bank,
                account_no: data.account_no,
                ifsc: data.ifsc,
                branch: data.branch,
                account_type: data.account_type,
                invoice_logo: data.invoice_logo,
            };

        transform(() => payload).patch(route('settings.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                window.showSuccess?.('Settings updated successfully!');
                transform((current) => current);
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                window.showError?.('Failed to update settings. Please check the form.');
                setLoading(false);
                transform((current) => current);
            },
        });
    };

    return (
        <SidebarLayout auth={props.auth} errors={props.errors}>
            <Head title="Settings" />

            <div className="px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        System Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage company information, branding, and payment settings
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg max-w-4xl">
                    <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-8">
                        {/* Company Information Section */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Company Information
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                This information will be displayed on the login page and system-wide branding
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.company_name}
                                        onChange={(e) => setData('company_name', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., SAYAN SITA BUILDERS"
                                    />
                                    {errors.company_name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Company Address
                                    </label>
                                    <textarea
                                        value={data.company_address}
                                        onChange={(e) => setData('company_address', e.target.value)}
                                        rows="3"
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Chalitapara, Ajodhya, Shyampur, Howrah – 711312"
                                    />
                                    {errors.company_address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.company_address}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone Number 1
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.company_phone_1}
                                            onChange={(e) => setData('company_phone_1', e.target.value)}
                                            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., 6289249399"
                                        />
                                        {errors.company_phone_1 && (
                                            <p className="text-red-500 text-sm mt-1">{errors.company_phone_1}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone Number 2
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.company_phone_2}
                                            onChange={(e) => setData('company_phone_2', e.target.value)}
                                            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., 9609142692"
                                        />
                                        {errors.company_phone_2 && (
                                            <p className="text-red-500 text-sm mt-1">{errors.company_phone_2}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone Number 3
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.company_phone_3}
                                            onChange={(e) => setData('company_phone_3', e.target.value)}
                                            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., 9732771768"
                                        />
                                        {errors.company_phone_3 && (
                                            <p className="text-red-500 text-sm mt-1">{errors.company_phone_3}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Company Logo
                                    </h3>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Company Logo (Optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('company_logo', e.target.files?.[0] || null)}
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.company_logo && (
                                        <p className="text-red-500 text-sm mt-1">{errors.company_logo}</p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        Upload a company logo to display on the login page and throughout the system. Recommended size: 500x500px
                                    </p>

                                    {props.company_logo_url && !data.company_logo && (
                                        <div className="mt-4 flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3">
                                            <img
                                                src={props.company_logo_url}
                                                alt="Current company logo"
                                                className="h-16 w-16 object-contain rounded-md bg-white p-2 border border-gray-200"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">Current logo preview</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">This logo appears on login page and system-wide.</p>
                                            </div>
                                        </div>
                                    )}

                                    {data.company_logo && data.company_logo instanceof File && (
                                        <div className="mt-4 flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3">
                                            <img
                                                src={URL.createObjectURL(data.company_logo)}
                                                alt="Company logo preview"
                                                className="h-16 w-16 object-contain rounded-md bg-white p-2 border border-gray-200"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">New upload preview</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">This will replace the current logo when you save.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment T&C Section */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Payment Terms & Conditions
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Payment T&C
                                </label>
                                <textarea
                                    value={data.payment_tc}
                                    onChange={(e) => setData('payment_tc', e.target.value)}
                                    rows="8"
                                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter payment terms and conditions..."
                                />
                                {errors.payment_tc && (
                                    <p className="text-red-500 text-sm mt-1">{errors.payment_tc}</p>
                                )}
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Use line breaks to separate different terms. This will be displayed on invoices.
                                </p>
                            </div>
                        </div>

                        {/* Bank Details Section */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Bank Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Payment Mode
                                    </label>
                                    <input
                                        type="text"
                                        value={data.payment_mode}
                                        onChange={(e) => setData('payment_mode', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., CREDIT"
                                    />
                                    {errors.payment_mode && (
                                        <p className="text-red-500 text-sm mt-1">{errors.payment_mode}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Godown
                                    </label>
                                    <input
                                        type="text"
                                        value={data.godown}
                                        onChange={(e) => setData('godown', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., CHALITAPARA"
                                    />
                                    {errors.godown && (
                                        <p className="text-red-500 text-sm mt-1">{errors.godown}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Transport
                                    </label>
                                    <input
                                        type="text"
                                        value={data.transport}
                                        onChange={(e) => setData('transport', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., VAN (SELF)"
                                    />
                                    {errors.transport && (
                                        <p className="text-red-500 text-sm mt-1">{errors.transport}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Bank Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.bank}
                                        onChange={(e) => setData('bank', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Bank name"
                                    />
                                    {errors.bank && (
                                        <p className="text-red-500 text-sm mt-1">{errors.bank}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        value={data.account_no}
                                        onChange={(e) => setData('account_no', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Account number"
                                    />
                                    {errors.account_no && (
                                        <p className="text-red-500 text-sm mt-1">{errors.account_no}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        IFSC Code
                                    </label>
                                    <input
                                        type="text"
                                        value={data.ifsc}
                                        onChange={(e) => setData('ifsc', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="IFSC code"
                                    />
                                    {errors.ifsc && (
                                        <p className="text-red-500 text-sm mt-1">{errors.ifsc}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Branch
                                    </label>
                                    <input
                                        type="text"
                                        value={data.branch}
                                        onChange={(e) => setData('branch', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Branch name"
                                    />
                                    {errors.branch && (
                                        <p className="text-red-500 text-sm mt-1">{errors.branch}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Account Type
                                    </label>
                                    <input
                                        type="text"
                                        value={data.account_type}
                                        onChange={(e) => setData('account_type', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Trade & Forex CURRENT ACCOUNT"
                                    />
                                    {errors.account_type && (
                                        <p className="text-red-500 text-sm mt-1">{errors.account_type}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Invoice Logo
                            </h2>
                            <div className="max-w-2xl">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Invoice Logo (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('invoice_logo', e.target.files?.[0] || null)}
                                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.invoice_logo && (
                                    <p className="text-red-500 text-sm mt-1">{errors.invoice_logo}</p>
                                )}
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Upload a company logo to display in the invoice PDF header. If you leave it empty, the PDF will show text branding only.
                                </p>

                                {props.invoice_logo_url && !data.invoice_logo && (
                                    <div className="mt-4 flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3">
                                        <img
                                            src={props.invoice_logo_url}
                                            alt="Current invoice logo"
                                            className="h-16 w-16 object-contain rounded-md bg-white p-2 border border-gray-200"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Current logo preview</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">This logo appears on customer invoices.</p>
                                        </div>
                                    </div>
                                )}

                                {data.invoice_logo && data.invoice_logo instanceof File && (
                                    <div className="mt-4 flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3">
                                        <img
                                            src={URL.createObjectURL(data.invoice_logo)}
                                            alt="Invoice logo preview"
                                            className="h-16 w-16 object-contain rounded-md bg-white p-2 border border-gray-200"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">New upload preview</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">This will replace the current logo when you save.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-wrap justify-end gap-4">
                            <SecondaryButton
                                type="button"
                                onClick={() => reset()}
                                disabled={loading || processing}
                            >
                                Reset
                            </SecondaryButton>
                            <PrimaryButton
                                type="button"
                                onClick={() => submitSection('website')}
                                disabled={loading || processing}
                            >
                                {loading || processing ? 'Saving...' : 'Save Website Settings'}
                            </PrimaryButton>
                            <PrimaryButton
                                type="button"
                                onClick={() => submitSection('invoice')}
                                disabled={loading || processing}
                            >
                                {loading || processing ? 'Saving...' : 'Save Invoice Settings'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
