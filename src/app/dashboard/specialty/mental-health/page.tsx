
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Brain, ClipboardList, UserCheck, MessageSquare } from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/nord';
import { getAssessments } from '@/lib/actions/specialty/mental-health';

export default function MentalHealthPage() {
    const [assessments, setAssessments] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getAssessments('mock-p');
        setAssessments(data);
    };

    return (
        <ModuleLayout
            moduleName="Mental Health"
            moduleIcon={<Brain className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Mental Health', href: '/dashboard/specialty/mental-health' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Assessment Panel */}
                <div className="md:col-span-1">
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">New Assessment</h3>
                        </Card.Header>
                        <Card.Body className="space-y-4">
                            <Input placeholder="Patient Name" />
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="justify-start">PHQ-9 (Depression)</Button>
                                <Button variant="outline" className="justify-start">GAD-7 (Anxiety)</Button>
                                <Button variant="outline" className="justify-start">C-SSRS (Suicide Risk)</Button>
                                <Button variant="outline" className="justify-start">MDQ (Bipolar)</Button>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="mt-4 bg-nord13/10 border-nord13">
                        <Card.Body>
                            <div className="flex items-start gap-3">
                                <MessageSquare className="w-5 h-5 text-nord13 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-nord0">Upcoming Sessions</h4>
                                    <div className="text-sm text-nord3 mt-1">
                                        Today: <span className="font-bold">4 sessions</span>
                                    </div>
                                    <Button size="sm" variant="outline" className="mt-2 text-xs border-nord13 text-nord13 hover:bg-nord13/10">View Schedule</Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Recent Assessments List */}
                <div className="md:col-span-2">
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Recent Assessments</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-4">
                                {assessments.map(a => (
                                    <div key={a.id} className="flex justify-between items-center p-4 border border-nord4 dark:border-nord2 rounded-lg bg-nord6 dark:bg-nord1">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-nord10/20 rounded-full flex items-center justify-center text-nord10">
                                                <ClipboardList className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-nord0 dark:text-nord6">{a.patient}</div>
                                                <div className="text-sm text-nord3 dark:text-nord4">{a.type} • {new Date(a.date).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-nord1 dark:text-nord6">{a.score}</div>
                                            <Badge variant={
                                                ['Moderate', 'Severe'].includes(a.severity) ? 'error' :
                                                    a.severity === 'Mild' ? 'warning' : 'success'
                                            }>
                                                {a.severity}
                                            </Badge>
                                        </div>
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
