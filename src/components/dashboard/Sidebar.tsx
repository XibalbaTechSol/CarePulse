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
    Brain,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = React.useState(false);

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

    const NavLink = ({ item }: { item: any }) => {
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
            className={`flex-shrink-0 flex flex-col bg-surface border-r border-border h-full transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
                    <div className="size-8 relative flex items-center justify-center shrink-0">
                        <Image src="/logo.svg" alt="CarePulse Logo" fill className="object-contain" />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <h1 className="text-text-primary text-sm font-bold leading-normal">CarePulse</h1>
                            <p className="text-text-secondary text-[10px] font-normal leading-normal">Agency Console</p>
                        </div>
                    )}
                </div>
                {!collapsed && (
                    <button onClick={() => setCollapsed(!collapsed)} className="text-text-secondary hover:text-text-primary">
                        <ChevronLeft size={16} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                {navItems.map((item) => (
                    <NavLink key={item.name} item={item} />
                ))}

                {!collapsed && (
                    <div className="pt-4 mt-2 border-t border-border">
                        <p className="px-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Intelligence</p>
                        {intelligenceItems.map((item) => (
                            <NavLink key={item.name} item={item} />
                        ))}
                    </div>
                )}
                {collapsed && intelligenceItems.map((item) => (
                    <NavLink key={item.name} item={item} />
                ))}
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
            {collapsed && (
                <button onClick={() => setCollapsed(false)} className="mx-auto mb-4 text-text-secondary hover:text-text-primary">
                    <ChevronRight size={16} />
                </button>
            )}
        </aside>
    );
}
