'use client';

import React from 'react';
import Sidebar from './dashboard/Sidebar';

interface DashboardShellProps {
    children: React.ReactNode;
    navItems: any[]; // Ignored, using Sidebar's internal nav
    userInitials: string;
    userName: string;
}

export default function DashboardShell({ children, userInitials, userName }: DashboardShellProps) {
    return (
        <div className="flex h-screen w-full bg-background-dark overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header for Mobile/Context (Optional, can be added if needed, for now sticking to clean PaaS look) */}
                <div className="flex-1 overflow-auto bg-background-dark">
                    {children}
                </div>
            </main>
        </div>
    );
}
