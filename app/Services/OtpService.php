<?php

namespace App\Services;

use App\Models\OtpVerification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class OtpService
{
    public function sendOtp($email, $action, $metadata = null)
    {
        try {
            $verification = OtpVerification::generateOtp($email, $action, $metadata);
            
            // Send email with OTP
            Mail::send('emails.otp-verification', [
                'otp' => $verification->otp,
                'action' => $action,
                'expires_at' => $verification->expires_at
            ], function ($message) use ($email, $action) {
                $message->to($email)
                    ->subject('OTP Verification Required - ' . ucwords(str_replace('_', ' ', $action)));
            });

            Log::info("OTP sent successfully", [
                'email' => $email,
                'action' => $action,
                'otp_id' => $verification->id,
                'otp' => config('app.debug') ? $verification->otp : '******' // Show OTP in debug mode
            ]);

            $response = [
                'success' => true,
                'message' => 'OTP sent to your email address',
                'otp_id' => $verification->id
            ];

            // In development mode, include the OTP in the response for testing
            if (config('app.debug') && config('mail.default') === 'log') {
                $response['debug_otp'] = $verification->otp;
                $response['message'] .= '. For testing: ' . $verification->otp;
            }

            return $response;
        } catch (\Exception $e) {
            Log::error("Failed to send OTP", [
                'email' => $email,
                'action' => $action,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to send OTP. Please try again.'
            ];
        }
    }

    public function verifyOtp($email, $otp, $action)
    {
        $verification = OtpVerification::verifyOtp($email, $otp, $action);
        
        if (!$verification) {
            return [
                'success' => false,
                'message' => 'Invalid or expired OTP'
            ];
        }

        return [
            'success' => true,
            'message' => 'OTP verified successfully',
            'metadata' => $verification->metadata
        ];
    }
}
