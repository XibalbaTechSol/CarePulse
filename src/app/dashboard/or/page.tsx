
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Calendar, Clock, Scissors, CheckCircle } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { getORSule } from '@/lib/actions/hospital/or';

export default function ORPage() {
    const [schedule, setSchedule] = useState<any[]>([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const loadSchedule = async () => {
        const data = await getORSule(date);
        setSchedule(data as any[]);
    };

    useEffect(() => {
        loadSchedule();
    }, [date]);

    return (
        <ModuleLayout
            moduleName="OR Management"
            moduleIcon={<Scissors className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Operating Rooms', href: '/dashboard/or' }]}
        >
            <div className="flex justify-between items-center bg-nord6 dark:bg-nord1 p-4 rounded-lg border border-nord4 dark:border-nord2 shadow-sm mb-6">
                <div>
                    <h2 className="font-semibold text-lg text-nord1 dark:text-nord6">Surgical Schedule</h2>
                    <p className="text-sm text-nord3 dark:text-nord4">{new Date(date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Calendar className="w-4 h-4 mr-2" /> Select Date</Button>
                    <Button><Scissors className="w-4 h-4 mr-2" /> Book Case</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* OR Status Cards */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['OR-1', 'OR-2', 'OR-3'].map(or => {
                        const currentCase = schedule.find(s => s.orRoom === or && s.status === 'IN_PROGRESS');
                        return (
                            <Card key={or} className={currentCase ? 'border-nord11 bg-nord11/10' : 'border-nord14 bg-nord14/10'}>
                                <Card.Body className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-nord1 dark:text-nord6">{or}</h3>
                                        <Badge variant={currentCase ? 'error' : 'success'} className={currentCase ? '' : 'bg-nord14/20 text-nord14'}>
                                            {currentCase ? 'BUSY' : 'READY'}
                                        </Badge>
                                    </div>
                                    {currentCase ? (
                                        <div>
                                            <div className="font-medium text-nord11">{currentCase.procedureName}</div>
                                            <div className="text-sm text-nord11/80">{currentCase.surgeon}</div>
                                            <div className="flex items-center gap-1 text-xs text-nord11/70 mt-2">
                                                <Clock className="w-3 h-3" /> Elapsed: 45m
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-nord14 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" /> Room Clean & Prepped
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        );
                    })}
                </div>

                {/* Timeline / Schedule List */}
                <Card className="lg:col-span-2">
                    <Card.Header>
                        <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Daily Cases</h3>
                    </Card.Header>
                    <Card.Body>
                        <div className="space-y-4">
                            {schedule.map(c => (
                                <div key={c.id} className="flex gap-4 p-3 border border-nord4 dark:border-nord2 rounded-lg hover:bg-nord6 dark:hover:bg-nord1 items-center">
                                    <div className="min-w-[80px] text-center p-2 bg-nord4 dark:bg-nord2 rounded text-sm font-semibold text-nord1 dark:text-nord6">
                                        {new Date(c.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-nord1 dark:text-nord6">{c.procedureName}</div>
                                        <div className="text-sm text-nord3 dark:text-nord4">{c.surgeon} • {c.orRoom}</div>
                                    </div>
                                    <Badge variant={
                                        c.status === 'COMPLETED' ? 'success' :
                                            c.status === 'IN_PROGRESS' ? 'info' :
                                                'primary'
                                    }>
                                        {c.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>

                {/* Surgeon Utilization or Stats */}
                <Card>
                    <Card.Header>
                        <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">OR Efficiency</h3>
                    </Card.Header>
                    <Card.Body className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1 text-nord1 dark:text-nord6">
                                <span>Utilization</span>
                                <span className="font-bold">85%</span>
                            </div>
                            <div className="w-full bg-nord4 dark:bg-nord2 h-2 rounded-full">
                                <div className="bg-nord10 h-full w-[85%] rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1 text-nord1 dark:text-nord6">
                                <span>Turnover Time</span>
                                <span className="font-bold">22m</span>
                            </div>
                            <div className="text-xs text-nord14">Within target (&lt;25m)</div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </ModuleLayout>
    );
}
