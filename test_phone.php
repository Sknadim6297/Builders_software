<?php

// Test phone number validation

$phoneNumber = '6297616918';
$length = strlen($phoneNumber);
$isNumeric = ctype_digit($phoneNumber);
$regexMatch = preg_match('/^[0-9]+$/', $phoneNumber);

echo "Phone Number: $phoneNumber\n";
echo "Length: $length\n";
echo "Is exactly 10 digits: " . ($length === 10 ? 'YES' : 'NO') . "\n";
echo "Is numeric: " . ($isNumeric ? 'YES' : 'NO') . "\n";
echo "Regex match: " . ($regexMatch ? 'YES' : 'NO') . "\n";

// Test Laravel validation
require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Validator;

$data = ['mobile_number' => $phoneNumber];
$rules = ['mobile_number' => 'required|string|min:10|max:10|regex:/^[0-9]+$/'];

$validator = Validator::make($data, $rules);

echo "Laravel validation passes: " . ($validator->passes() ? 'YES' : 'NO') . "\n";

if ($validator->fails()) {
    echo "Validation errors:\n";
    foreach ($validator->errors()->all() as $error) {
        echo "- $error\n";
    }
}
