
import React from 'react';
import { Badge } from '@/components/nord';
import { Activity, Pill, FileText, Calendar, AlertCircle } from 'lucide-react';

interface TimelineEvent {
    id: string;
    type: 'vital' | 'medication' | 'note' | 'appointment' | 'alert';
    title: string;
    description?: string;
    timestamp: string; // ISO string
    provider?: string;
    metadata?: any;
}

interface TimelineViewProps {
    events: TimelineEvent[];
}

export function TimelineView({ events }: TimelineViewProps) {
    const getIcon = (type: TimelineEvent['type']) => {
        switch (type) {
            case 'vital': return <Activity className="w-4 h-4 text-nord10" />;
            case 'medication': return <Pill className="w-4 h-4 text-nord14" />;
            case 'note': return <FileText className="w-4 h-4 text-nord3" />;
            case 'appointment': return <Calendar className="w-4 h-4 text-nord15" />;
            case 'alert': return <AlertCircle className="w-4 h-4 text-nord11" />;
        }
    };

    return (
        <div className="relative border-l border-nord4 dark:border-nord2 ml-4 space-y-6">
            {events.map((event, index) => (
                <div key={event.id} className="relative pl-6">
                    <span className="absolute -left-2 top-2 bg-nord6 dark:bg-nord0 rounded-full p-1 border border-nord4 dark:border-nord2">
                        {getIcon(event.type)}
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                        <h4 className="text-sm font-semibold text-nord1 dark:text-nord6">{event.title}</h4>
                        <span className="text-xs text-nord3 dark:text-nord4">
                            {new Date(event.timestamp).toLocaleString()}
                        </span>
                    </div>
                    {event.description && (
                        <p className="text-sm text-nord2 dark:text-nord4 mb-2">{event.description}</p>
                    )}
                    {event.provider && (
                        <Badge variant="info" className="text-xs">{event.provider}</Badge>
                    )}
                </div>
            ))}
        </div>
    );
}
