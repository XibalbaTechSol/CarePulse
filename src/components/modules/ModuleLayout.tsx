
import React, { ReactNode } from 'react';
// Separator import removed
// Would ideally import a Breadcrumb component
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { AIInsightPanel } from '@/components/ai/AIInsightPanel';

interface ModuleLayoutProps {
    children: ReactNode;
    moduleName: string;
    moduleIcon?: ReactNode;
    breadcrumbs?: { label: string; href: string }[];
    showAI?: boolean;
}

export function ModuleLayout({
    children,
    moduleName,
    moduleIcon,
    breadcrumbs = [],
    showAI = true
}: ModuleLayoutProps) {
    return (
        <div className="flex h-full w-full bg-nord6 dark:bg-nord0">
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-14 border-b border-nord4 dark:border-nord2 bg-nord6 dark:bg-nord1 flex items-center px-6 sticky top-0 z-10">
                    <nav className="flex items-center text-sm text-nord3 dark:text-nord4">
                        <Link href="/dashboard" className="hover:text-nord0 dark:hover:text-nord6 flex items-center">
                            <Home size={16} />
                        </Link>
                        <ChevronRight size={16} className="mx-2" />
                        <span className="font-semibold text-nord0 dark:text-nord6 flex items-center gap-2">
                            {moduleIcon}
                            {moduleName}
                        </span>
                        {breadcrumbs.map((crumb, i) => (
                            <React.Fragment key={crumb.href}>
                                <ChevronRight size={16} className="mx-2" />
                                <Link href={crumb.href} className="hover:text-nord0 dark:hover:text-nord6">
                                    {crumb.label}
                                </Link>
                            </React.Fragment>
                        ))}
                    </nav>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto p-6 relative custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* AI Panel (Right Sidebar) */}
            {showAI && (
                <div className="w-80 border-l border-nord4 dark:border-nord2 bg-nord6 dark:bg-nord1 hidden xl:block h-full overflow-y-auto custom-scrollbar">
                    <AIInsightPanel context={{ module: moduleName }} />
                </div>
            )}
        </div>
    );
}
