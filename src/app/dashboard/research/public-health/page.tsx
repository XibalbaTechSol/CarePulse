
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Share2, Map, Siren, CheckCircle } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { getReportableEvents, getOutbreakMapData } from '@/lib/actions/research/public-health';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function PublicHealthPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [mapData, setMapData] = useState<any[]>([]);

    const loadData = async () => {
        const e = await getReportableEvents('mock-org');
        setEvents(e);
        const m = await getOutbreakMapData();
        setMapData(m);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <ModuleLayout
            moduleName="Public Health Surveillance"
            moduleIcon={<Siren className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Surveillance', href: '/dashboard/research/public-health' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reportable Disease List */}
                <div className="md:col-span-1">
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Mandatory Reporting Queue</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-3">
                                {events.map(e => (
                                    <div key={e.id} className="p-4 border border-nord4 dark:border-nord2 rounded-lg bg-nord6 dark:bg-nord1 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-lg text-nord0 dark:text-nord6">{e.disease}</div>
                                            <div className="text-sm text-nord3 dark:text-nord4">
                                                {e.cases} new case{e.cases > 1 ? 's' : ''} • Last: {new Date(e.lastCaseDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={e.status === 'REPORT_PENDING' ? 'error' : e.status === 'REPORTED' ? 'success' : 'info'}>
                                                {e.status.replace('_', ' ')}
                                            </Badge>
                                            {e.status === 'REPORT_PENDING' && (
                                                <Button size="sm" className="w-full mt-2" variant="outline">
                                                    <Share2 className="w-3 h-3 mr-1" /> Submit
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Outbreak Map Stub */}
                <div className="md:col-span-1">
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6 flex items-center gap-2">
                                <Map className="w-5 h-5 text-nord10" /> Regional Outbreak Heatmap
                            </h3>
                        </Card.Header>
                        <Card.Body className="h-64 flex flex-col">
                            <div className="flex-1 bg-nord5 dark:bg-nord1 rounded relative overflow-hidden flex items-center justify-center border border-nord4 dark:border-nord2">
                                <div className="text-nord3 text-center">
                                    <Map className="w-16 h-16 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">Geospatial visualization requires API key.</p>
                                    <div className="flex gap-2 justify-center mt-4">
                                        <Badge variant="error">High Risk: 90210</Badge>
                                        <Badge variant="warning">Mod: 90001</Badge>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Syndromic Surveillance Chart */}
                <div className="md:col-span-2">
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Syndromic Surveillance (ILI Trends)</h3>
                        </Card.Header>
                        <Card.Body className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { day: 'Mon', flu: 12, covid: 5 },
                                    { day: 'Tue', flu: 19, covid: 8 },
                                    { day: 'Wed', flu: 15, covid: 12 },
                                    { day: 'Thu', flu: 22, covid: 9 },
                                    { day: 'Fri', flu: 28, covid: 15 },
                                    { day: 'Sat', flu: 10, covid: 4 },
                                    { day: 'Sun', flu: 8, covid: 3 },
                                ]}>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="flu" name="Influenza-like Illness" fill="#bf616a" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="covid" name="COVID-like Illness" fill="#5e81ac" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
