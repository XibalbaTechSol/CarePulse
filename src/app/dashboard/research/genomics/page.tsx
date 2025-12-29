
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Dna, Pill, FileCode, AlertTriangle } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { getGenomicProfile, getTargetedTherapies } from '@/lib/actions/research/genomics';

export default function GenomicsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [therapies, setTherapies] = useState<any[]>([]);

    const loadData = async () => {
        const p = await getGenomicProfile('mock-p');
        setProfile(p);
        const t = await getTargetedTherapies(p.markers);
        setTherapies(t);
    };

    useEffect(() => {
        loadData();
    }, []);

    if (!profile) return <div>Loading...</div>;

    return (
        <ModuleLayout
            moduleName="Genomics & Precision Medicine"
            moduleIcon={<Dna className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Genomics', href: '/dashboard/research/genomics' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Genetic Markers */}
                <div className="md:col-span-2">
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6 flex items-center gap-2">
                                <Dna className="w-5 h-5 text-nord10" /> Genetic Profile: {profile.patient}
                            </h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-4">
                                {profile.markers.map((m: any, i: number) => (
                                    <div key={i} className="p-4 border border-nord4 dark:border-nord2 rounded-lg bg-nord6 dark:bg-nord1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-lg text-nord0 dark:text-nord6 font-mono">{m.gene}</h4>
                                                    {m.significance === 'PATHOGENIC' && <AlertTriangle className="w-4 h-4 text-nord11" />}
                                                </div>
                                                <div className="text-sm font-mono text-nord10">{m.mutation}</div>
                                            </div>
                                            <Badge variant={m.significance === 'PATHOGENIC' ? 'error' : m.significance === 'NORMAL' ? 'success' : 'warning'}>
                                                {m.significance.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-nord3 dark:text-nord4 italic">{m.implication}</div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Actionable Insights */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="h-full border-nord10">
                        <Card.Header className="bg-nord10/10">
                            <h3 className="text-lg font-semibold text-nord10 flex items-center gap-2">
                                <Pill className="w-5 h-5" /> Precision Therapies
                            </h3>
                        </Card.Header>
                        <Card.Body>
                            {therapies.length > 0 ? (
                                <div className="space-y-3">
                                    {therapies.map((t, i) => (
                                        <div key={i} className="p-3 bg-white dark:bg-nord0 rounded border border-nord10/30 shadow-sm">
                                            <div className="font-bold text-nord1 dark:text-nord6">{t.drug}</div>
                                            <div className="text-xs text-nord3 dark:text-nord4">{t.class}</div>
                                            <Badge variant="info" className="mt-2 text-nord10">{t.evidenceLevel} Evidence</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-nord3 py-8">
                                    No targeted therapies identified based on current marker set.
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Body className="p-4">
                            <div className="flex items-center gap-3">
                                <FileCode className="w-8 h-8 text-nord3" />
                                <div>
                                    <div className="font-semibold text-nord1 dark:text-nord6">Raw VCF Data</div>
                                    <div className="text-xs text-nord3">Size: 4.2 GB</div>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="w-full mt-3">Request Access</Button>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
