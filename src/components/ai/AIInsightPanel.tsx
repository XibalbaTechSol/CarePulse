'use client'

import React, { useState } from 'react';
import { Card, Button } from '@/components/nord';
import { Lightbulb, RefreshCw, MessageSquare } from 'lucide-react';

interface AIInsight {
    id: string;
    type: 'suggestion' | 'alert' | 'info';
    message: string;
    confidence?: number;
    source?: string;
    actionLabel?: string;
    onAction?: () => void;
}

interface AIInsightPanelProps {
    context?: {
        module?: string;
        patientId?: string;
        data?: any;
    };
}

export function AIInsightPanel({ context }: AIInsightPanelProps) {
    const [insights, setInsights] = useState<AIInsight[]>([
        {
            id: '1',
            type: 'suggestion',
            message: 'Patient shows signs of potential sepsis risk based on recent vitals.',
            confidence: 0.85,
            actionLabel: 'View Vitals',
        },
        {
            id: '2',
            type: 'info',
            message: 'Documentation for this visit is 80% complete.',
        }
    ]);

    return (
        <div className="flex flex-col h-full bg-nord6 dark:bg-nord0 border-l border-nord4 dark:border-nord2">
            <div className="p-4 border-b border-nord4 dark:border-nord2 bg-nord6 dark:bg-nord0 flex justify-between items-center sticky top-0">
                <h3 className="font-semibold text-sm flex items-center text-nord10">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    AI Assistant
                </h3>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <RefreshCw className="w-3 h-3" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {insights.map((insight) => (
                    <Card key={insight.id} className={`border-l-4 ${insight.type === 'alert' ? 'border-l-nord11 bg-nord11/10' :
                        insight.type === 'suggestion' ? 'border-l-nord15' : 'border-l-nord10'
                        }`}>
                        <Card.Body className="p-3">
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-xs font-bold uppercase ${insight.type === 'alert' ? 'text-nord11' :
                                    insight.type === 'suggestion' ? 'text-nord15' : 'text-nord10'
                                    }`}>
                                    {insight.type}
                                </span>
                                {insight.confidence && (
                                    <span className="text-xs text-nord3 dark:text-nord4">{(insight.confidence * 100).toFixed(0)}% conf</span>
                                )}
                            </div>
                            <p className="text-sm text-nord1 dark:text-nord6 mb-2">{insight.message}</p>
                            {insight.actionLabel && (
                                <Button size="sm" variant="outline" className="w-full text-xs h-7 bg-transparent border-nord4 dark:border-nord2">
                                    {insight.actionLabel}
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                ))}

                {/* Chat input placeholder */}
                <div className="mt-4 p-3 bg-nord6 dark:bg-nord0 rounded border border-nord4 dark:border-nord2 shadow-sm">
                    <div className="text-xs text-nord3 dark:text-nord4 mb-2">Ask about this patient...</div>
                    <div className="flex gap-2">
                        <input className="flex-1 text-sm bg-transparent border-none focus:ring-0 px-0 text-nord1 dark:text-nord6 placeholder:text-nord3/50" placeholder="Type a message..." />
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><MessageSquare className="w-4 h-4" /></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
