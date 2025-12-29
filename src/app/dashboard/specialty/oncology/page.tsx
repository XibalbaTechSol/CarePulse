
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Dna, Activity, Calendar, Pill } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { getTreatmentPlans } from '@/lib/actions/specialty/oncology';

export default function OncologyPage() {
    const [plans, setPlans] = useState<any[]>([]);

    const loadData = async () => {
        const data = await getTreatmentPlans('mock-org');
        setPlans(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <ModuleLayout
            moduleName="Oncology"
            moduleIcon={<Dna className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Oncology', href: '/dashboard/specialty/oncology' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Summary Stats */}
                <div className="md:col-span-1 space-y-4">
                    <Card>
                        <Card.Body className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase text-nord3 dark:text-nord4">Active Patients</div>
                                <div className="text-2xl font-bold text-nord10">124</div>
                            </div>
                            <Activity className="w-8 h-8 text-nord10/50" />
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold uppercase text-nord3 dark:text-nord4">Infusions Today</div>
                                <div className="text-2xl font-bold text-nord10">8</div>
                            </div>
                            <Calendar className="w-8 h-8 text-nord10/50" />
                        </Card.Body>
                    </Card>
                </div>

                {/* Treatment Plans */}
                <div className="md:col-span-2">
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Active Treatments</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-4">
                                {plans.map(plan => (
                                    <div key={plan.id} className="border border-nord4 dark:border-nord2 rounded-lg p-4 hover:bg-nord6 dark:hover:bg-nord1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-lg text-nord0 dark:text-nord6">{plan.patient}</h4>
                                                <div className="text-sm text-nord3 dark:text-nord4">
                                                    {plan.diagnosis} (Stage {plan.stage}) • <span className="font-mono text-nord10">{plan.protocol}</span>
                                                </div>
                                            </div>
                                            <Badge variant={plan.status === 'ACTIVE' ? 'success' : 'primary'}>
                                                {plan.status}
                                            </Badge>
                                        </div>

                                        {/* Cycle Progress */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs mb-1 text-nord3 dark:text-nord4">
                                                <span>Cycle {plan.currentCycle} of {plan.totalCycles}</span>
                                                <span>Next Infusion: {new Date(plan.nextInfusion).toLocaleDateString()}</span>
                                            </div>
                                            <div className="w-full bg-nord4 dark:bg-nord2 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-nord10 h-full rounded-full"
                                                    style={{ width: `${(plan.currentCycle / plan.totalCycles) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <Button size="sm" variant="outline"><Pill className="w-4 h-4 mr-2" /> Log Toxicity</Button>
                                            <Button size="sm" variant="primary">Schedule Infusion</Button>
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
