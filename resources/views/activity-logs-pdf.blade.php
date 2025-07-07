<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Activity Logs Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #a47db5;
            padding-bottom: 10px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #a47db5;
        }
        .subtitle {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }
        .meta-info {
            font-size: 10px;
            color: #888;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            vertical-align: top;
        }
        th {
            background-color: #a47db5;
            color: white;
            font-weight: bold;
            font-size: 11px;
        }
        td {
            font-size: 10px;
        }
        .badge {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        .badge-created {
            background-color: #d4edda;
            color: #155724;
        }
        .badge-updated {
            background-color: #cce5ff;
            color: #004085;
        }
        .badge-deleted {
            background-color: #f8d7da;
            color: #721c24;
        }
        .badge-login {
            background-color: #e2e3ff;
            color: #383d41;
        }
        .badge-logout {
            background-color: #f1f3f4;
            color: #383d41;
        }
        .changes {
            max-width: 200px;
            word-wrap: break-word;
            font-size: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('images/logo.png') }}" alt="The Skin Studio" style="height: 60px; width: auto; margin-bottom: 10px;">
        <div class="title">Activity Logs Report</div>
        <div class="subtitle">The Skin Studio - User & Admin Activity Monitoring</div>
        <div class="meta-info">
            Generated on: {{ now()->format('F j, Y \a\t g:i A') }} | 
            Total Records: {{ count($logs) }}
            @if(!empty($filters))
                | Filtered Results
            @endif
        </div>
    </div>

    @if(!empty($filters))
        <div style="margin-bottom: 20px; padding: 10px; background-color: #f8f9fa; border-left: 4px solid #007bff;">
            <strong>Applied Filters:</strong>
            @if(!empty($filters['search']))
                Search: "{{ $filters['search'] }}" |
            @endif
            @if(!empty($filters['log_name']))
                Category: {{ ucfirst($filters['log_name']) }} |
            @endif
            @if(!empty($filters['event']))
                Event: {{ ucfirst($filters['event']) }} |
            @endif
            @if(!empty($filters['date_from']))
                From: {{ $filters['date_from'] }} |
            @endif
            @if(!empty($filters['date_to']))
                To: {{ $filters['date_to'] }} |
            @endif
        </div>
    @endif

    <table>
        <thead>
            <tr>
                <th width="5%">ID</th>
                <th width="8%">Category</th>
                <th width="8%">Event</th>
                <th width="25%">Description</th>
                <th width="10%">User</th>
                <th width="8%">Subject</th>
                <th width="8%">IP Address</th>
                <th width="12%">Date/Time</th>
                <th width="16%">Changes</th>
            </tr>
        </thead>
        <tbody>
            @foreach($logs as $log)
                <tr>
                    <td>{{ $log->id }}</td>
                    <td>
                        @if($log->log_name)
                            <span class="badge">{{ ucfirst($log->log_name) }}</span>
                        @endif
                    </td>
                    <td>
                        <span class="badge badge-{{ $log->event }}">{{ ucfirst($log->event) }}</span>
                    </td>
                    <td>{{ $log->description }}</td>
                    <td>
                        {{ $log->causer ? $log->causer->name : 'System' }}
                        @if($log->causer && $log->causer->email)
                            <br><small>{{ $log->causer->email }}</small>
                        @endif
                    </td>
                    <td>
                        @if($log->subject_type)
                            {{ class_basename($log->subject_type) }} #{{ $log->subject_id }}
                        @endif
                    </td>
                    <td>{{ $log->ip_address }}</td>
                    <td>{{ $log->created_at->format('Y-m-d H:i:s') }}</td>
                    <td class="changes">
                        @if($log->properties)
                            {{ json_encode($log->properties, JSON_PRETTY_PRINT) }}
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #666;">
        <p>This report was generated automatically by the Billing System Activity Logger.</p>
        <p>For questions about this report, please contact your system administrator.</p>
    </div>
</body>
</html>
