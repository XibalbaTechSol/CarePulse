
'use client'

import React from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Activity, User } from 'lucide-react';
import { VitalSignsMonitor } from '@/components/clinical/VitalSignsMonitor';
import { Card, Badge } from '@/components/nord';
import { TimelineView } from '@/components/clinical/TimelineView';

export default function MonitoringPage() {
    const [events] = React.useState(() => [
        { id: '1', title: 'HR Spike > 110', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), type: 'alert' as const, description: 'Resolved spontaneously' },
        { id: '2', title: 'Vitals Checked', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), type: 'vital' as const, provider: 'Nurse Joy' }
    ]);

    return (
        <ModuleLayout
            moduleName="Sepsis & Deterioration Monitoring"
            moduleIcon={<Activity className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Monitoring', href: '/dashboard/clinical/monitoring' }]}
        >
            {/* Patient Selector / Header Mock */}
            <div className="bg-nord6 dark:bg-nord1 p-4 rounded-lg border border-nord4 dark:border-nord2 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-nord4 dark:bg-nord2 p-2 rounded-full">
                        <User className="w-6 h-6 text-nord3 dark:text-nord4" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-nord0 dark:text-nord6">John Doe (54M)</h2>
                        <div className="text-sm text-nord3 dark:text-nord4">Room 302 • Admitted 2 days ago</div>
                    </div>
                </div>
                <Badge variant="warning">
                    High Risk Watch
                </Badge>
            </div>

            {/* Vitals Grid */}
            <section>
                <h3 className="text-sm font-semibold text-nord3 dark:text-nord4 uppercase tracking-wider mb-3">Real-time Vitals</h3>
                <VitalSignsMonitor patientId="mock-patient-id" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Risk Analysis */}
                <div className="lg:col-span-2">
                    <Card className="h-full border-l-4 border-l-nord10">
                        <Card.Header>
                            <h3 className="text-nord10 font-semibold flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Review Deterioration Index (RDI)
                            </h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-5xl font-bold text-nord0 dark:text-nord6">12<span className="text-lg text-nord3 dark:text-nord4 font-normal">/100</span></div>
                                <div>
                                    <div className="font-semibold text-nord14">Stable Condition</div>
                                    <div className="text-sm text-nord3 dark:text-nord4">AI prediction confidence: 92%</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1 text-nord1 dark:text-nord6">
                                        <span>Sepsis Risk</span>
                                        <span className="font-semibold">Low (12%)</span>
                                    </div>
                                    <div className="h-2 bg-nord4 dark:bg-nord2 rounded-full overflow-hidden">
                                        <div className="h-full bg-nord14 w-[12%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1 text-nord1 dark:text-nord6">
                                        <span>Respiratory Distress</span>
                                        <span className="font-semibold">Low (8%)</span>
                                    </div>
                                    <div className="h-2 bg-nord4 dark:bg-nord2 rounded-full overflow-hidden">
                                        <div className="h-full bg-nord10 w-[8%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1 text-nord1 dark:text-nord6">
                                        <span>Cardiac Event</span>
                                        <span className="font-semibold text-nord13">Moderate (45%)</span>
                                    </div>
                                    <div className="h-2 bg-nord4 dark:bg-nord2 rounded-full overflow-hidden">
                                        <div className="h-full bg-nord13 w-[45%]"></div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Recent Events */}
                <div>
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="font-semibold text-nord1 dark:text-nord6">Recent Alerts</h3>
                        </Card.Header>
                        <Card.Body>
                            <TimelineView events={events} />
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
