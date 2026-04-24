import { useEffect, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { route } from '@/utils/route';

export default function Edit({ invoice, services, categories, products, companyAddressOptions = [], flash }) {
    const toDateInput = (value) => {
        if (!value) {
            return '';
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return '';
        }
        return date.toISOString().split('T')[0];
    };

    const initialServiceItems = (invoice.service_items || []).map((item) => ({
        service_id: item.service_id ? String(item.service_id) : '',
        quantity: item.quantity != null ? String(item.quantity) : '1',
        unit_price: item.unit_price != null ? String(item.unit_price) : '',
        total: parseFloat(item.total) || 0
    }));

    const initialProductItems = (invoice.product_items || []).map((item) => ({
        category_id: item.category_id ? String(item.category_id) : (item.category?.id ? String(item.category.id) : ''),
        stock_id: item.stock_id ? String(item.stock_id) : '',
        quantity: item.quantity != null ? String(item.quantity) : '1',
        unit_price: item.unit_price != null ? String(item.unit_price) : '',
        discount_percentage: item.discount_percentage != null ? String(item.discount_percentage) : '',
        discount_amount: item.discount_amount != null ? String(item.discount_amount) : '',
        original_stock_id: item.stock_id ? String(item.stock_id) : '',
        original_quantity: item.quantity != null ? String(item.quantity) : '0',
        available_stock: 0,
        stock_warning: false,
        total: parseFloat(item.total) || 0
    }));

    const { data, setData, post, processing, errors, transform } = useForm({
        invoice_date: toDateInput(invoice.invoice_date) || toDateInput(invoice.created_at) || new Date().toISOString().split('T')[0],
        customer_id: invoice.customer_id || '',
        selected_company_address: invoice.selected_company_address || '',
        selected_company_address_label: invoice.selected_company_address_label || '',
        cgst_percentage: invoice.cgst_percentage != null ? String(invoice.cgst_percentage) : '',
        sgst_percentage: invoice.sgst_percentage != null ? String(invoice.sgst_percentage) : '',
        gst_percentage: invoice.gst_percentage != null ? String(invoice.gst_percentage) : '',
        buyer_logo: invoice.buyer_logo || undefined,
        service_items: initialServiceItems,
        product_items: initialProductItems,
        discount_percentage: invoice.invoice_discount_percent != null ? String(invoice.invoice_discount_percent) : '',
        notes: invoice.notes || ''
    });

    useEffect(() => {
        if (flash?.success) {
            window.showSuccess(flash.success);
        }
        if (flash?.error) {
            window.showError(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        const cgst = parseFloat(data.cgst_percentage) || 0;
        const sgst = parseFloat(data.sgst_percentage) || 0;
        const sum = cgst + sgst;
        if (!Number.isNaN(sum)) {
            setData('gst_percentage', String(sum));
        }
    }, [data.cgst_percentage, data.sgst_percentage]);

    useEffect(() => {
        if (!data.selected_company_address && companyAddressOptions.length > 0) {
            setData((prev) => ({
                ...prev,
                selected_company_address: companyAddressOptions[0].value,
                selected_company_address_label: companyAddressOptions[0].label,
            }));
        }
    }, [companyAddressOptions, data.selected_company_address]);

    const roundToTwo = (value) => Math.round((parseFloat(value) || 0) * 100) / 100;

    const categoryMap = useMemo(() => {
        const map = new Map();
        categories.forEach((category) => map.set(String(category.id), category));
        return map;
    }, [categories]);

    const productMap = useMemo(() => {
        const map = new Map();
        categories.forEach((category) => {
            (category.items || []).forEach((product) => {
                (product.stocks || []).forEach((stock) => {
                    map.set(String(stock.id), {
                        ...stock,
                        category_id: String(category.id),
                        category_name: category.name,
                        category_discount_percentage: category.discount_percentage ?? 0,
                        product_name: product.name,
                        product_unit_type: product.unit_type,
                    });
                });
            });
        });
        products.forEach((product) => {
            if (!map.has(String(product.id))) {
                map.set(String(product.id), {
                    ...product,
                    category_id: product.item?.category_id ? String(product.item.category_id) : '',
                    category_name: product.item?.category?.name || '',
                    category_discount_percentage: product.item?.category?.discount_percentage ?? 0,
                });
            }
        });
        return map;
    }, [categories, products]);

    const getCategoryProducts = (categoryId) => {
        const category = categoryMap.get(String(categoryId));

        return (category?.items || [])
            .map((product) => {
                const stocks = [...(product.stocks || [])].sort((left, right) => {
                    return (Number(left.id) || 0) - (Number(right.id) || 0);
                });
                const primaryStock = stocks[0];

                if (!primaryStock) {
                    return null;
                }

                return {
                    ...product,
                    stock_id: String(primaryStock.id),
                    available_stock: stocks.reduce((sum, stock) => sum + (parseFloat(stock.quantity_on_hand || 0) || 0), 0),
                };
            })
            .filter(Boolean);
    };

    const addProductItem = () => {
        setData('product_items', [
            ...data.product_items,
            {
                category_id: '',
                stock_id: '',
                quantity: '1',
                unit_price: '',
                discount_percentage: '',
                discount_amount: '',
                original_stock_id: '',
                original_quantity: '0',
                available_stock: 0,
                stock_warning: false,
                total: 0,
            }
        ]);
    };

    const evaluateStockWarning = (row) => {
        const product = productMap.get(String(row.stock_id));
        const baseAvailable = parseFloat(product?.quantity_on_hand || 0);
        const originalQty = parseFloat(row.original_quantity || 0);
        const restoredQty = row.stock_id && row.original_stock_id && String(row.stock_id) === String(row.original_stock_id)
            ? originalQty
            : 0;
        const availableStock = baseAvailable + restoredQty;
        const requiredQty = parseFloat(row.quantity || 0);
        const insufficient = !!row.stock_id && requiredQty > 0 && requiredQty > availableStock;

        return {
            insufficient,
            availableStock,
        };
    };

    const updateProductItem = (index, field, value) => {
        const items = [...data.product_items];
        const wasInsufficient = !!items[index].stock_warning;
        items[index][field] = value;

        if (field === 'category_id') {
            const category = categoryMap.get(String(value));
            items[index].stock_id = '';
            items[index].unit_price = '';
            items[index].discount_percentage = category ? String(category.discount_percentage ?? 0) : '0';
            items[index].discount_amount = '';
        }

        if (field === 'stock_id') {
            const product = productMap.get(value);
            const defaultPrice = product ? (parseFloat(product.selling_price) || parseFloat(product.unit_cost) || 0) : '';
            items[index].unit_price = defaultPrice;
            if (!items[index].category_id && product?.category_id) {
                items[index].category_id = String(product.category_id);
            }
            if (!items[index].discount_percentage || parseFloat(items[index].discount_percentage) === 0) {
                items[index].discount_percentage = product ? String(product.category_discount_percentage ?? 0) : '0';
            }
        }

        const quantity = parseFloat(items[index].quantity) || 0;
        const unitPrice = parseFloat(items[index].unit_price) || 0;
        const discountPercent = parseFloat(items[index].discount_percentage) || 0;
        const grossAmount = quantity * unitPrice;
        const discountAmount = roundToTwo(grossAmount * discountPercent / 100);
        items[index].discount_amount = discountAmount;
        items[index].total = Math.max(0, roundToTwo(grossAmount - discountAmount));

        const stockState = evaluateStockWarning(items[index]);
        items[index].available_stock = stockState.availableStock;
        items[index].stock_warning = stockState.insufficient;

        if (stockState.insufficient && !wasInsufficient) {
            if (window.showWarning) {
                window.showWarning('This product has insufficient stock');
            } else {
                alert('This product has insufficient stock');
            }
        }

        setData('product_items', items);
    };

    const removeProductItem = (index) => {
        const items = data.product_items.filter((_, i) => i !== index);
        setData('product_items', items);
    };

    const subtotal = useMemo(() => {
        const serviceTotal = (data.service_items || []).reduce((sum, item) => {
            const lineTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
            return sum + lineTotal;
        }, 0);
        const productTotal = data.product_items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        return serviceTotal + productTotal;
    }, [data.service_items, data.product_items]);

    const discountAmount = useMemo(() => {
        const percent = parseFloat(data.discount_percentage) || 0;
        return (subtotal * percent) / 100;
    }, [subtotal, data.discount_percentage]);

    const total = useMemo(() => {
        const cgstPercentage = parseFloat(data.cgst_percentage) || 0;
        const sgstPercentage = parseFloat(data.sgst_percentage) || 0;
        const gstPercentage = cgstPercentage + sgstPercentage || parseFloat(data.gst_percentage) || 0;
        const gstAmount = (subtotal * gstPercentage) / 100;
        return subtotal + gstAmount - discountAmount;
    }, [subtotal, data.cgst_percentage, data.sgst_percentage, data.gst_percentage, discountAmount]);

    const formatCurrency = (value) => {
        const amount = parseFloat(value || 0);
        return `₹${amount.toFixed(2)}`;
    };

    const selectedCompanyAddress = useMemo(() => {
        if (!data.selected_company_address) {
            return null;
        }
        return companyAddressOptions.find((option) => option.value === data.selected_company_address) || null;
    }, [companyAddressOptions, data.selected_company_address]);

    const handleSubmit = (e) => {
        e.preventDefault();
        transform((payload) => ({
            ...payload,
            _method: 'put',
            service_items: JSON.stringify(payload.service_items || []),
            product_items: JSON.stringify(payload.product_items || []),
        }));
        post(route('billing.update', invoice.id), {
            forceFormData: true
        });
    };

    return (
        <SidebarLayout>
            <Head title={`Edit Invoice ${invoice.invoice_number}`} />

            <div className="p-6">
                <div className="flex items-center mb-6">
                    <Link
                        href={route('billing.show', invoice.id)}
                        className="mr-4 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Invoice</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Update items and totals for invoice {invoice.invoice_number}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice Date</label>
                                <input
                                    type="date"
                                    value={data.invoice_date}
                                    onChange={(e) => setData('invoice_date', e.target.value)}
                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                    required
                                />
                                {errors.invoice_date && <div className="text-red-600 text-sm mt-1">{errors.invoice_date}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer</label>
                                <div className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md px-3 py-2 text-sm">
                                    {invoice.customer?.name} ({invoice.customer?.cust_id})
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">C G.S.T %</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={data.cgst_percentage}
                                    onChange={(e) => setData('cgst_percentage', e.target.value)}
                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                    placeholder="0.00"
                                />
                                {errors.cgst_percentage && <div className="text-red-600 text-sm mt-1">{errors.cgst_percentage}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">S G.S.T %</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={data.sgst_percentage}
                                    onChange={(e) => setData('sgst_percentage', e.target.value)}
                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                    placeholder="0.00"
                                />
                                {errors.sgst_percentage && <div className="text-red-600 text-sm mt-1">{errors.sgst_percentage}</div>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GST % (Total)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={data.gst_percentage}
                                    onChange={(e) => setData('gst_percentage', e.target.value)}
                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                    placeholder="0.00"
                                />
                                {errors.gst_percentage && <div className="text-red-600 text-sm mt-1">{errors.gst_percentage}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buyer Logo (Optional Image Upload)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('buyer_logo', e.target.files?.[0] || undefined)}
                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                />
                                {errors.buyer_logo && <div className="text-red-600 text-sm mt-1">{errors.buyer_logo}</div>}
                                {data.buyer_logo && data.buyer_logo instanceof File && (
                                    <img
                                        src={URL.createObjectURL(data.buyer_logo)}
                                        alt="Buyer logo preview"
                                        className="h-16 mt-2 object-contain"
                                    />
                                )}
                                {data.buyer_logo && !(data.buyer_logo instanceof File) && (
                                    <img
                                        src={`/storage/${data.buyer_logo}`}
                                        alt="Current buyer logo"
                                        className="h-16 mt-2 object-contain"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Billing Address</label>
                                <select
                                    value={data.selected_company_address}
                                    onChange={(e) => {
                                        const selected = companyAddressOptions.find((option) => option.value === e.target.value);
                                        setData((prev) => ({
                                            ...prev,
                                            selected_company_address: e.target.value,
                                            selected_company_address_label: selected?.label || '',
                                        }));
                                    }}
                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select company address</option>
                                    {companyAddressOptions.map((option, index) => (
                                        <option key={`${option.label}-${index}`} value={option.value}>
                                            {option.display}
                                        </option>
                                    ))}
                                </select>
                                {errors.selected_company_address && <div className="text-red-600 text-sm mt-1">{errors.selected_company_address}</div>}
                                {selectedCompanyAddress && (
                                    <textarea
                                        value={selectedCompanyAddress.value}
                                        readOnly
                                        rows={3}
                                        className="mt-2 w-full border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                    />
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Product Items</h2>
                        </div>

                        {data.product_items.length === 0 ? (
                            <p className="text-sm text-gray-500">No products added.</p>
                        ) : (
                            <div className="space-y-3">
                                {data.product_items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                        <div className="md:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                            <select
                                                value={item.category_id}
                                                onChange={(e) => updateProductItem(index, 'category_id', e.target.value)}
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                            >
                                                <option value="">Select category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name} ({parseFloat(category.discount_percentage || 0).toFixed(2)}%)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
                                            {(() => {
                                                const categoryProducts = getCategoryProducts(item.category_id);
                                                const currentStock = item.stock_id ? productMap.get(String(item.stock_id)) : null;
                                                const hasCurrentStockOption = categoryProducts.some((product) => String(product.stock_id) === String(item.stock_id));

                                                return (
                                            <select
                                                value={item.stock_id}
                                                onChange={(e) => updateProductItem(index, 'stock_id', e.target.value)}
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                                disabled={!item.category_id}
                                            >
                                                <option value="">Select product</option>
                                                {categoryProducts.map((product) => (
                                                    <option key={product.id} value={product.stock_id}>
                                                        {product.name} ({product.unit_type})
                                                    </option>
                                                ))}
                                                {item.stock_id && currentStock && !hasCurrentStockOption && (
                                                    <option value={item.stock_id}>
                                                        {currentStock.product_name} ({currentStock.product_unit_type})
                                                    </option>
                                                )}
                                            </select>
                                                );
                                            })()}
                                            {!item.category_id && <p className="mt-1 text-xs text-gray-500">Choose a category first.</p>}
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Qty</label>
                                            <input
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={item.quantity}
                                                onChange={(e) => updateProductItem(index, 'quantity', e.target.value)}
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                            />
                                            {item.stock_id && (
                                                <p className="mt-1 text-xs text-gray-500">Available: {parseFloat(item.available_stock || 0).toFixed(2)}</p>
                                            )}
                                            {item.stock_warning && (
                                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">This product has insufficient stock</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.unit_price}
                                                onChange={(e) => updateProductItem(index, 'unit_price', e.target.value)}
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Discount %</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                value={item.discount_percentage}
                                                onChange={(e) => updateProductItem(index, 'discount_percentage', e.target.value)}
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Discount</label>
                                            <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                - {formatCurrency(item.discount_amount)}
                                            </div>
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total</label>
                                            <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {formatCurrency(item.total)}
                                            </div>
                                        </div>
                                        <div className="md:col-span-1">
                                            <button
                                                type="button"
                                                onClick={() => removeProductItem(index)}
                                                className="mt-1 p-2 text-red-600 hover:text-red-700"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={addProductItem}
                                className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add Product
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Invoice Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={data.discount_percentage}
                                    onChange={(e) => setData('discount_percentage', e.target.value)}
                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                                <textarea
                                    rows={2}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>GST ({parseFloat(data.gst_percentage || 0).toFixed(2)}%)</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency((subtotal * (parseFloat(data.gst_percentage || 0) || 0)) / 100)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount ({parseFloat(data.discount_percentage || 0).toFixed(2)}%)</span>
                                <span className="font-medium text-gray-900 dark:text-white">-{formatCurrency(discountAmount)}</span>
                            </div>
                            <div className="flex justify-between text-base font-semibold">
                                <span>Total</span>
                                <span className="text-gray-900 dark:text-white">{formatCurrency(total)}</span>
                            </div>
                            {errors.items && <div className="text-red-600 text-sm">{errors.items}</div>}
                            {errors.stock && <div className="text-red-600 text-sm">{errors.stock}</div>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3">
                        <Link
                            href={route('billing.show', invoice.id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Update Invoice'}
                        </button>
                    </div>
                </form>
            </div>
        </SidebarLayout>
    );
}
