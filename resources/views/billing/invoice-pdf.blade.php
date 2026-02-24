<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #1f2933;
            margin: 24px;
            font-size: 12px;
        }
        .header {
            display: table;
            width: 100%;
            margin-bottom: 20px;
            border-bottom: 2px solid #1f2933;
            padding-bottom: 12px;
        }
        .header-left,
        .header-right {
            display: table-cell;
            vertical-align: top;
        }
        .header-left {
            width: 60%;
        }
        .header-right {
            width: 40%;
            text-align: right;
        }
        .logo img {
            max-height: 70px;
            max-width: 220px;
        }
        h1 {
            margin: 8px 0 0 0;
            font-size: 22px;
            letter-spacing: 0.5px;
        }
        .muted {
            color: #6b7280;
        }
        .invoice-meta {
            margin-top: 6px;
        }
        .section {
            margin-top: 18px;
        }
        .section-title {
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            margin-bottom: 6px;
        }
        .info-grid {
            width: 100%;
            border-collapse: collapse;
        }
        .info-grid td {
            padding: 4px 0;
        }
        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }
        table.items th,
        table.items td {
            border: 1px solid #e5e7eb;
            padding: 8px;
            vertical-align: top;
        }
        table.items th {
            background-color: #f3f4f6;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        .text-right {
            text-align: right;
        }
        .totals {
            margin-top: 14px;
            width: 100%;
        }
        .totals td {
            padding: 4px 0;
        }
        .total-amount {
            font-size: 14px;
            font-weight: bold;
        }
        .notes {
            margin-top: 12px;
            padding: 10px;
            border: 1px solid #e5e7eb;
            background-color: #f9fafb;
        }
        .footer {
            margin-top: 24px;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <div class="logo">
                <img src="{{ public_path('images/logo.png') }}" alt="The Skin Studio">
            </div>
            <h1>The Skin Studio</h1>
            <div class="muted">Professional Invoice</div>
        </div>
        <div class="header-right">
            <div class="section-title">Invoice</div>
            <div class="invoice-meta">
                <div><strong>No:</strong> {{ $invoice->invoice_number }}</div>
                <div><strong>Date:</strong> {{ optional($invoice->invoice_date)->format('M j, Y') }}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Bill To</div>
        <table class="info-grid">
            <tr>
                <td><strong>{{ $invoice->customer->name ?? 'N/A' }}</strong></td>
            </tr>
            <tr>
                <td class="muted">Customer ID: {{ $invoice->customer->cust_id ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td>Mobile: {{ $invoice->customer->mobile_number ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td>Address: {{ $invoice->customer->address ?? 'N/A' }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Invoice Items</div>
        <table class="items">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Description</th>
                    <th class="text-right">Qty</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Measurement</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @forelse($lineItems as $item)
                    <tr>
                        <td>{{ $item['name'] }}</td>
                        <td>{{ $item['description'] }}</td>
                        <td class="text-right">{{ number_format($item['quantity'], 2) }}</td>
                        <td class="text-right">Rs. {{ number_format($item['unit_price'], 2) }}</td>
                        <td class="text-right">{{ strtoupper($item['measurement']) }}</td>
                        <td class="text-right">Rs. {{ number_format($item['total'], 2) }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="muted" style="text-align: center;">No items found</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="section">
        <table class="totals">
            <tr>
                <td></td>
                <td class="text-right">Subtotal</td>
                <td class="text-right">Rs. {{ number_format($invoice->subtotal ?? 0, 2) }}</td>
            </tr>
            <tr>
                <td></td>
                <td class="text-right">Discount</td>
                <td class="text-right">- Rs. {{ number_format($invoice->discount ?? 0, 2) }}</td>
            </tr>
            <tr>
                <td></td>
                <td class="text-right total-amount">Total</td>
                <td class="text-right total-amount">Rs. {{ number_format($invoice->total ?? 0, 2) }}</td>
            </tr>
        </table>
    </div>

    @if(!empty($invoice->notes))
        <div class="section notes">
            <div class="section-title">Notes</div>
            <div>{{ $invoice->notes }}</div>
        </div>
    @endif

    <div class="footer">
        Generated on {{ date('M j, Y \a\t g:i A') }} | Thank you for your business.
    </div>
</body>
</html>
