'use client';

import React from 'react';
import Sidebar from './dashboard/Sidebar';

interface DashboardShellProps {
    children: React.ReactNode;
    navItems: { name: string; href: string; icon: string; enabled?: boolean }[];
    userInitials: string;
    userName: string;
}

/**
 * Nord-themed Dashboard Shell
 * Main layout wrapper for the dashboard
 */
export default function DashboardShell({ children, navItems }: DashboardShellProps) {
    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--background)' }}>
            <Sidebar navItems={navItems} />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Main content area with Nord background */}
                <div className="flex-1 overflow-auto" style={{ background: 'var(--background)' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
