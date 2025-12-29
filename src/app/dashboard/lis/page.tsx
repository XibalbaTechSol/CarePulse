'use client';

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { FlaskConical, TestTube, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/nord';
import { createLabOrder, getLabResults } from '@/lib/actions/hospital/lis';

export default function LISPage() {
    const [results, setResults] = useState<any[]>([]);

    const loadResults = async () => {
        const data = await getLabResults('mock-patient-id');
        setResults(data as any[]);
    };

    useEffect(() => {
        loadResults();
    }, []);

    const handleOrderLab = async () => {
        await createLabOrder({
            patientId: 'mock-patient-id',
            testCode: 'CMP',
            testName: 'Comprehensive Metabolic Panel',
            providerId: 'doc-1',
            priority: 'ROUTINE'
        });
        loadResults();
        alert('Lab ordered!');
    };

    return (
        <ModuleLayout
            moduleName="Lab Information System"
            moduleIcon={<FlaskConical className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Laboratory', href: '/dashboard/lis' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Order Panel */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Order Labs</h3>
                            <p className="text-sm text-nord3 dark:text-nord4">Select tests for John Doe</p>
                        </Card.Header>
                        <Card.Body className="space-y-4">
                            <Input placeholder="Search test catalog..." />
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="justify-start text-xs" onClick={handleOrderLab}>
                                    <TestTube className="w-3 h-3 mr-2" /> CBC
                                </Button>
                                <Button variant="outline" className="justify-start text-xs">
                                    <TestTube className="w-3 h-3 mr-2" /> BMP
                                </Button>
                                <Button variant="outline" className="justify-start text-xs">
                                    <TestTube className="w-3 h-3 mr-2" /> Lipid Panel
                                </Button>
                                <Button variant="outline" className="justify-start text-xs">
                                    <TestTube className="w-3 h-3 mr-2" /> HbA1c
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="bg-nord10/10 border-nord10">
                        <Card.Body className="p-4">
                            <h4 className="font-semibold text-nord10 mb-2">Lab Queue Status</h4>
                            <div className="text-sm text-nord10 space-y-1">
                                <div className="flex justify-between">
                                    <span>Core Lab</span>
                                    <span className="font-bold">Normal Load</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Microbiology</span>
                                    <span className="font-bold">BacLog: 2h</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Results Feed */}
                <div className="md:col-span-2">
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Recent Results</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-4">
                                {results.map(r => (
                                    <div key={r.id} className="border border-nord4 dark:border-nord2 rounded-lg p-4 flex flex-col gap-2 hover:bg-nord6 dark:hover:bg-nord1 relative overflow-hidden transition-colors">
                                        {r.priority === 'STAT' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-nord11" />}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-nord1 dark:text-nord6 flex items-center gap-2">
                                                    {r.testName}
                                                    {r.priority === 'STAT' && <Badge variant="error" className="h-5 text-[10px]">STAT</Badge>}
                                                </h4>
                                                <div className="text-xs text-nord3 dark:text-nord4">{new Date(r.orderDate).toLocaleString()}</div>
                                            </div>
                                            {r.status === 'COMPLETED' ? (
                                                <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" /> Resulted</Badge>
                                            ) : (
                                                <Badge variant="warning"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
                                            )}
                                        </div>

                                        {r.result && (
                                            <div className="bg-nord6 dark:bg-nord1 p-3 rounded text-sm font-mono mt-2 border border-nord4 dark:border-nord2 text-nord1 dark:text-nord6">
                                                {r.result}
                                            </div>
                                        )}

                                        {r.result && r.result.includes('High') && (
                                            <div className="flex items-center gap-2 text-xs text-nord11 font-medium mt-1">
                                                <AlertTriangle className="w-3 h-3" /> Abnormal value detected
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
