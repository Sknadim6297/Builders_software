    import { useState, useEffect, useMemo } from 'react';
    import { Head, useForm, router } from '@inertiajs/react';
    import SidebarLayout from '../../Layouts/SidebarLayout';
    import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
    import { route } from '@/utils/route';

    export default function Create({ auth, vendors, items: allItems, flash }) {
        const getItemLabel = (item) => `${item.item_code} - ${item.name}`;
        const getItemSearchText = (item) => `${item.item_code} ${item.name} ${item.default_unit_price ?? ''} ${item.unit_price ?? ''}`.toLowerCase();
        const formatCurrency = (value) => `Rs. ${parseFloat(value || 0).toFixed(2)}`;
        const getFilteredItemsForRow = (row) => {
            let filteredItems = allItems.filter((itm) => !row.category_id || String(itm.category_id) === String(row.category_id));
            const searchTerm = (row.item_search || '').trim().toLowerCase();

            if (searchTerm !== '') {
                filteredItems = filteredItems.filter((itm) => getItemSearchText(itm).includes(searchTerm));
            }

            return filteredItems;
        };

        const categoryOptions = useMemo(() => {
            const categoryMap = new Map();
            allItems.forEach((item) => {
                if (item.category_id && item.category?.name) {
                    categoryMap.set(String(item.category_id), {
                        id: String(item.category_id),
                        name: item.category.name,
                    });
                }
            });

            return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
        }, [allItems]);

        const { data, setData, post, processing, errors } = useForm({
            po_date: new Date().toISOString().split('T')[0],
            inv_cha_no: '',
            vendor_id: '',
            vendor_address: '',
            deliver_address: '',
            expected_delivery: '',
            attachments: [],
            items: [
                {
                    category_id: '',
                    item_id: '',
                    item_search: '',
                    item_picker_open: true,
                    hsn_code: '',
                    quantity: '0',
                    unit_price: '0',
                    discount_percentage: '0',
                    net_rate: 0,
                    amount: 0,
                    gst_percentage: 0
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
            total: '0',
            net_amount: '0',
            terms: '',
            notes: '',
            reference: ''
        });

        const [selectedVendor, setSelectedVendor] = useState(null);
        const [fileList, setFileList] = useState([]);

        // Create item map for easy lookup
        const itemMap = useMemo(() => {
            const map = new Map();
            allItems.forEach(item => map.set(String(item.id), item));
            return map;
        }, [allItems]);

        // Show flash messages
        useEffect(() => {
            if (flash?.success) {
                window.showSuccess?.(flash.success);
            }
            if (flash?.error) {
                window.showError?.(flash.error);
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
                    category_id: '',
                    item_id: '',
                    item_search: '',
                    item_picker_open: true,
                    hsn_code: '',
                    quantity: '0',
                    unit_price: '0',
                    discount_percentage: '0',
                    net_rate: 0,
                    amount: 0,
                    gst_percentage: 0
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

            // When item is selected, populate unit and gst percentage
            if (field === 'item_id') {
                const item = itemMap.get(value);
                if (item) {
                    newItems[index].category_id = item.category_id ? String(item.category_id) : '';
                    newItems[index].item_search = getItemLabel(item);
                    newItems[index].item_picker_open = false;
                    newItems[index].hsn_code = item.hsn_code || '';
                    newItems[index].gst_percentage = item.gst_percentage || 0;
                    newItems[index].unit_price = String(item.default_unit_price || 0);
                } else {
                    newItems[index].item_search = '';
                    newItems[index].item_picker_open = true;
                    newItems[index].hsn_code = '';
                    newItems[index].gst_percentage = 0;
                    newItems[index].unit_price = '0';
                }
            }

            if (field === 'category_id') {
                newItems[index].item_id = '';
                newItems[index].item_search = '';
                newItems[index].item_picker_open = true;
                newItems[index].hsn_code = '';
                newItems[index].gst_percentage = 0;
                newItems[index].unit_price = '0';
            }

            // Recalculate amounts
            const quantity = parseFloat(newItems[index].quantity) || 0;
            const rate = parseFloat(newItems[index].unit_price) || 0;
            const discountPct = parseFloat(newItems[index].discount_percentage) || 0;

            const netRate = rate - (rate * discountPct / 100);
            const amount = netRate * quantity;

            newItems[index].net_rate = Number(netRate.toFixed(2));
            newItems[index].amount = Number(amount.toFixed(2));

            setData('items', newItems);
        };

        const handleGstTypeChange = (value) => {
            setData((prevData) => ({
                ...prevData,
                gst_type: value,
                cgst_percentage: value === 'inter' ? '0' : prevData.cgst_percentage,
                sgst_percentage: value === 'inter' ? '0' : prevData.sgst_percentage,
                igst_percentage: value === 'intra' ? '0' : prevData.igst_percentage,
            }));
        };

        const validateGstSelection = () => {
            const cgstPct = parseFloat(data.cgst_percentage) || 0;
            const sgstPct = parseFloat(data.sgst_percentage) || 0;
            const igstPct = parseFloat(data.igst_percentage) || 0;

            const hasCgst = cgstPct > 0;
            const hasSgst = sgstPct > 0;
            const hasIgst = igstPct > 0;

            if (!hasCgst && !hasSgst && !hasIgst) {
                window.showError?.('Please enter either IGST or CGST & SGST.');
                return false;
            }

            if ((hasCgst && !hasSgst) || (!hasCgst && hasSgst)) {
                window.showError?.('Both CGST and SGST are required.');
                return false;
            }

            if (hasIgst && (hasCgst || hasSgst)) {
                window.showError?.('You cannot enter IGST with CGST & SGST.');
                return false;
            }

            return true;
        };

        const validateHsnCodes = () => {
            const hasMissingHsn = data.items.some((item) => item.item_id && !(item.hsn_code || '').trim());
            if (hasMissingHsn) {
                window.showError?.('HSN Code is required for this product.');
                return false;
            }
            return true;
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
                tax: gstAmount.toFixed(2),
                total: netAmount.toFixed(2),
                net_amount: netAmount.toFixed(2)
            }));
        }, [data.items, data.delivery_charges, data.gst_type, data.cgst_percentage, data.sgst_percentage, data.igst_percentage, data.tcs_percentage, data.round_off, data.discount]);

        const handleSubmit = (e) => {
            e.preventDefault();
            
            // Validate items
            const hasValidItems = data.items.some(item => item.item_id && parseFloat(item.quantity) > 0);
            if (!hasValidItems) {
                window.showError?.('Please add at least one item');
                return;
            }

            if (!validateGstSelection()) {
                return;
            }

            if (!validateHsnCodes()) {
                return;
            }

            // Prepare submission data
            const submitData = {
                po_date: data.po_date,
                inv_cha_no: data.inv_cha_no || '',
                vendor_id: data.vendor_id,
                vendor_address: data.vendor_address,
                deliver_address: data.deliver_address,
                expected_delivery: data.expected_delivery || '',
                items: data.items.map(item => ({
                    item_id: item.item_id,
                    hsn_code: (item.hsn_code || '').trim(),
                    quantity: parseFloat(item.quantity) || 0,
                    unit_price: parseFloat(item.unit_price) || 0,
                    discount_percentage: parseFloat(item.discount_percentage) || 0,
                    gst_percentage: parseFloat(item.gst_percentage) || 0
                })),
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
                cgst_amount: parseFloat(data.cgst_amount) || 0,
                sgst_amount: parseFloat(data.sgst_amount) || 0,
                igst_amount: parseFloat(data.igst_amount) || 0,
                tcs_amount: parseFloat(data.tcs_amount) || 0,
                terms: data.terms || '',
                notes: data.notes || '',
                reference: data.reference || ''
            };

            if (data.attachments && data.attachments.length > 0) {
                const formData = new FormData();
                Object.keys(submitData).forEach(key => {
                    if (key === 'items') {
                        formData.append(key, JSON.stringify(submitData[key]));
                    } else {
                        formData.append(key, submitData[key]);
                    }
                });
                data.attachments.forEach((file, index) => {
                    formData.append(`attachments[${index}]`, file);
                });

                post(route('purchase-bills.store'), {
                    data: formData,
                    forceFormData: true,
                    preserveScroll: false,
                    onError: (errors) => {
                        Object.keys(errors).forEach(key => {
                            window.showError?.(errors[key]);
                        });
                    }
                });
            } else {
                submitData.items = JSON.stringify(submitData.items);
                post(route('purchase-bills.store'), {
                    data: submitData,
                    preserveScroll: false,
                    onError: (errors) => {
                        Object.keys(errors).forEach(key => {
                            window.showError?.(errors[key]);
                        });
                    }
                });
            }
        };

        return (
            <SidebarLayout>
                <Head title="Create Purchase Bill" />
                
                <div className="py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => router.visit(route('purchase-bills.index'))}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900"
                                >
                                    <ArrowLeftIcon className="w-6 h-6" />
                                </button>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        Create Purchase Bill
                                    </h1>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Create a new purchase order with Item Master items
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        {errors.po_date && <div className="text-red-500 text-sm mt-1">{errors.po_date}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            INV/CHA No.
                                        </label>
                                        <input
                                            type="text"
                                            value={data.inv_cha_no}
                                            onChange={(e) => setData('inv_cha_no', e.target.value)}
                                            placeholder="Enter invoice/challan number"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        {errors.inv_cha_no && <div className="text-red-500 text-sm mt-1">{errors.inv_cha_no}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Expected Delivery Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.expected_delivery}
                                            onChange={(e) => setData('expected_delivery', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Vendor *
                                        </label>
                                        <select
                                            value={data.vendor_id}
                                            onChange={(e) => handleVendorChange(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Delivery Address *
                                        </label>
                                        <textarea
                                            value={data.deliver_address}
                                            onChange={(e) => setData('deliver_address', e.target.value)}
                                            rows={2}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        {errors.deliver_address && <div className="text-red-500 text-sm mt-1">{errors.deliver_address}</div>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Attachments
                                        </label>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Items from Master</h2>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-blue-600 text-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Sl. No</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase min-w-56">Category *</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase min-w-[26rem]">Item Master *</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase min-w-32">HSN</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase min-w-32">Unit Type</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase min-w-32">Quantity *</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase min-w-36">Unit Price *</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase min-w-32">Discount %</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase min-w-24">GST %</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium uppercase min-w-36">Amount</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium uppercase min-w-20">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {data.items.map((item, index) => {
                                                const selectedItem = itemMap.get(item.item_id);
                                                const selectedItemLabel = selectedItem ? getItemLabel(selectedItem) : 'Selected item';
                                                return (
                                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                                                        <td className="px-4 py-3">
                                                            <select
                                                                value={item.category_id || ''}
                                                                onChange={(e) => updateItem(index, 'category_id', e.target.value)}
                                                                required
                                                                className="w-56 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                            >
                                                                <option value="">Select Category</option>
                                                                {categoryOptions.map((category) => (
                                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {item.item_id && !item.item_picker_open ? (
                                                                <div className="flex items-center justify-between gap-2 w-[26rem]">
                                                                    <p className="text-sm text-gray-900 dark:text-white truncate font-medium">
                                                                        {item.item_search || selectedItemLabel}
                                                                    </p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateItem(index, 'item_picker_open', true)}
                                                                        className="text-xs px-2 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-300 dark:hover:bg-blue-900/20"
                                                                    >
                                                                        Change
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-2 w-[26rem]">
                                                                    <input
                                                                        type="text"
                                                                        value={item.item_search || ''}
                                                                        onChange={(e) => updateItem(index, 'item_search', e.target.value)}
                                                                        placeholder="Search by code, name or rate"
                                                                        disabled={!item.category_id}
                                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-gray-100 dark:bg-gray-700 dark:disabled:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                                    />
                                                                    <select
                                                                        value={item.item_id}
                                                                        onChange={(e) => updateItem(index, 'item_id', e.target.value)}
                                                                        disabled={!item.category_id}
                                                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-gray-100 dark:bg-gray-700 dark:disabled:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                                                    >
                                                                        <option value="">{item.category_id ? 'Select Item' : 'Select category first'}</option>
                                                                        {getFilteredItemsForRow(item).map((itm) => (
                                                                            <option key={itm.id} value={itm.id}>{`${getItemLabel(itm)} (Rs. ${parseFloat(itm.default_unit_price || itm.unit_price || 0).toFixed(2)})`}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 min-w-32">
                                                            <input
                                                                type="text"
                                                                value={item.hsn_code || ''}
                                                                readOnly
                                                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 min-w-32 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                                            {selectedItem?.unit_type || '-'}
                                                        </td>
                                                        <td className="px-4 py-3 min-w-32">
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                                min="0"
                                                                step="0.01"
                                                                required
                                                                className="w-28 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 min-w-36">
                                                            <input
                                                                type="number"
                                                                value={item.unit_price}
                                                                min="0"
                                                                step="0.01"
                                                                required
                                                                readOnly
                                                                className="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 min-w-32">
                                                            <input
                                                                type="number"
                                                                value={item.discount_percentage}
                                                                onChange={(e) => updateItem(index, 'discount_percentage', e.target.value)}
                                                                min="0"
                                                                max="100"
                                                                step="0.01"
                                                                className="w-28 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 min-w-24 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                                            {item.gst_percentage}%
                                                        </td>
                                                        <td className="px-4 py-3 min-w-36 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                            {formatCurrency(item.amount)}
                                                        </td>
                                                        <td className="px-4 py-3 min-w-20 text-center">
                                                            {data.items.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(index)}
                                                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-2" />
                                        Add Item
                                    </button>
                                </div>
                            </div>

                            {/* GST and Totals Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Taxes & Totals</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtotal</label>
                                        <input type="text" value={formatCurrency(data.subtotal)} readOnly className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Charges</label>
                                        <input type="number" value={data.delivery_charges} onChange={(e) => setData('delivery_charges', e.target.value)} min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discount</label>
                                        <input type="number" value={data.discount} onChange={(e) => setData('discount', e.target.value)} min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Round Off</label>
                                        <input type="number" value={data.round_off} onChange={(e) => setData('round_off', e.target.value)} min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GST Type</label>
                                        <select value={data.gst_type} onChange={(e) => handleGstTypeChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                            <option value="intra">INTRA (CGST+SGST)</option>
                                            <option value="inter">INTER (IGST)</option>
                                        </select>
                                    </div>
                                    {data.gst_type === 'intra' ? (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CGST %</label>
                                                <input type="number" value={data.cgst_percentage} onChange={(e) => setData('cgst_percentage', e.target.value)} min="0" max="100" step="0.01" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SGST %</label>
                                                <input type="number" value={data.sgst_percentage} onChange={(e) => setData('sgst_percentage', e.target.value)} min="0" max="100" step="0.01" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">IGST %</label>
                                            <input type="number" value={data.igst_percentage} onChange={(e) => setData('igst_percentage', e.target.value)} min="0" max="100" step="0.01" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Gross Amount</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(data.gross_amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">GST Amount</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency((parseFloat(data.cgst_amount || 0) + parseFloat(data.sgst_amount || 0) + parseFloat(data.igst_amount || 0)))}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">TCS Amount</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(data.tcs_amount)}</p>
                                    </div>
                                    <div className="border-l-2 border-blue-600 pl-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(data.total)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Additional Info</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Terms</label>
                                        <textarea value={data.terms} onChange={(e) => setData('terms', e.target.value)} rows="3" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                                        <textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows="3" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reference</label>
                                        <input type="text" value={data.reference} onChange={(e) => setData('reference', e.target.value)} placeholder="Optional reference" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-4">
                                <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
                                    {processing ? 'Creating...' : 'Create Purchase Bill'}
                                </button>
                                <button type="button" onClick={() => router.visit(route('purchase-bills.index'))} className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </SidebarLayout>
        );
    }
