<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class OtpVerification extends Model
{
    protected $fillable = [
        'email',
        'otp',
        'action',
        'metadata',
        'expires_at',
        'is_used'
    ];

    protected $casts = [
        'metadata' => 'array',
        'expires_at' => 'datetime',
        'is_used' => 'boolean'
    ];

    public function isExpired()
    {
        return $this->expires_at->isPast();
    }

    public function isValid()
    {
        return !$this->is_used && !$this->isExpired();
    }

    public static function generateOtp($email, $action, $metadata = null)
    {
        // Generate 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Clean up old OTPs for this email and action
        self::where('email', $email)
            ->where('action', $action)
            ->delete();
        
        return self::create([
            'email' => $email,
            'otp' => $otp,
            'action' => $action,
            'metadata' => $metadata,
            'expires_at' => Carbon::now()->addMinutes(10), // 10 minutes expiry
            'is_used' => false
        ]);
    }

    public static function verifyOtp($email, $otp, $action)
    {
        $verification = self::where('email', $email)
            ->where('otp', $otp)
            ->where('action', $action)
            ->where('is_used', false)
            ->first();

        if (!$verification || $verification->isExpired()) {
            return false;
        }

        $verification->update(['is_used' => true]);
        return $verification;
    }
}
