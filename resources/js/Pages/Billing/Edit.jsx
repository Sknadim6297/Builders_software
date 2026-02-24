import { useEffect, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { route } from '@/utils/route';

export default function Edit({ invoice, services, products, flash }) {
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
        stock_id: item.stock_id ? String(item.stock_id) : '',
        quantity: item.quantity != null ? String(item.quantity) : '1',
        unit_price: item.unit_price != null ? String(item.unit_price) : '',
        total: parseFloat(item.total) || 0
    }));

    const { data, setData, put, processing, errors } = useForm({
        invoice_date: toDateInput(invoice.invoice_date),
        customer_id: invoice.customer_id || '',
        service_items: initialServiceItems,
        product_items: initialProductItems,
        discount: invoice.discount != null ? String(invoice.discount) : '',
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

    const serviceMap = useMemo(() => {
        const map = new Map();
        services.forEach((service) => map.set(String(service.id), service));
        return map;
    }, [services]);

    const productMap = useMemo(() => {
        const map = new Map();
        products.forEach((product) => map.set(String(product.id), product));
        return map;
    }, [products]);

    const addServiceItem = () => {
        setData('service_items', [
            ...data.service_items,
            { service_id: '', quantity: '1', unit_price: '', total: 0 }
        ]);
    };

    const addProductItem = () => {
        setData('product_items', [
            ...data.product_items,
            { stock_id: '', quantity: '1', unit_price: '', total: 0 }
        ]);
    };

    const updateServiceItem = (index, field, value) => {
        const items = [...data.service_items];
        items[index][field] = value;

        if (field === 'service_id') {
            const service = serviceMap.get(value);
            items[index].unit_price = service ? service.final_price : '';
        }

        const quantity = parseFloat(items[index].quantity) || 0;
        const unitPrice = parseFloat(items[index].unit_price) || 0;
        items[index].total = quantity * unitPrice;

        setData('service_items', items);
    };

    const updateProductItem = (index, field, value) => {
        const items = [...data.product_items];
        items[index][field] = value;

        if (field === 'stock_id') {
            const product = productMap.get(value);
            const defaultPrice = product ? (parseFloat(product.selling_price) || parseFloat(product.unit_cost) || 0) : '';
            items[index].unit_price = defaultPrice;
        }

        const quantity = parseFloat(items[index].quantity) || 0;
        const unitPrice = parseFloat(items[index].unit_price) || 0;
        items[index].total = quantity * unitPrice;

        setData('product_items', items);
    };

    const removeServiceItem = (index) => {
        const items = data.service_items.filter((_, i) => i !== index);
        setData('service_items', items);
    };

    const removeProductItem = (index) => {
        const items = data.product_items.filter((_, i) => i !== index);
        setData('product_items', items);
    };

    const subtotal = useMemo(() => {
        const serviceTotal = data.service_items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        const productTotal = data.product_items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        return serviceTotal + productTotal;
    }, [data.service_items, data.product_items]);

    const total = useMemo(() => {
        const discount = parseFloat(data.discount) || 0;
        return subtotal - discount;
    }, [subtotal, data.discount]);

    const formatCurrency = (value) => {
        const amount = parseFloat(value || 0);
        return `₹${amount.toFixed(2)}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('billing.update', invoice.id));
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Service Items</h2>
                            <button
                                type="button"
                                onClick={addServiceItem}
                                className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add Service
                            </button>
                        </div>

                        {data.service_items.length === 0 ? (
                            <p className="text-sm text-gray-500">No services added.</p>
                        ) : (
                            <div className="space-y-3">
                                {data.service_items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                        <div className="md:col-span-5">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service</label>
                                            <select
                                                value={item.service_id}
                                                onChange={(e) => updateServiceItem(index, 'service_id', e.target.value)}
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                            >
                                                <option value="">Select service</option>
                                                {services.map((service) => (
                                                    <option key={service.id} value={service.id}>{service.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Qty</label>
                                            <input
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={item.quantity}
                                                onChange={(e) => updateServiceItem(index, 'quantity', e.target.value)}
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.unit_price}
                                                onChange={(e) => updateServiceItem(index, 'unit_price', e.target.value)}
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total</label>
                                            <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {formatCurrency(item.total)}
                                            </div>
                                        </div>
                                        <div className="md:col-span-1">
                                            <button
                                                type="button"
                                                onClick={() => removeServiceItem(index)}
                                                className="mt-1 p-2 text-red-600 hover:text-red-700"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Product Items</h2>
                            <button
                                type="button"
                                onClick={addProductItem}
                                className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add Product
                            </button>
                        </div>

                        {data.product_items.length === 0 ? (
                            <p className="text-sm text-gray-500">No products added.</p>
                        ) : (
                            <div className="space-y-3">
                                {data.product_items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                        <div className="md:col-span-5">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
                                            <select
                                                value={item.stock_id}
                                                onChange={(e) => updateProductItem(index, 'stock_id', e.target.value)}
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                            >
                                                <option value="">Select product</option>
                                                {products.map((product) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.item_name} ({product.unit?.toUpperCase()})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Qty</label>
                                            <input
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={item.quantity}
                                                onChange={(e) => updateProductItem(index, 'quantity', e.target.value)}
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md"
                                            />
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
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Invoice Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.discount}
                                    onChange={(e) => setData('discount', e.target.value)}
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
                                <span>Discount</span>
                                <span className="font-medium text-gray-900 dark:text-white">-{formatCurrency(data.discount)}</span>
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
