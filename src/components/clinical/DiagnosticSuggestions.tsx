'use client'

import React from 'react';
import { Card, Badge } from '@/components/nord';
import { AlertCircle } from 'lucide-react';

interface Diagnosis {
    condition: string;
    probability: 'high' | 'medium' | 'low';
    rationale: string;
    recommendedTests: string[];
}

interface DiagnosticSuggestionsProps {
    suggestions: Diagnosis[];
}

export function DiagnosticSuggestions({ suggestions }: DiagnosticSuggestionsProps) {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <Card className="border-l-4 border-l-nord12 dark:border-l-nord12">
            <Card.Header className="pb-2">
                <h3 className="text-lg flex items-center gap-2 text-nord12">
                    <AlertCircle className="w-5 h-5" />
                    Diagnostic Suggestions
                </h3>
            </Card.Header>
            <Card.Body>
                <div className="space-y-4">
                    {suggestions.map((diag, idx) => (
                        <div key={idx} className="border-b border-nord4 dark:border-nord2 last:border-0 pb-3 last:pb-0">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-nord0 dark:text-nord6">{diag.condition}</span>
                                <Badge variant={
                                    diag.probability === 'high' ? 'error' :
                                        diag.probability === 'medium' ? 'warning' : 'info'
                                }>
                                    {diag.probability.toUpperCase()} PROBABILITY
                                </Badge>
                            </div>
                            <p className="text-sm text-nord3 dark:text-nord4 mb-2">{diag.rationale}</p>

                            {diag.recommendedTests.length > 0 && (
                                <div className="mt-2">
                                    <span className="text-xs font-semibold text-nord3 dark:text-nord4 uppercase tracking-wide">Recommended Tests</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {diag.recommendedTests.map((test, i) => (
                                            <Badge key={i} variant="info" className="text-xs">
                                                {test}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
}
