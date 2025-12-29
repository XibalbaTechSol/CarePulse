
'use client'

import React from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Microscope, Users, FlaskConical, Siren, Dna, Server } from 'lucide-react';
import Link from 'next/link';

const modules = [
    { name: 'Population Health', icon: Users, href: '/dashboard/research/population', desc: 'Risk stratification and care gaps' },
    { name: 'Clinical Trials', icon: FlaskConical, href: '/dashboard/research/clinical-trials', desc: 'Trial management and eligibility' },
    { name: 'Public Health', icon: Siren, href: '/dashboard/research/public-health', desc: 'Disease surveillance and reporting' },
    { name: 'Genomics', icon: Dna, href: '/dashboard/research/genomics', desc: 'Precision medicine and genetic profiles' },
    { name: 'Medical Devices', icon: Server, href: '/dashboard/research/devices', desc: 'IoT fleet management and telemetry' },
];

export default function ResearchLandingPage() {
    return (
        <ModuleLayout
            moduleName="Research & Advanced"
            moduleIcon={<Microscope className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Research', href: '/dashboard/research' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((m) => (
                    <Link key={m.href} href={m.href} className="group">
                        <div className="p-6 border border-nord4 dark:border-nord2 rounded-lg bg-nord6 dark:bg-nord1 hover:bg-white dark:hover:bg-nord0 transition-all shadow-sm group-hover:shadow-md h-full flex flex-col">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-lg bg-nord11/10 text-nord11 group-hover:bg-nord11 group-hover:text-nord6 transition-colors">
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
