'use client'

import React, { useState } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { BrainCircuit, Search, Loader2 } from 'lucide-react';
import { Button, Input, Card } from '@/components/nord';
import { DiagnosticSuggestions } from '@/components/clinical/DiagnosticSuggestions';
import { getDifferentialDiagnosis } from '@/lib/actions/clinical/cdss';

export default function CDSSPage() {
    const [symptoms, setSymptoms] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const handleAnalyze = async () => {
        if (!symptoms) return;
        setIsLoading(true);
        try {
            // Mock input data for demo
            const result = await getDifferentialDiagnosis({
                symptoms: symptoms.split(',').map(s => s.trim()),
                age: 45,
                gender: 'male',
                history: 'Hypertension',
            });

            if (result.success) {
                setSuggestions(result.diagnosis || []);
            }
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ModuleLayout
            moduleName="Clinical Decision Support"
            moduleIcon={<BrainCircuit className="w-5 h-5" />}
            breadcrumbs={[{ label: 'CDSS', href: '/dashboard/clinical/cdss' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Input Column */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord0 dark:text-nord6">Case Analysis</h3>
                            <p className="text-sm text-nord3 dark:text-nord4">Enter patient symptoms and data</p>
                        </Card.Header>
                        <Card.Body className="space-y-4">
                            <Input
                                label="Symptoms (comma separated)"
                                placeholder="e.g. chest pain, shortness of breath..."
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                            />
                            <Button
                                className="w-full"
                                onClick={handleAnalyze}
                                disabled={isLoading || !symptoms}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <BrainCircuit className="w-4 h-4 mr-2" /> Analyze Case
                                    </>
                                )}
                            </Button>
                        </Card.Body>
                    </Card>

                    <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                        <Card.Body>
                            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Active Protocols</h4>
                            <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-400">
                                <li>• Sepsis Early Detection</li>
                                <li>• Stroke Pathway</li>
                                <li>• STEMI Protocol</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </div>

                {/* Results Column */}
                <div className="md:col-span-2 space-y-6">
                    {suggestions.length > 0 ? (
                        <DiagnosticSuggestions suggestions={suggestions} />
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-nord3 dark:text-nord4 border-2 border-dashed border-nord4 dark:border-nord2 rounded-lg">
                            <BrainCircuit className="w-12 h-12 mb-4 opacity-20" />
                            <p>Enter patient data to generate diagnostic suggestions</p>
                        </div>
                    )}
                </div>
            </div>
        </ModuleLayout>
    );
}
