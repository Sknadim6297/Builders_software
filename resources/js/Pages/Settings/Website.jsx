import React, { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function WebsiteSettings(props) {
    const [loading, setLoading] = useState(false);
    const [selectedLogoPreview, setSelectedLogoPreview] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddressIndex, setEditingAddressIndex] = useState(null);
    const [editingAddressText, setEditingAddressText] = useState('');
    const [savedAddresses, setSavedAddresses] = useState([]);

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        company_name: props.company_name || 'SAYAN SITA BUILDERS',
        company_address: props.company_address || 'Chalitapara, Ajodhya, Shyampur, Howrah - 711312',
        company_address_2: props.company_address_2 || '',
        company_addresses: props.company_addresses || '',
        company_phone_1: props.company_phone_1 || '6289249399',
        company_phone_2: props.company_phone_2 || '9609142692',
        company_phone_3: props.company_phone_3 || '9732771768',
        company_email: props.company_email || '',
        company_gstin: props.company_gstin || '19DJZPM9953H1ZZ',
        invoice_certification_text: props.invoice_certification_text || '',
        company_logo: null,
    });

    // Initialize saved addresses from the form data (newline-separated)
    useEffect(() => {
        const addressList = data.company_addresses
            .split('\n')
            .map(addr => addr.trim())
            .filter(addr => addr !== '');
        setSavedAddresses(addressList);
    }, []);

    const openAddAddressModal = () => {
        setEditingAddressIndex(null);
        setEditingAddressText('');
        setShowAddressModal(true);
    };

    const openEditAddressModal = (index) => {
        setEditingAddressIndex(index);
        setEditingAddressText(savedAddresses[index]);
        setShowAddressModal(true);
    };

    const handleSaveAddress = () => {
        const trimmedText = editingAddressText.trim();
        if (!trimmedText) {
            window.showError?.('Address cannot be empty');
            return;
        }

        let updatedAddresses = [...savedAddresses];
        if (editingAddressIndex !== null) {
            updatedAddresses[editingAddressIndex] = trimmedText;
        } else {
            updatedAddresses.push(trimmedText);
        }

        setSavedAddresses(updatedAddresses);
        setData('company_addresses', updatedAddresses.join('\n'));
        setShowAddressModal(false);
        window.showSuccess?.(`Address ${editingAddressIndex !== null ? 'updated' : 'added'} successfully!`);
    };

    const handleDeleteAddress = (index) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            const updatedAddresses = savedAddresses.filter((_, i) => i !== index);
            setSavedAddresses(updatedAddresses);
            setData('company_addresses', updatedAddresses.join('\n'));
            window.showSuccess?.('Address deleted successfully!');
        }
    };

    useEffect(() => {
        return () => {
            if (selectedLogoPreview) {
                URL.revokeObjectURL(selectedLogoPreview);
            }
        };
    }, [selectedLogoPreview]);

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0] || null;
        setData('company_logo', file);

        if (selectedLogoPreview) {
            URL.revokeObjectURL(selectedLogoPreview);
        }

        setSelectedLogoPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Use method spoofing so PHP can properly parse multipart file uploads.
        transform((formData) => ({ ...formData, _method: 'patch' }));

        post(route('settings.website.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                window.showSuccess?.('Website settings updated successfully!');
            },
            onError: (formErrors) => {
                console.error('Validation errors:', formErrors);
                window.showError?.('Failed to update website settings.');
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    return (
        <SidebarLayout auth={props.auth} errors={props.errors}>
            <Head title="Website Settings" />

            <div className="px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Website Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage company information and branding shown on login and website screens.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg max-w-4xl">
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                                <input
                                    type="text"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Address</label>
                                <textarea
                                    value={data.company_address}
                                    onChange={(e) => setData('company_address', e.target.value)}
                                    rows="3"
                                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.company_address && <p className="text-red-500 text-sm mt-1">{errors.company_address}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Address 2 (Optional)</label>
                                <textarea
                                    value={data.company_address_2}
                                    onChange={(e) => setData('company_address_2', e.target.value)}
                                    rows="2"
                                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.company_address_2 && <p className="text-red-500 text-sm mt-1">{errors.company_address_2}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Company Addresses</label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    These addresses will appear as options in billing so you can choose one before generating the invoice.
                                </p>

                                {/* Address List */}
                                {savedAddresses.length > 0 ? (
                                    <div className="space-y-3 mb-4">
                                        {savedAddresses.map((address, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                        Address {index + 1}
                                                    </p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed overflow-wrap">
                                                        {address}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditAddressModal(index)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-md transition"
                                                        title="Edit address"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteAddress(index)}
                                                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-md transition"
                                                        title="Delete address"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg mb-4">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            No addresses added yet. Click "Add Address" to get started.
                                        </p>
                                    </div>
                                )}

                                {/* Add Address Button */}
                                <button
                                    type="button"
                                    onClick={openAddAddressModal}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Add Address
                                </button>

                                {errors.company_addresses && (
                                    <p className="text-red-500 text-sm mt-2">{errors.company_addresses}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number 1</label>
                                    <input
                                        type="tel"
                                        value={data.company_phone_1}
                                        onChange={(e) => setData('company_phone_1', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.company_phone_1 && <p className="text-red-500 text-sm mt-1">{errors.company_phone_1}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number 2</label>
                                    <input
                                        type="tel"
                                        value={data.company_phone_2}
                                        onChange={(e) => setData('company_phone_2', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.company_phone_2 && <p className="text-red-500 text-sm mt-1">{errors.company_phone_2}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number 3</label>
                                    <input
                                        type="tel"
                                        value={data.company_phone_3}
                                        onChange={(e) => setData('company_phone_3', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.company_phone_3 && <p className="text-red-500 text-sm mt-1">{errors.company_phone_3}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Email (Optional)</label>
                                <input
                                    type="email"
                                    value={data.company_email}
                                    onChange={(e) => setData('company_email', e.target.value)}
                                    placeholder="company@example.com"
                                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.company_email && <p className="text-red-500 text-sm mt-1">{errors.company_email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GSTIN/UIN</label>
                                <input
                                    type="text"
                                    value={data.company_gstin}
                                    onChange={(e) => setData('company_gstin', e.target.value.toUpperCase())}
                                    placeholder="19DJZPM9953H1ZZ"
                                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.company_gstin && <p className="text-red-500 text-sm mt-1">{errors.company_gstin}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Invoice Certification Text (Optional)</label>
                                <textarea
                                    value={data.invoice_certification_text}
                                    onChange={(e) => setData('invoice_certification_text', e.target.value)}
                                    rows="4"
                                    placeholder="e.g., SUBJECT TO EXCLUSIVE JURISDICTION AT HOWRAH&#10;We hereby certify that the amount indicated in this tax invoice represents the price actually charged by us..."
                                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    This text will appear on all invoices before the signature section. Use this for certification, disclaimers, or legal statements.
                                </p>
                                {errors.invoice_certification_text && <p className="text-red-500 text-sm mt-1">{errors.invoice_certification_text}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Logo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.company_logo && <p className="text-red-500 text-sm mt-1">{errors.company_logo}</p>}

                                {selectedLogoPreview ? (
                                    <div className="mt-4 flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3">
                                        <img src={selectedLogoPreview} alt="Selected company logo" className="h-16 w-16 object-contain rounded-md bg-white p-2 border border-gray-200" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Selected logo preview</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">This is the new logo that will be uploaded when you save.</p>
                                        </div>
                                    </div>
                                ) : props.company_logo_url ? (
                                    <div className="mt-4 flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3">
                                        <img src={props.company_logo_url} alt="Current company logo" className="h-16 w-16 object-contain rounded-md bg-white p-2 border border-gray-200" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Current logo preview</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">This logo appears on login page and system-wide.</p>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <SecondaryButton type="button" onClick={() => { reset(); setSelectedLogoPreview(null); }} disabled={loading || processing}>Reset</SecondaryButton>
                            <PrimaryButton type="submit" disabled={loading || processing}>
                                {loading || processing ? 'Saving...' : 'Save Website Settings'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>

                {/* Add/Edit Address Modal */}
                {showAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        value={editingAddressText}
                                        onChange={(e) => setEditingAddressText(e.target.value)}
                                        rows="4"
                                        placeholder="Enter the complete address..."
                                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                                <SecondaryButton
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                >
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton
                                    type="button"
                                    onClick={handleSaveAddress}
                                >
                                    {editingAddressIndex !== null ? 'Update Address' : 'Add Address'}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}
