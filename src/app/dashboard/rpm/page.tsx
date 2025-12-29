
'use client'

import React, { useState } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Wifi, Plus } from 'lucide-react';
import { Card, Button, Input } from '@/components/nord';
import { DeviceReadingChart } from '@/components/rpm/DeviceReadingChart';

export default function RPMPage() {
    // Mock data
    const [glucometerData] = useState(() => [
        { recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), value: 105, unit: 'mg/dL' },
        { recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), value: 110, unit: 'mg/dL' },
        { recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), value: 98, unit: 'mg/dL' },
        { recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), value: 115, unit: 'mg/dL' },
    ]);

    const [weightData] = useState(() => [
        { recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), value: 185.5, unit: 'lbs' },
        { recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), value: 186.2, unit: 'lbs' },
        { recordedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), value: 186.0, unit: 'lbs' },
    ]);

    return (
        <ModuleLayout
            moduleName="Remote Patient Monitoring"
            moduleIcon={<Wifi className="w-5 h-5" />}
            breadcrumbs={[{ label: 'RPM', href: '/dashboard/rpm' }]}
        >
            <div className="flex justify-between items-center bg-nord14/20 p-4 rounded-lg border border-nord14 text-nord1">
                <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 animate-pulse text-nord14" />
                    <span className="font-medium">Device Hub Status: Online</span>
                </div>
                <div className="text-sm">Last sync: Just now</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <DeviceReadingChart
                        title="Blood Glucose"
                        data={glucometerData}
                        unit="mg/dL"
                        color="#88C0D0"
                    />
                    <Card>
                        <Card.Header>
                            <h3 className="text-sm font-semibold text-nord1 dark:text-nord6">Add Manual Reading</h3>
                        </Card.Header>
                        <Card.Body className="flex gap-2">
                            <Input placeholder="Value (mg/dL)" type="number" className="max-w-[150px]" />
                            <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add</Button>
                        </Card.Body>
                    </Card>
                </div>

                <div className="space-y-6">
                    <DeviceReadingChart
                        title="Body Weight"
                        data={weightData}
                        unit="lbs"
                        color="#A3BE8C"
                    />
                    <Card>
                        <Card.Header>
                            <h3 className="text-sm font-semibold text-nord1 dark:text-nord6">Connected Devices</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-2 bg-nord6 dark:bg-nord1 rounded border border-nord4 dark:border-nord2">
                                    <span className="text-sm font-medium text-nord1 dark:text-nord6">Accu-Chek Guide</span>
                                    <span className="text-xs text-nord14 bg-nord14/10 px-2 py-1 rounded">Connected</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-nord6 dark:bg-nord1 rounded border border-nord4 dark:border-nord2">
                                    <span className="text-sm font-medium text-nord1 dark:text-nord6">Withings Body+</span>
                                    <span className="text-xs text-nord14 bg-nord14/10 px-2 py-1 rounded">Connected</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
