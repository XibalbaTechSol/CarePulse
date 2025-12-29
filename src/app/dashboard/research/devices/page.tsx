
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Server, Activity, AlertCircle, Wrench } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { getDeviceFleet, getDeviceTelemetry } from '@/lib/actions/research/devices';

export default function DevicesPage() {
    const [devices, setDevices] = useState<any[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<any>(null);
    const [telemetry, setTelemetry] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const d = await getDeviceFleet('mock-org');
        setDevices(d);
    };

    const handleSelect = async (d: any) => {
        setSelectedDevice(d);
        // Mock fetching live data
        const t = await getDeviceTelemetry(d.id);
        setTelemetry(t);
    };

    return (
        <ModuleLayout
            moduleName="Medical Device Hub"
            moduleIcon={<Server className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Device Integration', href: '/dashboard/research/devices' }]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fleet Overview */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Connected Fleet</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-3">
                                {devices.map(d => (
                                    <div
                                        key={d.id}
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors flex justify-between items-center ${selectedDevice?.id === d.id
                                                ? 'bg-nord10/10 border-nord10 ring-1 ring-nord10'
                                                : 'bg-nord6 dark:bg-nord1 border-nord4 dark:border-nord2 hover:bg-white dark:hover:bg-nord0'
                                            }`}
                                        onClick={() => handleSelect(d)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${d.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <div>
                                                <div className="font-bold text-nord1 dark:text-nord6">{d.type} - {d.location}</div>
                                                <div className="text-xs text-nord3 dark:text-nord4">
                                                    {d.manufacturer} {d.model}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {d.alerts && d.alerts.length > 0 && (
                                                <Badge variant="error" className="mb-1 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {d.alerts[0]}
                                                </Badge>
                                            )}
                                            <div className="text-xs text-nord3">Last Maint: {new Date(d.lastMaintenance).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Device Detail / Telemetry */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Device Telemetry</h3>
                        </Card.Header>
                        <Card.Body>
                            {selectedDevice && telemetry ? (
                                <div className="space-y-6">
                                    <div className="text-center pb-4 border-b border-nord4 dark:border-nord2">
                                        <Server className="w-16 h-16 mx-auto text-nord10 mb-2" />
                                        <h4 className="font-bold text-lg">{selectedDevice.type}</h4>
                                        <div className="text-sm font-mono text-nord3">{selectedDevice.id}</div>
                                    </div>

                                    <div className="space-y-4">
                                        {Object.entries(telemetry.metrics).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-center">
                                                <span className="text-sm text-nord3 font-medium">{key}</span>
                                                <span className="font-mono font-bold text-lg text-nord0 dark:text-nord6">{value as string}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-nord4 dark:border-nord2 space-y-2">
                                        <Button className="w-full" variant="outline">
                                            <Activity className="w-4 h-4 mr-2" /> View Logs
                                        </Button>
                                        <Button className="w-full" variant="outline">
                                            <Wrench className="w-4 h-4 mr-2" /> Schedule Maintenance
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-nord3 text-center opacity-70">
                                    <Activity className="w-12 h-12 mb-3" />
                                    <p>Select a device to view live telemetry and configuration.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
