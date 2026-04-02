<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        body {
            font-family: "DejaVu Sans", Helvetica, Arial, sans-serif;
            color: #1f2933;
            margin: 10px;
            font-size: 11px;
            background: #f3f6fb;
        }
        .page {
            background: #ffffff;
            border: 1px solid #dbe4f0;
        }
        .top-bar {
            height: 10px;
            background: #0f2a43;
        }
        .header {
            display: table;
            width: 100%;
            margin-bottom: 14px;
            padding: 12px 14px 8px 14px;
            border-bottom: 1px solid #dbe4f0;
            box-sizing: border-box;
        }
        .header-left,
        .header-right {
            display: table-cell;
            vertical-align: top;
        }
        .header-left {
            width: 68%;
        }
        .header-right {
            width: 32%;
            text-align: right;
        }
        h1 {
            margin: 4px 0 0 0;
            font-size: 20px;
            letter-spacing: 0.4px;
            color: #0f2a43;
        }
        .muted {
            color: #6b7280;
        }
        .invoice-meta {
            margin-top: 6px;
        }
        .section {
            margin-top: 12px;
            padding: 0 12px;
            box-sizing: border-box;
        }
        .section-title {
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            margin-bottom: 6px;
            color: #0f2a43;
        }
        .info-grid {
            width: 100%;
            border-collapse: collapse;
        }
        .info-grid td {
            padding: 3px 0;
        }
        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
            table-layout: fixed;
        }
        table.items th,
        table.items td {
            border: 1px solid #d9e2ec;
            padding: 5px 4px;
            vertical-align: top;
            word-wrap: break-word;
            overflow-wrap: anywhere;
        }
        table.items th {
            background-color: #0f2a43;
            color: #ffffff;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        table.items tbody tr:nth-child(even) td {
            background: #f8fbff;
        }
        .chip {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: bold;
            background: #e8f3ff;
            color: #0f4c81;
        }
        .card {
            border: 1px solid #dbe4f0;
            background: #ffffff;
            border-radius: 10px;
            padding: 10px;
        }
        .text-right {
            text-align: right;
        }
        .totals {
            margin-top: 12px;
            width: 100%;
            border-collapse: collapse;
        }
        .totals td {
            padding: 5px 0;
        }
        .total-amount {
            font-size: 14px;
            font-weight: bold;
            color: #0f2a43;
        }
        .notes {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #dbe4f0;
            background-color: #f8fbff;
            border-radius: 10px;
        }
        .footer {
            margin-top: 14px;
            padding: 0 12px 12px 12px;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
        }
        .summary-grid {
            width: 100%;
            border-collapse: collapse;
        }
        .summary-grid td {
            vertical-align: top;
            width: 50%;
        }
        .company-name {
            font-size: 14px;
            font-weight: bold;
            color: #0f2a43;
            margin-bottom: 3px;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="top-bar"></div>

        <div class="header">
            <div class="header-left">
                <div class="section-title" style="margin-bottom: 2px;">Tax Invoice</div>
                <div class="company-name">Sayan Sita Builders</div>
                <div class="muted" style="margin-top: 3px;">CHALITAPARA, AJODHYA, SHYAMPUR, HOWRAH, 711312</div>
                <div class="muted">GSTIN/UIN: 19DJZPM9953H1ZZ | STATE NAME: WEST BENGAL, CODE: 19</div>
                <div class="muted">CONTACT: 6289249399 / 9609142692 / 9732771768 | EMAIL: sayansitabui912@gmail.com</div>
            </div>
            <div class="header-right">
                <div class="card" style="display: inline-block; min-width: 190px; text-align: left;">
                    <div style="font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Invoice Summary</div>
                    <div style="margin-top: 6px;"><strong>Invoice Date:</strong> {{ optional($invoice->invoice_date)->format('d/m/Y') }}</div>
                    <div style="margin-top: 4px;"><strong>Invoice No:</strong> {{ $invoice->invoice_number }}</div>
                    <div style="margin-top: 4px;"><strong>Status:</strong> <span class="chip">{{ strtoupper($invoice->payment_status ?? 'N/A') }}</span></div>
                </div>
            </div>
        </div>

        <div class="section">
            <table class="summary-grid">
                <tr>
                    <td style="padding-right: 6px; width: 52%;">
                        <div class="card">
                            <div class="section-title">Bill To</div>
                            <table class="info-grid">
                                <tr><td><strong>{{ $invoice->customer->name ?? 'N/A' }}</strong></td></tr>
                                <tr><td>{{ $invoice->customer->address ?? 'N/A' }}</td></tr>
                                <tr><td>Mobile: {{ $invoice->customer->mobile_number ?? 'N/A' }}</td></tr>
                                <tr><td>GSTIN/UIN: {{ $invoice->customer->gstin ?? 'N/A' }}</td></tr>
                                <tr><td>Email: {{ $invoice->customer->email ?? 'N/A' }}</td></tr>
                            </table>
                            @if(!empty($buyer_logo) && file_exists(public_path('storage/' . $buyer_logo)))
                                <div style="margin-top: 10px; border-top: 1px dashed #dbe4f0; padding-top: 10px;">
                                    <img src="{{ public_path('storage/' . $buyer_logo) }}" alt="Buyer Logo" style="max-height: 70px; max-width: 100%; object-fit: contain;" />
                                </div>
                            @endif
                        </div>
                    </td>
                    <td style="padding-left: 6px; width: 48%;">
                        <div class="card">
                            <div class="section-title">Invoice Details</div>
                            <table class="info-grid">
                                <tr><td><strong>Gross Total</strong></td><td class="text-right">₹ {{ number_format($gross_total ?? $invoice->subtotal ?? 0, 2) }}</td></tr>
                                <tr><td><strong>Delivery Charges</strong></td><td class="text-right">₹ {{ number_format($delivery_charges ?? 0, 2) }}</td></tr>
                                <tr><td><strong>Discount @ {{ number_format($invoice_discount_percent ?? 0, 2) }}%</strong></td><td class="text-right">- ₹ {{ number_format($invoice->discount ?? 0, 2) }}</td></tr>
                                <tr><td><strong>CGST @ {{ number_format(($invoice->cgst_percentage ?? (($invoice->gst_percentage ?? 0) / 2)), 2) }}%</strong></td><td class="text-right">₹ {{ number_format($cgst ?? 0, 2) }}</td></tr>
                                <tr><td><strong>SGST @ {{ number_format(($invoice->sgst_percentage ?? (($invoice->gst_percentage ?? 0) / 2)), 2) }}%</strong></td><td class="text-right">₹ {{ number_format($sgst ?? 0, 2) }}</td></tr>
                            </table>
                            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #dbe4f0;">
                                <div class="total-amount" style="display: table; width: 100%;">
                                    <div style="display: table-cell;">Net Payable</div>
                                    <div style="display: table-cell; text-align: right;">₹ {{ number_format($net_value ?? $invoice->total ?? 0, 2) }}</div>
                                </div>
                                <div style="margin-top: 8px; font-size: 10px; color: #6b7280;">{{ $amount_in_words ?? '' }}</div>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="card">
                <div class="section-title">Invoice Items</div>
                <table class="items">
                    <thead>
                        <tr>
                            <th style="width: 5%;">S.No</th>
                            <th style="width: 30%;">Particular Item</th>
                            <th style="width: 9%;">Unit</th>
                            <th style="width: 11%;">HSN Code</th>
                            <th class="text-right" style="width: 8%;">Qty</th>
                            <th class="text-right" style="width: 14%;">Rate/Unit</th>
                            <th class="text-right" style="width: 10%;">Discount</th>
                            <th class="text-right" style="width: 13%;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($lineItems as $index => $item)
                            <tr>
                                <td>{{ $index + 1 }}</td>
                                <td>
                                    <strong>{{ $item['name'] }}</strong>
                                    @if(!empty($item['description']) && $item['description'] !== '-')
                                        <div class="muted" style="font-size: 9px; margin-top: 2px;">{{ $item['description'] }}</div>
                                    @endif
                                </td>
                                <td>{{ $item['unit'] ?? '-' }}</td>
                                <td>{{ $item['hsn_code'] ?? '-' }}</td>
                                <td class="text-right">{{ number_format($item['quantity'], 2) }}</td>
                                <td class="text-right">₹ {{ number_format($item['unit_price'], 2) }}</td>
                                <td class="text-right">
                                    @php
                                        $lineDiscount = isset($item['discount']) ? (float) $item['discount'] : null;
                                    @endphp
                                    {{ $lineDiscount !== null && $lineDiscount > 0 ? number_format($lineDiscount, 2) . '%' : (($invoice_discount_percent ?? 0) > 0 ? number_format($invoice_discount_percent, 2) . '%' : '-') }}
                                </td>
                                <td class="text-right"><strong>₹ {{ number_format($item['total'], 2) }}</strong></td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" class="muted" style="text-align: center; padding: 14px;">No items found</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if(!empty($invoice->payments) && count($invoice->payments) > 0)
            <div class="section">
                <div class="card">
                    <div class="section-title">Payment History</div>
                    <table class="items">
                        <thead>
                            <tr>
                                <th>Payment No.</th>
                                <th>Date</th>
                                <th>Method</th>
                                <th>Reference</th>
                                <th class="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($invoice->payments as $payment)
                                <tr>
                                    <td>{{ $payment->payment_number }}</td>
                                    <td>{{ optional($payment->payment_date)->format('M j, Y') }}</td>
                                    <td>{{ strtoupper(str_replace('_', ' ', $payment->payment_method)) }}</td>
                                    <td>{{ $payment->transaction_reference ?? '-' }}</td>
                                    <td class="text-right">₹ {{ number_format($payment->amount, 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        @endif

        @if(!empty($invoice->notes))
            <div class="section">
                <div class="notes">
                    <div class="section-title">Notes</div>
                    <div style="line-height: 1.5;">{{ $invoice->notes }}</div>
                </div>
            </div>
        @endif

        <div class="section">
            <div class="notes">
                <div class="section-title">Payment Terms & Conditions</div>
                <div style="font-size: 10px; line-height: 1.5; white-space: pre-line;">{{ $payment_tc ?? 'N/A' }}</div>
                <table style="width: 100%; margin-top: 10px; border-collapse: collapse; font-size: 10px;">
                    <tr>
                        <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                            <strong>Payment Mode:</strong> {{ $payment_mode ?? 'CREDIT' }}<br>
                            <strong>Godown:</strong> {{ $godown ?? 'CHALITAPARA' }}<br>
                            <strong>Transport:</strong> {{ $transport ?? 'VAN (SELF)' }}
                        </td>
                        <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                            <strong>Bank:</strong> {{ $bank ?? 'Development Bank of Singapore' }}<br>
                            <strong>Account No:</strong> {{ $account_no ?? '8828210000007429' }}<br>
                            <strong>IFSC:</strong> {{ $ifsc ?? 'DBSS0IN0828' }}<br>
                            <strong>Branch:</strong> {{ $branch ?? 'KOLKATA MAIN BRANCH' }}<br>
                            <strong>Account Type:</strong> {{ $account_type ?? 'Trade & Forex CURRENT ACCOUNT' }}
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="section">
            <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
                <tr>
                    <td style="width: 50%; text-align: center; padding: 12px 10px; border: 1px solid #dbe4f0; font-weight: bold; border-radius: 10px;">CUSTOMER'S SEAL & SIGNATURE</td>
                    <td style="width: 50%; text-align: center; padding: 12px 10px; border: 1px solid #dbe4f0; font-weight: bold; border-radius: 10px;">AUTHORISED SIGNATORY</td>
                </tr>
            </table>
        </div>

        <div class="footer">
            Generated on {{ date('M j, Y \a\t g:i A') }} | Thank you for your business.
        </div>
    </div>
</body>
</html>
