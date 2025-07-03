<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;

class ActivityLogger
{
    public static function log(string $description, array $options = [])
    {
        $user = Auth::user();
        
        $data = [
            'log_name' => $options['log_name'] ?? 'default',
            'description' => $description,
            'subject_type' => $options['subject_type'] ?? null,
            'subject_id' => $options['subject_id'] ?? null,
            'event' => $options['event'] ?? 'manual',
            'causer_type' => $user ? get_class($user) : null,
            'causer_id' => $user ? $user->id : null,
            'properties' => $options['properties'] ?? null,
            'batch_uuid' => $options['batch_uuid'] ?? null,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ];

        return ActivityLog::create($data);
    }

    public static function logModelEvent($model, string $event, array $oldValues = null, array $newValues = null)
    {
        $modelName = class_basename($model);
        $user = Auth::user();
        
        $description = self::generateDescription($event, $modelName, $model, $user);
        
        $properties = [];
        if ($oldValues) {
            $properties['old'] = $oldValues;
        }
        if ($newValues) {
            $properties['attributes'] = $newValues;
        }
        if ($oldValues && $newValues) {
            $properties['changes'] = array_diff_assoc($newValues, $oldValues);
        }

        return self::log($description, [
            'log_name' => strtolower($modelName),
            'subject_type' => get_class($model),
            'subject_id' => $model->id,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    public static function logAuth(string $event, $user = null)
    {
        $user = $user ?? Auth::user();
        $descriptions = [
            'login' => 'User logged in',
            'logout' => 'User logged out',
            'register' => 'User registered',
            'password_reset' => 'User reset password',
            'email_verified' => 'User verified email',
        ];

        return self::log($descriptions[$event] ?? "Auth event: {$event}", [
            'log_name' => 'auth',
            'subject_type' => $user ? get_class($user) : null,
            'subject_id' => $user ? $user->id : null,
            'event' => $event,
        ]);
    }

    public static function logAdminAction(string $action, string $description, $subject = null)
    {
        return self::log($description, [
            'log_name' => 'admin',
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id' => $subject ? $subject->id : null,
            'event' => $action,
        ]);
    }

    private static function generateDescription(string $event, string $modelName, $model, $user = null)
    {
        $userName = $user ? $user->name : 'System';
        $modelIdentifier = $model->name ?? $model->title ?? $model->email ?? "#{$model->id}";

        switch ($event) {
            case 'created':
                return "{$userName} created {$modelName}: {$modelIdentifier}";
            case 'updated':
                return "{$userName} updated {$modelName}: {$modelIdentifier}";
            case 'deleted':
                return "{$userName} deleted {$modelName}: {$modelIdentifier}";
            case 'restored':
                return "{$userName} restored {$modelName}: {$modelIdentifier}";
            case 'viewed':
                return "{$userName} viewed {$modelName}: {$modelIdentifier}";
            default:
                return "{$userName} performed {$event} on {$modelName}: {$modelIdentifier}";
        }
    }
}
