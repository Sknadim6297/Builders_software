<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>OTP Verification Required</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .otp-box {
            background: #f8f9fa;
            border: 2px dashed #007bff;
            border-radius: 10px;
            text-align: center;
            padding: 20px;
            margin: 20px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #007bff;
            letter-spacing: 5px;
            margin: 10px 0;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #007bff; margin: 0;">🔐 OTP Verification Required</h1>
            <p style="margin: 10px 0 0 0; color: #666;">Billing System - Security Verification</p>
        </div>

        <div style="margin: 20px 0;">
            <h2>Action Requires Verification</h2>
            <p>You have requested to perform the following action: <strong>{{ ucwords(str_replace('_', ' ', $action)) }}</strong></p>
            <p>For security purposes, please verify your identity using the OTP code below:</p>
        </div>

        <div class="otp-box">
            <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
            <div class="otp-code">{{ $otp }}</div>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This code is valid for 10 minutes</p>
        </div>

        <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul style="margin: 10px 0;">
                <li>This OTP is for activity log deletion verification</li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this action, please ignore this email</li>
                <li>The code expires at: <strong>{{ $expires_at->format('M j, Y g:i A') }}</strong></li>
            </ul>
        </div>

        <div style="margin: 20px 0;">
            <p><strong>What happens next?</strong></p>
            <ol>
                <li>Return to the Billing System</li>
                <li>Enter this OTP code when prompted</li>
                <li>Your requested action will be completed</li>
            </ol>
        </div>

        <div class="footer">
            <p>This email was sent automatically by the Billing System.</p>
            <p>If you have any questions, please contact your system administrator.</p>
            <p style="margin-top: 10px;">
                <strong>Billing System</strong> | 
                Generated on {{ now()->format('M j, Y g:i A') }}
            </p>
        </div>
    </div>
</body>
</html>
