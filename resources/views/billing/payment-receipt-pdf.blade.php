<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Payment Receipt {{ $payment->payment_number }}</title>
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
        .payment-meta {
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
        .payment-box {
            border: 2px solid #059669;
            background-color: #d1fae5;
            padding: 16px;
            margin-top: 16px;
            text-align: center;
        }
        .payment-amount {
            font-size: 28px;
            font-weight: bold;
            color: #059669;
            margin: 8px 0;
        }
        table.summary {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }
        table.summary td {
            padding: 6px;
            border: 1px solid #e5e7eb;
        }
        .text-right {
            text-align: right;
        }
        .footer {
            margin-top: 32px;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
        }
        .paid-stamp {
            display: inline-block;
            border: 3px solid #059669;
            color: #059669;
            padding: 4px 12px;
            font-weight: bold;
            font-size: 16px;
            transform: rotate(-15deg);
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <div class="logo">
                <img src="{{ public_path('images/sayan-sita-logo.png') }}" alt="Sayan Sita Builders">
            </div>
            <h1>Sayan Sita Builders</h1>
            <div class="muted">Payment Receipt</div>
        </div>
        <div class="header-right">
            <div class="section-title">Receipt</div>
            <div class="payment-meta">
                <div><strong>No:</strong> {{ $payment->payment_number }}</div>
                <div><strong>Date:</strong> {{ optional($payment->payment_date)->format('M j, Y') }}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Customer Details</div>
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
        <div class="section-title">Invoice Reference</div>
        <table class="info-grid">
            <tr>
                <td><strong>Invoice Number:</strong> {{ $invoice->invoice_number }}</td>
            </tr>
            <tr>
                <td><strong>Invoice Date:</strong> {{ optional($invoice->invoice_date)->format('M j, Y') }}</td>
            </tr>
        </table>
    </div>

    <div class="payment-box">
        <div style="font-size: 14px; color: #047857;">PAYMENT RECEIVED</div>
        <div class="payment-amount">₹ {{ number_format($payment->amount, 2) }}</div>
        <div style="font-size: 11px; color: #065f46; margin-top: 4px;">
            via {{ strtoupper(str_replace('_', ' ', $payment->payment_method)) }}
        </div>
        @if($payment->transaction_reference)
            <div style="font-size: 10px; margin-top: 6px;">
                Reference: {{ $payment->transaction_reference }}
            </div>
        @endif
    </div>

    <div class="section">
        <div class="section-title">Payment Summary</div>
        <table class="summary">
            <tr>
                <td><strong>Total Invoice Amount</strong></td>
                <td class="text-right">₹ {{ number_format($invoice->total, 2) }}</td>
            </tr>
            <tr>
                <td><strong>Total Paid (Including This Payment)</strong></td>
                <td class="text-right" style="color: #059669;">₹ {{ number_format($invoice->amount_paid, 2) }}</td>
            </tr>
            <tr>
                <td><strong>Outstanding Balance</strong></td>
                <td class="text-right" style="{{ $invoice->due_amount > 0 ? 'color: #d97706;' : 'color: #059669;' }} font-weight: bold;">
                    @if($invoice->due_amount > 0)
                        ₹ {{ number_format($invoice->due_amount, 2) }}
                    @else
                        FULLY PAID
                    @endif
                </td>
            </tr>
        </table>
    </div>

    @if(!empty($payment->notes))
        <div class="section">
            <div class="section-title">Notes</div>
            <div style="padding: 8px; border: 1px solid #e5e7eb; background-color: #f9fafb;">
                {{ $payment->notes }}
            </div>
        </div>
    @endif

    <div class="footer">
        <div style="margin-bottom: 8px;">Generated on {{ date('M j, Y \a\t g:i A') }}</div>
        <div>Thank you for your payment!</div>
        <div style="margin-top: 4px; font-size: 9px;">This is a computer-generated receipt and does not require a signature.</div>
    </div>
</body>
</html>
