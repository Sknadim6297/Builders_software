import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import SidebarLayout from '../../Layouts/SidebarLayout';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { route } from '@/utils/route';

export default function Create({ auth, vendors, customers, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        po_date: new Date().toISOString().split('T')[0],
        vendor_id: '',
        vendor_address: '',
        deliver_address: '',
        expected_delivery: '',
        attachments: [],
        items: [
            {
                product: '',
                description: '',
                hsn_code: '',
                quantity: '0',
                unit_price: '0',
                measurement: 'pcs',
                discount_percentage: '0',
                net_rate: 0,
                amount: 0
            }
        ],
        subtotal: '0',
        delivery_charges: '0',
        gst_type: 'intra',
        cgst_percentage: '9',
        sgst_percentage: '9',
        igst_percentage: '0',
        tcs_percentage: '0',
        round_off: '0',
        gross_amount: '0',
        discount: '0',
        tax: '0',
        total: '0',
        net_amount: '0',
        terms: '',
        notes: '',
        reference: ''
    });

    const [selectedVendor, setSelectedVendor] = useState(null);
    const [fileList, setFileList] = useState([]);

    const measurementUnits = ['kg', 'g', 'l', 'ml', 'pcs', 'box', 'pack', 'meter', 'feet'];

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
                quantity: '0',
                unit_price: '0',
                measurement: 'pcs',
                discount_percentage: '0',
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
            net_amount: parseFloat(data.net_amount) || 0
        };

        // Validate that items is a string
        if (typeof submitData.items !== 'string') {
            if (window.showError) {
                window.showError('Invalid items data format');
            }
            return;
        }

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
            
            // Add file attachments
            data.attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });

            post(route('purchase-bills.store'), {
                data: formData,
                forceFormData: true,
                preserveScroll: false, // Allow redirect
                onSuccess: () => {
                    reset();
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
            post(route('purchase-bills.store'), {
                data: submitData,
                preserveScroll: false, // Allow redirect
                onSuccess: () => {
                    reset();
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
            <Head title="Create Purchase Bill" />
            
            <div className="py-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.visit(route('purchase-bills.index'))}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                            >
                                <ArrowLeftIcon className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
                                    Create Purchase Bill
                                </h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Create a new purchase order with detailed information
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        PO Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.po_date}
                                        onChange={(e) => setData('po_date', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    />
                                    {errors.po_date && <div className="text-red-500 text-sm mt-1">{errors.po_date}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Expected Delivery Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.expected_delivery}
                                        onChange={(e) => setData('expected_delivery', e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    />
                                    {errors.expected_delivery && <div className="text-red-500 text-sm mt-1">{errors.expected_delivery}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Vendor *
                                    </label>
                                    <select
                                        value={data.vendor_id}
                                        onChange={(e) => handleVendorChange(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    >
                                        <option value="">Select Vendor</option>
                                        {vendors.map(vendor => (
                                            <option key={vendor.id} value={vendor.id}>
                                                {vendor.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.vendor_id && <div className="text-red-500 text-sm mt-1">{errors.vendor_id}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Vendor Address
                                    </label>
                                    <textarea
                                        value={data.vendor_address}
                                        onChange={(e) => setData('vendor_address', e.target.value)}
                                        rows={2}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white transition-colors duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Deliver Address *
                                    </label>
                                    <textarea
                                        value={data.deliver_address}
                                        onChange={(e) => setData('deliver_address', e.target.value)}
                                        rows={2}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    />
                                    {errors.deliver_address && <div className="text-red-500 text-sm mt-1">{errors.deliver_address}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Expected Delivery Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.expected_delivery}
                                        onChange={(e) => setData('expected_delivery', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    />
                                    {errors.expected_delivery && <div className="text-red-500 text-sm mt-1">{errors.expected_delivery}</div>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Attach Files to Purchase Order
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                                    />
                                    {fileList.length > 0 && (
                                        <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            {fileList.map((file, index) => (
                                                <li key={index}>• {file.name}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Items</h2>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Add Item
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-primary-600 text-white">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Sl. No</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">HSN Code</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Unit</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Rate (Rs.)</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Discount %</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Net Rate</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {data.items.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <td className="px-4 py-3">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={item.product}
                                                        onChange={(e) => updateItem(index, 'product', e.target.value)}
                                                        placeholder="Description"
                                                        required
                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={item.hsn_code}
                                                        onChange={(e) => updateItem(index, 'hsn_code', e.target.value)}
                                                        placeholder="HSN Code"
                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="0"
                                                        required
                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={item.measurement}
                                                        onChange={(e) => updateItem(index, 'measurement', e.target.value)}
                                                        required
                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                    >
                                                        {measurementUnits.map(unit => (
                                                            <option key={unit} value={unit}>
                                                                {unit.toUpperCase()}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={item.unit_price}
                                                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        required
                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={item.discount_percentage}
                                                        onChange={(e) => updateItem(index, 'discount_percentage', e.target.value)}
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                        placeholder="0"
                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={`₹${(parseFloat(item.net_rate) || 0).toFixed(2)}`}
                                                        readOnly
                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={`₹${(parseFloat(item.amount) || 0).toFixed(2)}`}
                                                        readOnly
                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {data.items.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    )}
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
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gross Amount</label>
                                    <input
                                        type="text"
                                        value={`₹${data.gross_amount}`}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Charges</label>
                                    <input
                                        type="number"
                                        value={data.delivery_charges}
                                        onChange={(e) => setData('delivery_charges', e.target.value)}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GST Type</label>
                                    <select
                                        value={data.gst_type}
                                        onChange={(e) => setData('gst_type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="intra">Intra-state (CGST + SGST)</option>
                                        <option value="inter">Inter-state (IGST)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CGST %</label>
                                    <input
                                        type="number"
                                        value={data.cgst_percentage}
                                        onChange={(e) => setData('cgst_percentage', e.target.value)}
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SGST %</label>
                                    <input
                                        type="number"
                                        value={data.sgst_percentage}
                                        onChange={(e) => setData('sgst_percentage', e.target.value)}
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">IGST %</label>
                                    <input
                                        type="number"
                                        value={data.igst_percentage}
                                        onChange={(e) => setData('igst_percentage', e.target.value)}
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CGST Amount</label>
                                    <input
                                        type="text"
                                        value={`₹${data.cgst_amount || '0.00'}`}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SGST Amount</label>
                                    <input
                                        type="text"
                                        value={`₹${data.sgst_amount || '0.00'}`}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">IGST Amount</label>
                                    <input
                                        type="text"
                                        value={`₹${data.igst_amount || '0.00'}`}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">TCS %</label>
                                    <input
                                        type="number"
                                        value={data.tcs_percentage}
                                        onChange={(e) => setData('tcs_percentage', e.target.value)}
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">TCS Amount</label>
                                    <input
                                        type="text"
                                        value={`₹${data.tcs_amount || '0.00'}`}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Round Off</label>
                                    <input
                                        type="number"
                                        value={data.round_off}
                                        onChange={(e) => setData('round_off', e.target.value)}
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Net Amount</label>
                                    <input
                                        type="text"
                                        value={`₹${data.net_amount}`}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms & Notes Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Terms & Notes</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Terms & Conditions
                                    </label>
                                    <textarea
                                        value={data.terms}
                                        onChange={(e) => setData('terms', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Customer Notes
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Reference #
                                    </label>
                                    <input
                                        type="text"
                                        value={data.reference}
                                        onChange={(e) => setData('reference', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Section */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => router.visit(route('purchase-bills.index'))}
                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg transition-colors duration-200"
                            >
                                {processing ? 'Saving...' : 'Save Purchase Order'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
