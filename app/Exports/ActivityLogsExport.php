<?php

namespace App\Exports;

use App\Models\ActivityLog;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ActivityLogsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $query;

    public function __construct($query)
    {
        $this->query = $query;
    }

    public function collection()
    {
        return $this->query->with(['causer', 'subject'])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Category',
            'Event',
            'Description',
            'User',
            'User Email',
            'Subject Type',
            'Subject ID',
            'IP Address',
            'User Agent',
            'Date/Time',
            'Changes'
        ];
    }

    public function map($log): array
    {
        return [
            $log->id,
            $log->log_name,
            $log->event,
            $log->description,
            $log->causer ? $log->causer->name : 'System',
            $log->causer ? $log->causer->email : '',
            $log->subject_type ? class_basename($log->subject_type) : '',
            $log->subject_id,
            $log->ip_address,
            $log->user_agent,
            $log->created_at->format('Y-m-d H:i:s'),
            $log->properties ? json_encode($log->properties) : ''
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1 => ['font' => ['bold' => true]],
        ];
    }
}
