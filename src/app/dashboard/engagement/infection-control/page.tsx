
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { ShieldAlert, Droplets, Activity, Bug } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { getInfectionMetrics } from '@/lib/actions/engagement/infection';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function InfectionControlPage() {
    const [metrics, setMetrics] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getInfectionMetrics('mock-org');
        setMetrics(data);
    };

    if (!metrics) return <div>Loading...</div>;

    const complianceData = [
        { name: 'ICU', rate: 92 },
        { name: 'MedSurg', rate: 85 },
        { name: 'ED', rate: 78 },
        { name: 'OR', rate: 95 },
    ];

    return (
        <ModuleLayout
            moduleName="Infection Control"
            moduleIcon={<ShieldAlert className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Infection Prevention', href: '/dashboard/engagement/infection-control' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <Card.Body className="p-4">
                        <div className="text-xs font-bold uppercase text-nord3 dark:text-nord4">CAUTI Rate</div>
                        <div className="text-2xl font-bold text-nord10">{metrics.cautiRate}</div>
                        <div className="text-xs text-nord3">Target: &lt;1.0</div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="p-4">
                        <div className="text-xs font-bold uppercase text-nord3 dark:text-nord4">CLABSI Rate</div>
                        <div className="text-2xl font-bold text-nord10">{metrics.clabsiRate}</div>
                        <div className="text-xs text-nord3">Target: &lt;1.0</div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="p-4">
                        <div className="text-xs font-bold uppercase text-nord3 dark:text-nord4">SSI Rate</div>
                        <div className="text-2xl font-bold text-nord11">{metrics.ssiRate}</div>
                        <div className="text-xs text-nord3">Target: &lt;1.0</div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="p-4">
                        <div className="text-xs font-bold uppercase text-nord3 dark:text-nord4">Hand Hygiene</div>
                        <div className={`text-2xl font-bold ${metrics.handHygieneCompliance < 90 ? 'text-nord11' : 'text-nord14'}`}>
                            {metrics.handHygieneCompliance}%
                        </div>
                        <div className="text-xs text-nord3">Target: &gt;90%</div>
                    </Card.Body>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Isolation Status */}
                <div className="space-y-4">
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6 flex items-center gap-2">
                                <Bug className="w-5 h-5 text-nord11" /> Active Isolations
                            </h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-3">
                                {metrics.isolationCases.map((c: any) => (
                                    <div key={c.id} className="p-3 border border-nord4 dark:border-nord2 rounded bg-nord6 dark:bg-nord1 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-nord1 dark:text-nord6">{c.units}</div>
                                            <div className="text-sm text-nord11 font-medium">{c.pathogen}</div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="warning">{c.precaution}</Badge>
                                            <div className="text-xs text-nord3 dark:text-nord4 mt-1">{c.daysIsolated} days</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Charts */}
                <div>
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Hand Hygiene by Unit</h3>
                        </Card.Header>
                        <Card.Body className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={complianceData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                                        {complianceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.rate < 90 ? '#bf616a' : '#a3be8c'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
