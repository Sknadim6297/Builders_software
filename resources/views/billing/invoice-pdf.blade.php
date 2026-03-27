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
            <div class="section-title">GST INVOICE &nbsp;&nbsp; DUPLICATE</div>
            <div class="muted">SUBJECT TO EXCLUSIVE JURISDICTION AT HOWRAH</div>
            <h1 style="margin-top: 8px;">Sayan Sita Builders</h1>
            <div class="muted">CHALITAPARA, AJODHYA, SHYAMPUR, HOWRAH, 711312</div>
            <div class="muted">GSTIN/UIN: 19DJZPM9953H1ZZ | STATE NAME: WEST BENGAL, CODE: 19</div>
            <div class="muted">CONTACT: 6289249399 / 9609142692 / 9732771768 | EMAIL: sayansitabui912@gmail.com</div>
        </div>
        <div class="header-right" style="text-align: right;">
            <div><strong>Invoice Date:</strong> {{ optional($invoice->invoice_date)->format('d/m/Y') }}</div>
            <div><strong>Invoice No:</strong> {{ $invoice->invoice_number }}</div>
            <div><strong>Payment Status:</strong> {{ ucfirst($invoice->payment_status ?? 'N/A') }}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Buyer (Bill To)</div>
        @if(!empty($buyer_logo))
            <img src="{{ public_path('storage/' . $buyer_logo) }}" alt="Buyer Logo" style="max-height: 120px; margin-bottom: 8px; object-fit: contain;" />
        @endif
        <table class="info-grid">
            <tr>
                <td><strong>{{ $invoice->customer->name ?? 'N/A' }}</strong></td>
            </tr>
            <tr>
                <td>{{ $invoice->customer->address ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td>Mobile: {{ $invoice->customer->mobile_number ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td>GSTIN/UIN: {{ $invoice->customer->gstin ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td>Email: {{ $invoice->customer->email ?? 'N/A' }}</td>
            </tr>
        </table>
        <p class="muted" style="margin-top: 10px; font-size: 11px;">We hereby certify that the amount indicated in tax invoice representing the price actually charged by us and that there is no additional consideration flowing directly or indirectly from such sales over & above what has been declared.</p>
    </div>

    <div class="section">
        <div class="section-title">Invoice Items</div>
        <table class="items">
            <thead>
                <tr>
                    <th>S.NO</th>
                    <th>PARTICULAR ITEM</th>
                    <th>UNIT</th>
                    <th>HSN CODE</th>
                    <th class="text-right">QTY</th>
                    <th class="text-right">RATE/UNIT</th>
                    <th class="text-right">DISCOUNT</th>
                    <th class="text-right">AMOUNTS</th>
                </tr>
            </thead>
            <tbody>
                @forelse($lineItems as $index => $item)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $item['name'] }}</td>
                        <td>{{ $item['unit'] ?? '-' }}</td>
                        <td>{{ $item['hsn_code'] ?? '-' }}</td>
                        <td class="text-right">{{ number_format($item['quantity'], 2) }}</td>
                        <td class="text-right">₹ {{ number_format($item['unit_price'], 2) }}</td>
                        <td class="text-right">{{ number_format($item['discount'] ?? ($invoice_discount_percent ?? 0), 2) }}%</td>
                        <td class="text-right">₹ {{ number_format($item['total'], 2) }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8" class="muted" style="text-align: center;">No items found</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="section">
        <table class="totals">
            <tr>
                <td></td>
                <td class="text-right">Gross Total</td>
                <td class="text-right">₹ {{ number_format($gross_total ?? $invoice->subtotal ?? 0, 2) }}</td>
            </tr>
            <tr>
                <td></td>
                <td class="text-right">Delivery Charges</td>
                <td class="text-right">₹ {{ number_format($delivery_charges ?? 0, 2) }}</td>
            </tr>
            <tr>
                <td></td>
                <td class="text-right">Discount @ {{ number_format($invoice_discount_percent ?? 0, 2) }}%</td>
                <td class="text-right">- ₹ {{ number_format($invoice->discount ?? 0, 2) }}</td>
            </tr>
            <tr>
                <td></td>
                <td class="text-right">C G.S.T. @ {{ number_format(($invoice->cgst_percentage ?? (($invoice->gst_percentage ?? 0) / 2)), 2) }}%</td>
                <td class="text-right">₹ {{ number_format($cgst ?? 0, 2) }}</td>
            </tr>
            <tr>
                <td></td>
                <td class="text-right">S G.S.T @ {{ number_format(($invoice->sgst_percentage ?? (($invoice->gst_percentage ?? 0) / 2)), 2) }}%</td>
                <td class="text-right">₹ {{ number_format($sgst ?? 0, 2) }}</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
                <td></td>
                <td class="text-right total-amount">Net Value</td>
                <td class="text-right total-amount">₹ {{ number_format($net_value ?? $invoice->total ?? 0, 2) }}</td>
            </tr>
        </table>
        <p style="margin-top: 8px; font-size: 12px;">{{ $amount_in_words ?? '' }}</p>
    </div>

    @if(!empty($invoice->payments) && count($invoice->payments) > 0)
        <div class="section">
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
    @endif

    @if(!empty($invoice->notes))
        <div class="section notes">
            <div class="section-title">Notes</div>
            <div>{{ $invoice->notes }}</div>
        </div>
    @endif

    <div class="section notes" style="margin-top: 12px;">
        <div class="section-title">Payment T&C</div>
        <div style="font-size: 11px; line-height: 1.4;">
            Billing date: From 5 days between payment. Late payment charges apply as below:
            <br>After 7 days — 1% Debit Note
            <br>After 14 days — 2% Debit Note
            <br>After 20 days — 2.5% Debit Note
            <br>After 24 days — 2.7% Debit Note
            <br>After 30 days — 3% Debit Note
            <br>After 2 months — 4% Debit Note
            <br>After 3 months — 4.5% Debit Note
            <br>Interest @18% p.a. if not paid within 5 days. Any dispute regarding quality/quantity must be raised within 5 days of supply. No claim afterward.
        </div>
        <div style="margin-top: 8px; font-size: 11px;">
            <strong>Payment Mode:</strong> CREDIT<br>
            <strong>GODOWN:</strong> CHALITAPARA<br>
            <strong>TRANSPORT:</strong> VAN (SELF)<br>
            <strong>BANK:</strong> Development Bank of Singapore<br>
            <strong>ACCOUNT NO:</strong> 8828210000007429<br>
            <strong>IFSC:</strong> DBSS0IN0828<br>
            <strong>BRANCH:</strong> KOLKATA MAIN BRANCH<br>
            <strong>ACCOUNT TYPE:</strong> Trade & Forex CURRENT ACCOUNT
        </div>
    </div>

    <div style="margin-top: 20px; display: flex; justify-content: space-between;">
        <div style="font-weight: bold;">CUSTOMER'S SEAL & SIGNATURE</div>
        <div style="font-weight: bold;">AUTHORISED SIGNATORY</div>
    </div>

    <div class="footer">
        Generated on {{ date('M j, Y \a\t g:i A') }} | Thank you for your business.
    </div>
</body>
</html>
