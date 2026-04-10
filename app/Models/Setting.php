<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'description'
    ];

    protected $table = 'settings';

    /**
     * Get setting by key
     */
    public static function getValue($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set setting value
     */
    public static function setValue($key, $value, $description = null)
    {
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'description' => $description]
        );
    }

    /**
     * Get all settings as key-value array
     */
    public static function getAll()
    {
        $settings = self::all();
        $result = [];
        foreach ($settings as $setting) {
            $result[$setting->key] = $setting->value;
        }
        return $result;
    }

    /**
     * Get company settings specifically
     */
    public static function getCompanySettings()
    {
        $companyLogo = self::getValue('company_logo', '/images/sayan-sita-logo.png');
        $companyAddresses = self::getCompanyAddresses();

        return [
            'company_name' => self::getValue('company_name', 'SAYAN SITA BUILDERS'),
            'company_address' => $companyAddresses[0] ?? self::getValue('company_address', 'Chalitapara, Ajodhya, Shyampur, Howrah – 711312'),
            'company_address_2' => $companyAddresses[1] ?? self::getValue('company_address_2', ''),
            'company_addresses' => $companyAddresses,
            'company_phone_1' => self::getValue('company_phone_1', '6289249399'),
            'company_phone_2' => self::getValue('company_phone_2', '9609142692'),
            'company_phone_3' => self::getValue('company_phone_3', '9732771768'),
            'company_email' => self::getValue('company_email', ''),
            'company_gstin' => self::getValue('company_gstin', '19DJZPM9953H1ZZ'),
            'company_logo' => self::normalizeAssetUrl($companyLogo),
        ];
    }

    /**
     * Return company addresses as a normalized list.
     * Falls back to legacy company_address and company_address_2 settings.
     */
    public static function getCompanyAddresses(): array
    {
        $stored = self::getValue('company_addresses', '');
        $addresses = [];

        if (!empty($stored)) {
            $decoded = json_decode($stored, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $addresses = $decoded;
            }
        }

        if (empty($addresses)) {
            $addresses = [
                self::getValue('company_address', 'Chalitapara, Ajodhya, Shyampur, Howrah – 711312'),
                self::getValue('company_address_2', ''),
            ];
        }

        return array_values(array_filter(array_map(function ($address) {
            return trim((string) $address);
        }, $addresses), function ($address) {
            return $address !== '';
        }));
    }

    /**
     * Normalize saved logo path to a browser-safe URL.
     */
    public static function normalizeAssetUrl(?string $path): string
    {
        if (empty($path)) {
            return asset('images/sayan-sita-logo.png');
        }

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        if (Str::startsWith($path, ['storage/', '/storage/'])) {
            return asset(ltrim($path, '/'));
        }

        if (Str::startsWith($path, '/')) {
            return asset(ltrim($path, '/'));
        }

        return asset($path);
    }
}
