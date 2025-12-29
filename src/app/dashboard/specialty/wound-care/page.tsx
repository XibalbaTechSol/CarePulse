
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Ruler, Image as ImageIcon, Camera } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { getWoundCases } from '@/lib/actions/specialty/wound-care';

export default function WoundCarePage() {
    const [wounds, setWounds] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getWoundCases('mock-org');
        setWounds(data);
    };

    return (
        <ModuleLayout
            moduleName="Wound Care"
            moduleIcon={<Ruler className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Wound Care', href: '/dashboard/specialty/wound-care' }]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Wound List */}
                <div className="space-y-4">
                    {wounds.map(w => (
                        <Card key={w.id}>
                            <Card.Body className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-nord1 dark:text-nord6">{w.patient}</h3>
                                        <div className="text-sm text-nord3 dark:text-nord4">
                                            {w.location} • {w.type}
                                        </div>
                                    </div>
                                    <Badge variant={w.status === 'IMPROVING' ? 'success' : w.status === 'STAGNANT' ? 'warning' : 'error'}>
                                        {w.status}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4 my-3 text-sm">
                                    <div className="bg-nord6 dark:bg-nord1 p-2 rounded border border-nord4 dark:border-nord2">
                                        <span className="block text-xs font-bold uppercase text-nord3">Stage</span>
                                        <span className="font-semibold text-nord10">{w.stage}</span>
                                    </div>
                                    <div className="bg-nord6 dark:bg-nord1 p-2 rounded border border-nord4 dark:border-nord2">
                                        <span className="block text-xs font-bold uppercase text-nord3">Size</span>
                                        <span className="font-semibold text-nord10">{w.size}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-3">
                                    <Button size="sm" variant="outline"><Camera className="w-4 h-4 mr-2" /> Add Photo</Button>
                                    <Button size="sm" variant="primary">New Assessment</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>

                {/* Photo/Trend Placeholder */}
                <div>
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Healing Progression</h3>
                        </Card.Header>
                        <Card.Body className="flex flex-col items-center justify-center p-8 h-64 text-nord3 dark:text-nord4 border-t border-dashed border-nord4 dark:border-nord2">
                            <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
                            <p className="text-center">Select a wound to view historical images and healing trend graph.</p>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
