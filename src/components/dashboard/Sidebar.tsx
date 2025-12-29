'use client';

import React, { useState } from 'react';
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
    Settings,
    Mail,
    FolderOpen,
    Activity,
    Clipboard,
    Stethoscope,
    Bed,
    Siren,
    Scissors,
    FlaskConical,
    Scan,
    Pill,
    MonitorPlay,
    MessageCircle,
    BarChart,
    ChevronLeft,
    ChevronRight,
    Search,
    UserCircle,
    Microscope,
    Terminal
} from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';

// Map href (specific enough) to Lucide Icon
const iconMap: Record<string, any> = {
    '/dashboard': LayoutDashboard,
    '/dashboard/crm/intake': Clipboard,
    '/dashboard/crm/authorizations': FileText,
    '/dashboard/crm/coordination': Users, // or HeartHandshake
    '/dashboard/scheduling/patient': Users, // Calendar days?
    '/dashboard/scheduling/monitor': Activity,
    '/dashboard/clinical': Stethoscope,
    '/dashboard/specialty': Stethoscope, // Star?
    '/dashboard/beds': Bed,
    '/dashboard/ed': Siren,
    '/dashboard/or': Scissors,
    '/dashboard/lis': FlaskConical,
    '/dashboard/radiology': Scan,
    '/dashboard/pharmacy': Pill,
    '/dashboard/evv': MapPin,
    '/dashboard/rpm': MonitorPlay,
    '/dashboard/billing': Receipt,
    '/dashboard/payroll': Wallet,
    '/dashboard/email': Mail,
    '/dashboard/storage': FolderOpen,
    '/dashboard/phone': Phone,
    '/dashboard/fax': Printer,
    '/dashboard/forms': FileText,
    '/dashboard/workflows': Workflow,
    '/dashboard/research': Microscope,
    '/dashboard/portals/family': Users,
    '/dashboard/portals/employee': UserCircle,
    '/dashboard/engagement': MessageCircle,
    '/dashboard/audit': Activity, // Shield?
    '/dashboard/reports': BarChart,
    '/dashboard/cli': Terminal,
    '/dashboard/cli/toad': Terminal,
    '/dashboard/ai': Brain,
    '/dashboard/settings': Settings,
    '/dashboard/admin': Users // Team
};

interface NavItem {
    name: string;
    href: string;
    icon: string; // Emoji from props, ignored in favor of local map
    enabled?: boolean;
}

interface SidebarProps {
    navItems?: NavItem[];
}

/**
 * Nord-themed Sidebar Component
 * Enhanced with Polar Night gradients and Frost accents
 */
export default function Sidebar({ navItems = [] }: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // Fallback if no items passed (shouldn't happen with correct usage)
    const itemsToRender = navItems.length > 0 ? navItems : [
        { name: 'Dashboard', href: '/dashboard', icon: '🏠' }
    ];

    const NavLink = ({ item }: { item: NavItem }) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        const IconComponent = iconMap[item.href] || LayoutDashboard; // Default icon

        return (
            <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                    ? 'bg-primary/20 text-primary font-medium shadow-sm border border-primary/30'
                    : 'text-text-secondary hover:bg-surface-highlight hover:text-text-primary border border-transparent'
                    } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.name : ''}
            >
                <IconComponent
                    size={20}
                    className={`shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-text-tertiary group-hover:text-primary'
                        }`}
                />
                {!collapsed && <span className="text-sm truncate">{item.name}</span>}
            </Link>
        );
    };

    return (
        <aside
            className={`flex-shrink-0 flex flex-col h-full bg-nord0 transition-all duration-300 relative overflow-hidden ${collapsed ? 'w-16' : 'w-64'}`}
            style={{
                background: 'linear-gradient(180deg, var(--nord0) 0%, var(--nord1) 100%)'
            }}
        >
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-nord0/20 pointer-events-none" />

            {/* Content with z-index above overlay */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className={`p-4 border-b border-border/50 backdrop-blur-sm flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    <div className="flex items-center gap-3">
                        {!collapsed && (
                            <div className="size-8 relative flex items-center justify-center shrink-0 rounded-lg bg-primary/10 border border-primary/20">
                                <Image src="/logo.svg" alt="CarePulse Logo" width={20} height={20} className="object-contain" />
                            </div>
                        )}
                        {collapsed && (
                            <div className="size-8 relative flex items-center justify-center shrink-0 rounded-lg bg-primary/10 border border-primary/20">
                                <Image src="/logo.svg" alt="Logo" width={20} height={20} className="object-contain" />
                            </div>
                        )}

                        {!collapsed && (
                            <div className="flex flex-col overflow-hidden">
                                <h1 className="text-text-primary text-sm font-bold leading-tight truncate">CarePulse</h1>
                                <p className="text-text-tertiary text-[10px] font-normal truncate">Healthcare Platform</p>
                            </div>
                        )}
                    </div>
                    {/* Collapse Toggle */}
                    {!collapsed && (
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-1 rounded hover:bg-surface-highlight text-text-tertiary hover:text-text-primary transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                    )}
                </div>
                {collapsed && (
                    <div className="flex justify-center py-2 border-b border-border/50">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-1 rounded hover:bg-surface-highlight text-text-tertiary hover:text-text-primary transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
                    {itemsToRender.map((item) => (
                        <NavLink key={item.href} item={item} />
                    ))}
                </div>

                {/* Theme Toggle */}
                <div className={`p-3 border-t border-border/50 backdrop-blur-sm flex ${collapsed ? 'justify-center' : ''}`}>
                    <ThemeToggle />
                </div>

                {/* User Profile */}
                <div className={`p-4 border-t border-border/50 backdrop-blur-sm bg-surface/30 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="relative shrink-0">
                        <div className="size-8 rounded-full bg-gradient-to-br from-nord8 to-nord9 flex items-center justify-center text-nord0 font-semibold text-xs shadow-md">
                            UD
                        </div>
                        <div className="absolute bottom-0 right-0 size-2.5 bg-success rounded-full border-2 border-surface shadow-sm"></div>
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col overflow-hidden flex-1">
                            <p className="text-text-primary text-sm font-semibold truncate">User Demo</p>
                            <p className="text-text-secondary text-xs truncate">Administrator</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
