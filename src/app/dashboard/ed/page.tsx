'use client'

import React, { useState } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Ambulance, Clock, Activity, Users } from 'lucide-react';
import { Card, Badge, Button, Input, Label } from '@/components/nord';
import { createTriageEntry } from '@/lib/actions/hospital/ed';

export default function EDPage() {
    const [complaint, setComplaint] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock Waiting List
    const patients = [
        { id: '1', name: 'Jane Doe', complaint: 'Chest Pain', esi: 2, wait: '5m', status: 'Triaged' },
        { id: '2', name: 'Bob Smith', complaint: 'Ankle Injury', esi: 4, wait: '45m', status: 'Waiting' },
        { id: '3', name: 'Alice Jones', complaint: 'High Fever', esi: 3, wait: '20m', status: 'Waiting' },
    ];

    const handleTriage = async () => {
        setIsSubmitting(true);
        await createTriageEntry({
            patientId: 'mock-id',
            chiefComplaint: complaint,
            vitals: { hr: 90, bp: '120/80' },
            age: 30,
            gender: 'F',
            arrivalTime: new Date().toISOString()
        });
        setIsSubmitting(false);
        setComplaint('');
        alert('Patient triaged!');
    };

    return (
        <ModuleLayout
            moduleName="Emergency Department"
            moduleIcon={<Ambulance className="w-5 h-5" />}
            breadcrumbs={[{ label: 'ED Triage', href: '/dashboard/ed' }]}
        >
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800">
                    <Card.Body className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-red-600 dark:text-red-400 font-bold uppercase">Critical (ESI 1-2)</div>
                            <div className="text-2xl font-bold text-red-900 dark:text-red-100">3</div>
                        </div>
                        <Activity className="w-8 h-8 text-red-300 dark:text-red-700" />
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-nord3 dark:text-nord4 font-bold uppercase">Waiting Room</div>
                            <div className="text-2xl font-bold text-nord0 dark:text-nord6">12</div>
                        </div>
                        <Users className="w-8 h-8 text-nord4 dark:text-nord2" />
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-nord3 dark:text-nord4 font-bold uppercase">Avg Wait Time</div>
                            <div className="text-2xl font-bold text-nord0 dark:text-nord6">34m</div>
                        </div>
                        <Clock className="w-8 h-8 text-nord4 dark:text-nord2" />
                    </Card.Body>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Triage Form */}
                <Card className="lg:col-span-1 h-fit">
                    <Card.Header>
                        <h3 className="text-lg font-semibold text-nord0 dark:text-nord6">Quick Triage</h3>
                        <p className="text-sm text-nord3 dark:text-nord4">AI-Assisted ESI Scoring</p>
                    </Card.Header>
                    <Card.Body className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                label="Chief Complaint"
                                placeholder="Describe symptoms..."
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Input label="HR" placeholder="bpm" />
                            </div>
                            <div className="space-y-2">
                                <Input label="BP" placeholder="mmHg" />
                            </div>
                        </div>
                        <Button className="w-full" variant="primary" onClick={handleTriage} disabled={isSubmitting}>
                            {isSubmitting ? 'Analyzing...' : 'Triage Patient'}
                        </Button>
                    </Card.Body>
                </Card>

                {/* Waiting List */}
                <Card className="lg:col-span-2">
                    <Card.Header>
                        <h3 className="text-lg font-semibold text-nord0 dark:text-nord6">Waiting List</h3>
                    </Card.Header>
                    <Card.Body>
                        <div className="space-y-4">
                            {patients.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-3 border border-nord4 dark:border-nord2 rounded-lg hover:bg-nord6 dark:hover:bg-nord1 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                                            ${p.esi === 1 ? 'bg-red-600' : p.esi === 2 ? 'bg-orange-500' : p.esi === 3 ? 'bg-yellow-500' : 'bg-green-500'}
                                        `}>
                                            {p.esi}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-nord0 dark:text-nord6">{p.name}</div>
                                            <div className="text-sm text-nord3 dark:text-nord4">{p.complaint}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-nord0 dark:text-nord6">Wait: {p.wait}</div>
                                            <Badge variant="primary">{p.status}</Badge>
                                        </div>
                                        <Button size="sm" variant="ghost">Admit</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </ModuleLayout>
    );
}
