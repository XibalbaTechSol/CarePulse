
'use client'

import React from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { MessageCircle, Users, Video, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const modules = [
    { name: 'Patient Portal', icon: Users, href: '/dashboard/engagement/portal', desc: 'Secure messaging and appointments' },
    { name: 'Telehealth', icon: Video, href: '/dashboard/engagement/telehealth', desc: 'Virtual visits and video calls' },
    { name: 'Infection Control', icon: ShieldAlert, href: '/dashboard/engagement/infection-control', desc: 'HAI tracking and hygiene compliance' },
];

export default function EngagementLandingPage() {
    return (
        <ModuleLayout
            moduleName="Patient Engagement"
            moduleIcon={<MessageCircle className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Engagement', href: '/dashboard/engagement' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((m) => (
                    <Link key={m.href} href={m.href} className="group">
                        <div className="p-6 border border-nord4 dark:border-nord2 rounded-lg bg-nord6 dark:bg-nord1 hover:bg-white dark:hover:bg-nord0 transition-all shadow-sm group-hover:shadow-md h-full flex flex-col">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-lg bg-nord14/10 text-nord14 group-hover:bg-nord14 group-hover:text-nord6 transition-colors">
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
