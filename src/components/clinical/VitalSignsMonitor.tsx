
'use client'

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/nord';
import { Activity, Heart, Thermometer, Wind } from 'lucide-react';

interface Vitals {
    hr: number;
    bpSys: number;
    bpDia: number;
    rr: number;
    temp: number;
    spo2: number;
}

interface VitalSignsMonitorProps {
    patientId: string;
    initialVitals?: Vitals;
}

export function VitalSignsMonitor({ patientId, initialVitals }: VitalSignsMonitorProps) {
    // Simulate real-time data
    const [vitals, setVitals] = useState<Vitals>(initialVitals || {
        hr: 72, bpSys: 120, bpDia: 80, rr: 16, temp: 98.6, spo2: 98
    });
    const [trend, setTrend] = useState<'stable' | 'deteriorating'>('stable');

    // Simulate fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setVitals(prev => ({
                hr: prev.hr + Math.floor(Math.random() * 3) - 1,
                bpSys: prev.bpSys + Math.floor(Math.random() * 3) - 1,
                bpDia: prev.bpDia,
                rr: prev.rr,
                temp: prev.temp,
                spo2: prev.spo2
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className={vitals.hr > 100 ? 'border-nord11 bg-nord11/10' : ''}>
                <Card.Body className="p-4 flex items-center justify-between">
                    <div>
                        <div className="text-xs text-nord3 dark:text-nord4 uppercase font-semibold">Heart Rate</div>
                        <div className="text-3xl font-bold text-nord0 dark:text-nord6">{vitals.hr}</div>
                        <div className="text-xs text-nord3 dark:text-nord4">bpm</div>
                    </div>
                    <Heart className={`w-8 h-8 ${vitals.hr > 100 ? 'text-nord11 animate-pulse' : 'text-nord4 dark:text-nord2'}`} />
                </Card.Body>
            </Card>

            <Card className={vitals.bpSys < 90 ? 'border-nord11 bg-nord11/10' : ''}>
                <Card.Body className="p-4 flex items-center justify-between">
                    <div>
                        <div className="text-xs text-nord3 dark:text-nord4 uppercase font-semibold">Blood Pressure</div>
                        <div className="text-3xl font-bold text-nord0 dark:text-nord6">{vitals.bpSys}/{vitals.bpDia}</div>
                        <div className="text-xs text-nord3 dark:text-nord4">mmHg</div>
                    </div>
                    <Activity className="w-8 h-8 text-nord4 dark:text-nord2" />
                </Card.Body>
            </Card>

            <Card className={vitals.spo2 < 93 ? 'border-nord11 bg-nord11/10' : ''}>
                <Card.Body className="p-4 flex items-center justify-between">
                    <div>
                        <div className="text-xs text-nord3 dark:text-nord4 uppercase font-semibold">SpO2</div>
                        <div className="text-3xl font-bold text-nord0 dark:text-nord6">{vitals.spo2}%</div>
                        <div className="text-xs text-nord3 dark:text-nord4">Oxygen</div>
                    </div>
                    <Wind className="w-8 h-8 text-nord4 dark:text-nord2" />
                </Card.Body>
            </Card>

            <Card className={vitals.temp > 100.4 ? 'border-nord11 bg-nord11/10' : ''}>
                <Card.Body className="p-4 flex items-center justify-between">
                    <div>
                        <div className="text-xs text-nord3 dark:text-nord4 uppercase font-semibold">Temp</div>
                        <div className="text-3xl font-bold text-nord0 dark:text-nord6">{vitals.temp}</div>
                        <div className="text-xs text-nord3 dark:text-nord4">°F</div>
                    </div>
                    <Thermometer className="w-8 h-8 text-nord4 dark:text-nord2" />
                </Card.Body>
            </Card>
        </div>
    );
}
