import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { route } from '@/utils/route';

export default function Edit({ auth, purchaseBill, vendors, customers, flash }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        po_date: purchaseBill.po_date,
        vendor_id: purchaseBill.vendor_id,
        vendor_address: purchaseBill.vendor_address,
        deliver_address: purchaseBill.deliver_address,
        expected_delivery: purchaseBill.expected_delivery,
        attachments: [],
        items: (purchaseBill.items || []).map(item => ({
            product: item.product || '',
            description: item.description || '',
            hsn_code: item.hsn_code || '',
            quantity: parseFloat(item.quantity) || 0,
            unit_price: parseFloat(item.unit_price) || 0,
            measurement: item.measurement || 'pcs',
            discount_percentage: parseFloat(item.discount_percentage) || 0,
            net_rate: parseFloat(item.net_rate) || 0,
            amount: parseFloat(item.amount) || 0
        })),
        subtotal: parseFloat(purchaseBill.subtotal) || 0,
        delivery_charges: parseFloat(purchaseBill.delivery_charges) || 0,
        gst_type: purchaseBill.gst_type || 'intra',
        cgst_percentage: parseFloat(purchaseBill.cgst_percentage) || 0,
        sgst_percentage: parseFloat(purchaseBill.sgst_percentage) || 0,
        igst_percentage: parseFloat(purchaseBill.igst_percentage) || 0,
        tcs_percentage: parseFloat(purchaseBill.tcs_percentage) || 0,
        round_off: parseFloat(purchaseBill.round_off) || 0,
        gross_amount: parseFloat(purchaseBill.gross_amount) || 0,
        discount: parseFloat(purchaseBill.discount) || 0,
        tax: parseFloat(purchaseBill.tax) || 0,
        total: parseFloat(purchaseBill.total) || 0,
        net_amount: parseFloat(purchaseBill.net_amount) || 0,
        terms: purchaseBill.terms || '',
        notes: purchaseBill.notes || '',
        reference: purchaseBill.reference || '',
        status: purchaseBill.status
    });

    const [selectedVendor, setSelectedVendor] = useState(
        vendors.find(v => v.id === purchaseBill.vendor_id) || null
    );
    const [fileList, setFileList] = useState([]);

    const measurementUnits = ['kg', 'g', 'l', 'ml', 'pcs', 'box', 'pack', 'meter', 'feet'];

    const statusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'received', label: 'Received' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    // Show flash messages as toasts
    useEffect(() => {
        if (flash?.success) {
            window.showSuccess(flash.success);
        }
        if (flash?.error) {
            window.showError(flash.error);
        }
    }, [flash]);

    // Handle vendor selection
    const handleVendorChange = (vendorId) => {
        const vendor = vendors.find(v => v.id === parseInt(vendorId));
        setSelectedVendor(vendor);
        setData(prevData => ({
            ...prevData,
            vendor_id: vendorId,
            vendor_address: vendor ? vendor.address || '' : ''
        }));
    };

    // Handle file upload
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFileList(files);
        setData('attachments', files);
    };

    // Add new item row
    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                product: '',
                description: '',
                hsn_code: '',
                quantity: 0,
                unit_price: 0,
                measurement: 'pcs',
                discount_percentage: 0,
                net_rate: 0,
                amount: 0
            }
        ]);
    };

    // Remove item row
    const removeItem = (index) => {
        if (data.items.length > 1) {
            const newItems = data.items.filter((_, i) => i !== index);
            setData('items', newItems);
        }
    };

    // Update item field
    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;

        const quantity = parseFloat(newItems[index].quantity) || 0;
        const rate = parseFloat(newItems[index].unit_price) || 0;
        const discountPct = parseFloat(newItems[index].discount_percentage) || 0;

        const netRate = rate - (rate * discountPct / 100);
        const amount = netRate * quantity;

        newItems[index].net_rate = Number(netRate.toFixed(2));
        newItems[index].amount = Number(amount.toFixed(2));

        setData('items', newItems);
    };

    // Calculate totals
    useEffect(() => {
        const subtotal = data.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        const deliveryCharges = parseFloat(data.delivery_charges) || 0;
        const gstType = data.gst_type || 'intra';
        const cgstPct = parseFloat(data.cgst_percentage) || 0;
        const sgstPct = parseFloat(data.sgst_percentage) || 0;
        const igstPct = parseFloat(data.igst_percentage) || 0;
        const tcsPct = parseFloat(data.tcs_percentage) || 0;
        const roundOff = parseFloat(data.round_off) || 0;
        const discount = parseFloat(data.discount) || 0;

        const baseAmount = subtotal + deliveryCharges;

        let cgstAmount = 0;
        let sgstAmount = 0;
        let igstAmount = 0;

        if (gstType === 'intra') {
            cgstAmount = (baseAmount * cgstPct) / 100;
            sgstAmount = (baseAmount * sgstPct) / 100;
        } else {
            igstAmount = (baseAmount * igstPct) / 100;
        }

        const gstAmount = cgstAmount + sgstAmount + igstAmount;
        const tcsAmount = ((baseAmount + gstAmount) * tcsPct) / 100;
        const grossAmount = baseAmount;
        const netAmount = Number((grossAmount + gstAmount + tcsAmount + roundOff - discount).toFixed(2));

        setData(prevData => ({
            ...prevData,
            subtotal: subtotal.toFixed(2),
            gross_amount: grossAmount.toFixed(2),
            cgst_amount: cgstAmount.toFixed(2),
            sgst_amount: sgstAmount.toFixed(2),
            igst_amount: igstAmount.toFixed(2),
            tcs_amount: tcsAmount.toFixed(2),
            total: netAmount.toFixed(2),
            net_amount: netAmount.toFixed(2)
        }));
    }, [data.items, data.delivery_charges, data.gst_type, data.cgst_percentage, data.sgst_percentage, data.igst_percentage, data.tcs_percentage, data.round_off, data.discount]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Prepare data for submission
        const submitData = {
            ...data,
            items: JSON.stringify(data.items.map(item => ({
                ...item,
                quantity: parseFloat(item.quantity) || 0,
                unit_price: parseFloat(item.unit_price) || 0,
                discount_percentage: parseFloat(item.discount_percentage) || 0,
                net_rate: parseFloat(item.net_rate) || 0,
                amount: parseFloat(item.amount) || 0
            }))),
            subtotal: parseFloat(data.subtotal) || 0,
            delivery_charges: parseFloat(data.delivery_charges) || 0,
            gst_type: data.gst_type || 'intra',
            cgst_percentage: parseFloat(data.cgst_percentage) || 0,
            sgst_percentage: parseFloat(data.sgst_percentage) || 0,
            igst_percentage: parseFloat(data.igst_percentage) || 0,
            tcs_percentage: parseFloat(data.tcs_percentage) || 0,
            round_off: parseFloat(data.round_off) || 0,
            gross_amount: parseFloat(data.gross_amount) || 0,
            discount: parseFloat(data.discount) || 0,
            total: parseFloat(data.total) || 0,
            net_amount: parseFloat(data.net_amount) || 0,
            _method: 'PUT' // Add this for Laravel to recognize it as PUT
        };

        if (data.attachments && data.attachments.length > 0) {
            // Use FormData for file uploads
            const formData = new FormData();
            
            // Add all non-file fields first
            formData.append('po_date', data.po_date);
            formData.append('vendor_id', data.vendor_id);
            formData.append('vendor_address', data.vendor_address);
            formData.append('deliver_address', data.deliver_address);
            formData.append('expected_delivery', data.expected_delivery || '');
            formData.append('items', submitData.items); // Use the JSON string from submitData
            formData.append('subtotal', submitData.subtotal);
            formData.append('tax', submitData.tax);
            formData.append('discount', submitData.discount);
            formData.append('total', submitData.total);
            formData.append('terms', data.terms || '');
            formData.append('notes', data.notes || '');
            formData.append('reference', data.reference || '');
            formData.append('status', data.status || '');
            formData.append('_method', 'PUT'); // Important for Laravel
            
            // Add file attachments
            data.attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });

            // Use POST with _method=PUT for FormData
            router.post(route('purchase-bills.update', purchaseBill.id), formData, {
                forceFormData: true,
                preserveScroll: false, // Allow redirect
                onSuccess: () => {
                    setFileList([]);
                    // No custom toast here - let backend flash message handle it
                },
                onError: (errors) => {
                    console.log('Form submission errors:', errors);
                    // Show validation errors in toast
                    Object.keys(errors).forEach(key => {
                        if (window.showError) {
                            window.showError(`${key}: ${errors[key]}`);
                        }
                    });
                }
            });
        } else {
            // Use regular form submission without files
            put(route('purchase-bills.update', purchaseBill.id), submitData, {
                preserveScroll: false, // Allow redirect
                onSuccess: () => {
                    setFileList([]);
                    // No custom toast here - let backend flash message handle it
                },
                onError: (errors) => {
                    console.log('Form submission errors:', errors);
                    // Show validation errors in toast
                    Object.keys(errors).forEach(key => {
                        if (window.showError) {
                            window.showError(`${key}: ${errors[key]}`);
                        }
                    });
                }
            });
        }
    };

    return (
        <SidebarLayout>
            <Head title="Edit Purchase Bill" />
            
            <div className="py-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    type="button"
                                    onClick={() => router.visit(route('purchase-bills.index'))}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                                >
                                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                    Back to Purchase Bills
                                </button>
                                <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
                                        Edit Purchase Bill {purchaseBill.po_number}
                                    </h1>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Update purchase order details and specifications
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="po_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        PO Date *
                                    </label>
                                    <input
                                        type="date"
                                        id="po_date"
                                        value={data.po_date}
                                        onChange={(e) => setData('po_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        required
                                    />
                                    {errors.po_date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.po_date}</p>}
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>}
                                </div>

                                <div>
                                    <label htmlFor="vendor_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Vendor *
                                    </label>
                                    <select
                                        id="vendor_id"
                                        value={data.vendor_id}
                                        onChange={(e) => handleVendorChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        required
                                    >
                                        <option value="">Select Vendor</option>
                                        {vendors.map((vendor) => (
                                            <option key={vendor.id} value={vendor.id}>
                                                {vendor.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.vendor_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.vendor_id}</p>}
                                </div>

                                <div>
                                    <label htmlFor="vendor_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Vendor Address *
                                    </label>
                                    <textarea
                                        id="vendor_address"
                                        rows="2"
                                        value={data.vendor_address}
                                        onChange={(e) => setData('vendor_address', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        required
                                        readOnly
                                    />
                                    {errors.vendor_address && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.vendor_address}</p>}
                                </div>

                                <div>
                                    <label htmlFor="deliver_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Deliver Address *
                                    </label>
                                    <textarea
                                        id="deliver_address"
                                        rows="2"
                                        value={data.deliver_address}
                                        onChange={(e) => setData('deliver_address', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        required
                                    />
                                    {errors.deliver_address && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.deliver_address}</p>}
                                </div>

                                <div>
                                    <label htmlFor="expected_delivery" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Expected Delivery Date
                                    </label>
                                    <input
                                        type="date"
                                        id="expected_delivery"
                                        value={data.expected_delivery}
                                        onChange={(e) => setData('expected_delivery', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    />
                                    {errors.expected_delivery && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expected_delivery}</p>}
                                </div>
                            </div>

                            {/* File Upload */}
                            <div className="mt-6">
                                <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Add Files to Purchase Order
                                </label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-primary-400 dark:hover:border-primary-500 transition-colors duration-200">
                                    <input
                                        type="file"
                                        id="attachments"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                    />
                                    <label
                                        htmlFor="attachments"
                                        className="cursor-pointer flex flex-col items-center justify-center"
                                    >
                                        <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Click to select files or drag and drop
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                            PDF, DOC, XLS, JPG, PNG up to 10MB each
                                        </span>
                                    </label>
                                </div>
                                {fileList.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected files:</p>
                                        <ul className="space-y-1">
                                            {fileList.map((file, index) => (
                                                <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Items</h2>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 rounded-lg transition-colors duration-200"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Add Item
                                </button>
                            </div>

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
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {data.items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-3">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={item.product}
                                                        onChange={(e) => updateItem(index, 'product', e.target.value)}
                                                        placeholder="Description"
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={item.hsn_code}
                                                        onChange={(e) => updateItem(index, 'hsn_code', e.target.value)}
                                                        placeholder="HSN Code"
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={item.measurement}
                                                        onChange={(e) => updateItem(index, 'measurement', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                        required
                                                    >
                                                        <option value="">Select Unit</option>
                                                        {measurementUnits.map((unit) => (
                                                            <option key={unit} value={unit}>
                                                                {unit.toUpperCase()}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.unit_price}
                                                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                        value={item.discount_percentage}
                                                        onChange={(e) => updateItem(index, 'discount_percentage', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={`₹${(parseFloat(item.net_rate) || 0).toFixed(2)}`}
                                                        readOnly
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={`₹${(parseFloat(item.amount) || 0).toFixed(2)}`}
                                                        readOnly
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        disabled={data.items.length === 1}
                                                        className="inline-flex items-center p-1 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Summary</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <label htmlFor="subtotal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Subtotal
                                    </label>
                                    <input
                                        type="text"
                                        id="subtotal"
                                        value={`₹${data.subtotal}`}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="tax" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tax (%)
                                    </label>
                                    <input
                                        type="number"
                                        id="tax"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={data.tax}
                                        onChange={(e) => setData('tax', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="discount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Discount
                                    </label>
                                    <input
                                        type="number"
                                        id="discount"
                                        min="0"
                                        step="0.01"
                                        value={data.discount}
                                        onChange={(e) => setData('discount', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="total" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Total
                                    </label>
                                    <input
                                        type="text"
                                        id="total"
                                        value={`₹${data.total}`}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms & Notes Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Terms & Notes</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="terms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Terms & Conditions
                                    </label>
                                    <textarea
                                        id="terms"
                                        rows="4"
                                        value={data.terms}
                                        onChange={(e) => setData('terms', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        placeholder="Enter terms and conditions..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Customer Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows="4"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        placeholder="Enter customer notes..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="reference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Reference #
                                    </label>
                                    <input
                                        type="text"
                                        id="reference"
                                        value={data.reference}
                                        onChange={(e) => setData('reference', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                        placeholder="Enter reference number..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Section */}
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => router.visit(route('purchase-bills.index'))}
                                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {processing ? 'Updating...' : 'Update Purchase Bill'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
