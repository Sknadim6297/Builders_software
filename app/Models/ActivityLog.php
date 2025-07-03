<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'log_name',
        'description',
        'subject_type',
        'subject_id',
        'event',
        'causer_type',
        'causer_id',
        'properties',
        'batch_uuid',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    public function causer(): MorphTo
    {
        return $this->morphTo();
    }

    public function getChangesAttribute()
    {
        if (!$this->properties) {
            return null;
        }

        return $this->properties['changes'] ?? null;
    }

    public function getOldValuesAttribute()
    {
        if (!$this->properties) {
            return null;
        }

        return $this->properties['old'] ?? null;
    }

    public function getNewValuesAttribute()
    {
        if (!$this->properties) {
            return null;
        }

        return $this->properties['attributes'] ?? null;
    }
}
