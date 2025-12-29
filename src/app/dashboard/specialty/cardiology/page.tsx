
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { HeartPulse, Activity, FileText, AlertCircle } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { getTwleveLeadOrders } from '@/lib/actions/specialty/cardiology';

export default function CardiologyPage() {
    const [orders, setOrders] = useState<any[]>([]);

    const loadData = async () => {
        const data = await getTwleveLeadOrders('mock-org');
        setOrders(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <ModuleLayout
            moduleName="Cardiology & Telemetry"
            moduleIcon={<HeartPulse className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Cardiology', href: '/dashboard/specialty/cardiology' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Live Telemetry Mock */}
                <div className="md:col-span-2">
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-nord11" /> Live Telemetry Monitoring
                            </h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['Bed 1 (ICU)', 'Bed 2 (ICU)', 'Bed 3 (Step-down)'].map((bed, i) => (
                                    <div key={i} className="bg-black border border-nord3 rounded p-3 relative overflow-hidden">
                                        <div className="flex justify-between text-xs text-nord4 mb-2">
                                            <span>{bed}</span>
                                            <span className="text-green-500 font-mono">HR: {70 + i * 5} • SpO2: 9{8 - i}%</span>
                                        </div>
                                        {/* Mock ECG Line */}
                                        <div className="h-16 flex items-center justify-center relative">
                                            <svg viewBox="0 0 100 20" className="w-full h-full stroke-green-500 fill-none" preserveAspectRatio="none">
                                                <path d="M0,10 L10,10 L12,5 L14,15 L16,10 L20,10 L22,8 L24,10 L30,10 M30,10 L40,10 L42,5 L44,15 L46,10 L50,10 L52,8 L54,10 L60,10 M60,10 L70,10 L72,5 L74,15 L76,10 L80,10 L82,8 L84,10 L90,10" />
                                            </svg>
                                            {/* Fade overlay for sweeping effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/80"></div>
                                        </div>
                                        <div className="text-[10px] text-nord4 font-mono mt-1">SINUS RHYTHM</div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* 12-Lead Orders */}
                <div className="md:col-span-1">
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">12-Lead ECG Queue</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order.id} className="flex justify-between items-center p-3 border border-nord4 dark:border-nord2 rounded bg-nord6 dark:bg-nord1">
                                        <div>
                                            <div className="font-bold text-nord1 dark:text-nord6">{order.patient}</div>
                                            <div className="text-xs text-nord3 dark:text-nord4">{order.reason}</div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={order.priority === 'STAT' ? 'error' : 'primary'}>
                                                {order.priority}
                                            </Badge>
                                            <div className="text-[10px] text-nord3 dark:text-nord4 mt-1">
                                                {new Date(order.orderedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Echo/Stress Test Schedule */}
                <div className="md:col-span-1">
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Echo & Stress Lab</h3>
                        </Card.Header>
                        <Card.Body className="flex items-center justify-center text-nord3 dark:text-nord4 h-40">
                            <div className="text-center">
                                <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <p>No procedures scheduled for today.</p>
                                <Button size="sm" variant="outline" className="mt-2">Schedule Procedure</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
