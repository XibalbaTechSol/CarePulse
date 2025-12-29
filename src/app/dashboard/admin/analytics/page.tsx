
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/nord';
import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';
import { getQualityMetrics } from '@/lib/actions/administrative/analytics';

export default function AnalyticsPage() {
    const [metrics, setMetrics] = useState<any>(null);

    const loadMetrics = async () => {
        const data = await getQualityMetrics('mock-org');
        setMetrics(data);
    };

    useEffect(() => {
        loadMetrics();
    }, []);

    if (!metrics) return <div className="p-8 text-center text-nord3">Loading Analytics...</div>;

    // Mock trend data
    const readmissionData = [
        { month: 'Jan', rate: 14.2 },
        { month: 'Feb', rate: 13.8 },
        { month: 'Mar', rate: 13.5 },
        { month: 'Apr', rate: 13.0 },
        { month: 'May', rate: 12.5 },
    ];

    return (
        <ModuleLayout
            moduleName="Quality & Performance"
            moduleIcon={<Trophy className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Analytics', href: '/dashboard/admin/analytics' }]}
        >
            {/* Text Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <Card.Body className="p-4">
                        <div className="text-xs text-nord3 dark:text-nord4 uppercase font-semibold">Readmission Rate</div>
                        <div className="text-2xl font-bold text-nord1 dark:text-nord6 flex items-center gap-2">
                            {metrics.readmissionRate}%
                            <TrendingDown className="w-4 h-4 text-nord14" />
                        </div>
                        <div className="text-xs text-nord14">Below target (15%)</div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="p-4">
                        <div className="text-xs text-nord3 dark:text-nord4 uppercase font-semibold">Patient Satisfaction</div>
                        <div className="text-2xl font-bold text-nord1 dark:text-nord6 flex items-center gap-2">
                            {metrics.patientSatisfaction}
                            <TrendingUp className="w-4 h-4 text-nord14" />
                        </div>
                        <div className="text-xs text-nord3 dark:text-nord4">Out of 5.0</div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="p-4">
                        <div className="text-xs text-nord3 dark:text-nord4 uppercase font-semibold">HAI Rate</div>
                        <div className="text-2xl font-bold text-nord1 dark:text-nord6 flex items-center gap-2">
                            {metrics.infectionRate}%
                            <Minus className="w-4 h-4 text-nord13" />
                        </div>
                        <div className="text-xs text-nord13">Within tolerance</div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="p-4">
                        <div className="text-xs text-nord3 dark:text-nord4 uppercase font-semibold">Mortality Index</div>
                        <div className="text-2xl font-bold text-nord1 dark:text-nord6">{metrics.mortalityRate}</div>
                        <div className="text-xs text-nord3 dark:text-nord4">O/E Ratio</div>
                    </Card.Body>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Readmission Trend */}
                <Card>
                    <Card.Header>
                        <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Readmission Reduction</h3>
                    </Card.Header>
                    <Card.Body className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={readmissionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[10, 16]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="rate" stroke="#88C0D0" fill="#88C0D0" fillOpacity={0.2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>

                {/* HEDIS Measures List */}
                <Card>
                    <Card.Header>
                        <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">HEDIS Performance</h3>
                    </Card.Header>
                    <Card.Body>
                        <div className="space-y-4">
                            {metrics.measures.map((m: any) => (
                                <div key={m.id} className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-nord1 dark:text-nord6">{m.name}</div>
                                        <div className="text-xs text-nord3 dark:text-nord4">Target: {m.target}%</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold flex items-center justify-end gap-2 text-nord1 dark:text-nord6">
                                            {m.score}%
                                            {m.trend === 'up' ? <TrendingUp className="w-4 h-4 text-nord14" /> :
                                                m.trend === 'down' ? <TrendingDown className="w-4 h-4 text-nord11" /> :
                                                    <Minus className="w-4 h-4 text-nord3" />}
                                        </div>
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
