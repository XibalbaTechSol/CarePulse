'use client';

import React from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Users, TrendingUp, AlertCircle, Heart, Activity } from 'lucide-react';

export default function PopulationHealthPage() {
    const stats = [
        { label: 'High Risk Patients', value: '124', change: '+12%', icon: AlertCircle, color: 'text-error' },
        { label: 'Active Care Gaps', value: '450', change: '-5%', icon: Activity, color: 'text-warning' },
        { label: 'Avg Wellness Score', value: '78', change: '+2%', icon: Heart, color: 'text-success' },
        { label: 'Screening Rate', value: '92%', change: '+1%', icon: TrendingUp, color: 'text-primary' },
    ];

    return (
        <ModuleLayout
            moduleName="Population Health"
            moduleIcon={<Users className="w-5 h-5" />}
            breadcrumbs={[
                { label: 'Research', href: '/dashboard/research' },
                { label: 'Population Health', href: '/dashboard/research/population' }
            ]}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="card p-4 flex items-center gap-4">
                            <div className={`p-3 rounded-lg bg-surface-highlight ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider">{stat.label}</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-bold text-text-primary">{stat.value}</span>
                                    <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-success' : 'text-error'}`}>
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <h3 className="text-lg font-bold mb-4">Risk Stratification</h3>
                        <div className="space-y-4">
                            {[
                                { group: 'Chronic Conditions', count: 850, risk: 'High' },
                                { group: 'Preventative Care', count: 1200, risk: 'Medium' },
                                { group: 'Healthy / Low Risk', count: 3500, risk: 'Low' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{item.group}</span>
                                    <div className="flex items-center gap-4 w-2/3">
                                        <div className="flex-1 h-2 bg-surface-highlight rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.risk === 'High' ? 'bg-error' : item.risk === 'Medium' ? 'bg-warning' : 'bg-success'}`}
                                                style={{ width: `${(item.count / 5000) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-text-tertiary w-12 text-right">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card p-6">
                        <h3 className="text-lg font-bold mb-4">Upcoming Screenings</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Colorectal Screening', due: '15 Pending', priority: 'High' },
                                { name: 'Blood Pressure Check', due: '42 Pending', priority: 'Medium' },
                                { name: 'Flu Vaccination', due: '128 Pending', priority: 'Low' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-highlight/50 border border-border">
                                    <div>
                                        <p className="text-sm font-semibold">{item.name}</p>
                                        <p className="text-xs text-text-tertiary">{item.due}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.priority === 'High' ? 'bg-error/10 text-error' :
                                            item.priority === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                                        }`}>
                                        {item.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ModuleLayout>
    );
}
