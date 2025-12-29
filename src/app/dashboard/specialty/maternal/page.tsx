
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Baby, Percent, Clock, AlertTriangle } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { getActiveLabor } from '@/lib/actions/specialty/maternal';

export default function MaternalPage() {
    const [patients, setPatients] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getActiveLabor();
        setPatients(data);
    };

    return (
        <ModuleLayout
            moduleName="Maternal & Neonatal"
            moduleIcon={<Baby className="w-5 h-5" />}
            breadcrumbs={[{ label: 'L&D Unit', href: '/dashboard/specialty/maternal' }]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Labor Board */}
                <div className="lg:col-span-2 space-y-4">
                    {patients.map(p => (
                        <div key={p.id} className="border border-nord4 dark:border-nord2 rounded-lg bg-white dark:bg-nord0 overflow-hidden shadow-sm">
                            <div className="p-4 bg-nord6 dark:bg-nord1 flex justify-between items-center border-b border-nord4 dark:border-nord2">
                                <div>
                                    <h3 className="text-lg font-bold text-nord1 dark:text-nord6 flex items-center gap-2">
                                        {p.mother} <span className="text-sm font-normal text-nord3 dark:text-nord4">({p.gestationalAge})</span>
                                    </h3>
                                    <div className="text-sm text-nord3 dark:text-nord4">Room: {p.room}</div>
                                </div>
                                <Badge variant={p.status === 'ACTIVE_LABOR' ? 'error' : 'warning'}>
                                    {p.status.replace('_', ' ')}
                                </Badge>
                            </div>

                            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Vitals */}
                                <div className="bg-nord6 dark:bg-nord1 p-3 rounded border border-nord4 dark:border-nord2">
                                    <div className="text-xs font-bold uppercase text-nord3 mb-1">Cervical Exam</div>
                                    <div className="text-lg font-mono font-semibold text-nord10">{p.cervix}</div>
                                </div>
                                <div className="bg-nord6 dark:bg-nord1 p-3 rounded border border-nord4 dark:border-nord2">
                                    <div className="text-xs font-bold uppercase text-nord3 mb-1">Fetal HR</div>
                                    <div className="text-lg font-mono font-semibold text-nord10 flex items-center gap-2">
                                        <ActivityIcon className="w-4 h-4 text-nord11 animate-pulse" /> {p.fetalHeartRate} bpm
                                    </div>
                                </div>
                                <div className="bg-nord6 dark:bg-nord1 p-3 rounded border border-nord4 dark:border-nord2">
                                    <div className="text-xs font-bold uppercase text-nord3 mb-1">Contractions</div>
                                    <div className="text-lg font-mono font-semibold text-nord10">{p.contractions}</div>
                                </div>
                            </div>

                            <div className="p-4 bg-nord6 dark:bg-nord1 flex justify-end gap-2 border-t border-nord4 dark:border-nord2">
                                <Button size="sm" variant="outline"><Clock className="w-4 h-4 mr-2" /> Log Exam</Button>
                                <Button size="sm" variant="primary">Record Delivery</Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Partogram Placeholder */}
                <div className="lg:col-span-1">
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Partogram</h3>
                        </Card.Header>
                        <Card.Body className="h-64 flex items-center justify-center text-nord3 border-t border-dashed border-nord4">
                            <div className="text-center">
                                <Percent className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Select a patient to view labor progression</p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* NICU Status */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">NICU Status</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-2 rounded bg-nord11/10 border border-nord11/20">
                                    <span className="font-medium text-nord1">Bed 1: Baby Doe</span>
                                    <Badge variant="error" className="text-xs">Critical</Badge>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded bg-green-50 border border-green-100">
                                    <span className="font-medium text-nord1">Bed 2: Baby Smith</span>
                                    <Badge variant="success" className="text-xs">Stable</Badge>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}

function ActivityIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
