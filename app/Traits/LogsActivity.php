<?php

namespace App\Traits;

use App\Services\ActivityLogger;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        static::created(function ($model) {
            if (static::shouldLogEvent('created')) {
                ActivityLogger::logModelEvent($model, 'created', null, $model->getAttributes());
            }
        });

        static::updated(function ($model) {
            if (static::shouldLogEvent('updated')) {
                $oldValues = $model->getOriginal();
                $newValues = $model->getAttributes();
                
                // Only log if there are actual changes
                if (array_diff_assoc($newValues, $oldValues)) {
                    ActivityLogger::logModelEvent($model, 'updated', $oldValues, $newValues);
                }
            }
        });

        static::deleted(function ($model) {
            if (static::shouldLogEvent('deleted')) {
                ActivityLogger::logModelEvent($model, 'deleted', $model->getAttributes());
            }
        });
    }

    protected static function shouldLogEvent(string $event): bool
    {
        // Don't log if no user is authenticated (e.g., during seeding)
        if (!Auth::check()) {
            return false;
        }

        // Check if this specific event should be logged
        $eventsToLog = static::getEventsToLog();
        return in_array($event, $eventsToLog);
    }

    protected static function getEventsToLog(): array
    {
        return ['created', 'updated', 'deleted'];
    }
}
