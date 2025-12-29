
'use client'

import React from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Stethoscope, Dna, HeartPulse, Baby, Brain, Ruler } from 'lucide-react';
import Link from 'next/link';

const modules = [
    { name: 'Oncology', icon: Dna, href: '/dashboard/specialty/oncology', desc: 'Treatment plans and chemo tracking' },
    { name: 'Cardiology', icon: HeartPulse, href: '/dashboard/specialty/cardiology', desc: 'ECG and telemetry monitoring' },
    { name: 'Maternal & Neonatal', icon: Baby, href: '/dashboard/specialty/maternal', desc: 'Labor & Delivery and NICU' },
    { name: 'Mental Health', icon: Brain, href: '/dashboard/specialty/mental-health', desc: 'Assessments and therapy logs' },
    { name: 'Wound Care', icon: Ruler, href: '/dashboard/specialty/wound-care', desc: 'Wound tracking and imaging' },
];

export default function SpecialtyLandingPage() {
    return (
        <ModuleLayout
            moduleName="Specialty Care"
            moduleIcon={<Stethoscope className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Specialty Care', href: '/dashboard/specialty' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((m) => (
                    <Link key={m.href} href={m.href} className="group">
                        <div className="p-6 border border-nord4 dark:border-nord2 rounded-lg bg-nord6 dark:bg-nord1 hover:bg-white dark:hover:bg-nord0 transition-all shadow-sm group-hover:shadow-md h-full flex flex-col">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-lg bg-nord10/10 text-nord10 group-hover:bg-nord10 group-hover:text-nord6 transition-colors">
                                    <m.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg text-nord1 dark:text-nord6">{m.name}</h3>
                            </div>
                            <p className="text-nord3 dark:text-nord4 text-sm flex-1">{m.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </ModuleLayout>
    );
}
