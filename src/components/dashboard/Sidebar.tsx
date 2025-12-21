'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Phone,
    Printer,
    Receipt,
    MapPin,
    Wallet,
    Workflow,
    FileText,
    Brain
} from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';

export default function Sidebar() {
    const pathname = usePathname();
    const collapsed = false; // Sidebar always expanded

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Clients', href: '/dashboard/crm', icon: Users },
        { name: 'Employees', href: '/dashboard/admin', icon: Users },
        { name: 'Phone System', href: '/dashboard/phone', icon: Phone },
        { name: 'Fax', href: '/dashboard/fax', icon: Printer },
        { name: 'Billing / Claims', href: '/dashboard/billing', icon: Receipt },
        { name: 'Payroll', href: '/dashboard/payroll', icon: Wallet },
        { name: 'Workflows', href: '/dashboard/workflows', icon: Workflow },
        { name: 'Forms', href: '/dashboard/forms', icon: FileText },
        { name: 'EVV', href: '/dashboard/evv', icon: MapPin },
    ];

    const intelligenceItems = [
        { name: 'AI Insights', href: '/dashboard/ai', icon: Brain },
    ];

    type NavItem = { name: string; href: string; icon: any };
    const NavLink = ({ item }: { item: NavItem }) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        return (
            <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors group ${isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-secondary hover:bg-surface-highlight hover:text-text-primary'
                    }`}
                title={collapsed ? item.name : ''}
            >
                <item.icon size={20} className={isActive ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'} />
                {!collapsed && <span className="text-sm">{item.name}</span>}
            </Link>
        );
    };

    return (
        <aside
            className="flex-shrink-0 flex flex-col bg-surface border-r border-border h-full w-64"
        >
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-8 relative flex items-center justify-center shrink-0">
                        <Image src="/logo.svg" alt="CarePulse Logo" fill className="object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-text-primary text-sm font-bold leading-normal">CarePulse</h1>
                        <p className="text-text-secondary text-[10px] font-normal leading-normal">Agency Console</p>
                    </div>
                </div>
                {/* Collapse button removed to keep sidebar always visible */}
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                {navItems.map((item) => (
                    <NavLink key={item.name} item={item} />
                ))}

                <div className="pt-4 mt-2 border-t border-border">
                    <p className="px-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Intelligence</p>
                    {intelligenceItems.map((item) => (
                        <NavLink key={item.name} item={item} />
                    ))}
                </div>
            </div>

            <div className={`p-4 border-t border-border flex items-center gap-3 ${collapsed ? 'flex-col' : 'justify-between'}`}>
                <ThemeToggle />
            </div>

            <div className="p-4 border-t border-border">
                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="relative">
                        <div className="size-9 rounded-full bg-surface-highlight border border-border flex items-center justify-center text-text-secondary">
                            US
                        </div>
                        <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-surface"></div>
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-text-primary text-sm font-medium truncate">User Demo</p>
                            <p className="text-text-secondary text-xs truncate">Admin</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Expand button removed as sidebar is always expanded */}
        </aside>
    );
}
