'use client';

import React from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { FlaskConical, Beaker, ClipboardCheck, Users, Search } from 'lucide-react';

export default function ClinicalTrialsPage() {
    const trials = [
        { id: 'T-101', name: 'NPH-21: Alzheimer Early Detection', sponsor: 'NeuroHealth', status: 'Recruiting', phase: 'III', enrollment: '45/100' },
        { id: 'T-102', name: 'CV-99: Hypertension Bio-monitors', sponsor: 'CardioSystems', status: 'Active', phase: 'IV', enrollment: '210/250' },
        { id: 'T-103', name: 'ONCO-7: Targeted Immunotherapy', sponsor: 'OncoGen', status: 'Closed', phase: 'II', enrollment: '82/80' },
    ];

    return (
        <ModuleLayout
            moduleName="Clinical Trials"
            moduleIcon={<FlaskConical className="w-5 h-5" />}
            breadcrumbs={[
                { label: 'Research', href: '/dashboard/research' },
                { label: 'Clinical Trials', href: '/dashboard/research/clinical-trials' }
            ]}
        >
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-surface-highlight/30 p-4 rounded-xl border border-border">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                        <input
                            type="text"
                            placeholder="Search trials, sponsors, or protocols..."
                            className="input pl-10 w-full"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button className="btn-ghost border border-border">Filter</button>
                        <button className="btn-primary">New Trial Protocol</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {trials.map((trial) => (
                        <div key={trial.id} className="card p-5 hover:border-primary/50 transition-all group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded uppercase tracking-widest">{trial.id}</span>
                                        <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{trial.name}</h3>
                                    </div>
                                    <p className="text-sm text-text-secondary mb-4">Sponsor: <span className="font-semibold">{trial.sponsor}</span></p>

                                    <div className="flex gap-6">
                                        <div className="flex items-center gap-2">
                                            <Beaker size={14} className="text-text-tertiary" />
                                            <span className="text-xs font-medium text-text-secondary">Phase {trial.phase}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-text-tertiary" />
                                            <span className="text-xs font-medium text-text-secondary">{trial.enrollment} Enrolled</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${trial.status === 'Recruiting' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            trial.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-gray-50 text-gray-700 border-gray-200'
                                        }`}>
                                        {trial.status}
                                    </span>
                                    <p className="text-[10px] text-text-tertiary mt-2 uppercase font-bold">Last Updated: 2d ago</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="size-8 rounded-full bg-surface-highlight border-2 border-surface flex items-center justify-center text-[10px] font-bold">
                                            P{i}
                                        </div>
                                    ))}
                                    <div className="size-8 rounded-full bg-primary text-white border-2 border-surface flex items-center justify-center text-[10px] font-bold">
                                        +42
                                    </div>
                                </div>
                                <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                                    View Protocol <ClipboardCheck size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ModuleLayout>
    );
}
