"use client";
'use client';

import React, { useState, ReactNode } from 'react';

type TabType = 'intake' | 'auth' | 'onboarding';

export default function WorkflowsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('intake');

    return (
        <div className="flex flex-col h-full bg-background-dark text-white">
            {/* Header */}
            <header className="h-16 border-b border-border-dark flex items-center justify-between px-6 bg-surface-dark shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold">Workflow Boards</h1>
                    <div className="h-6 w-px bg-border-dark"></div>
                    <nav className="flex gap-1 bg-background-dark p-1 rounded-lg">
                        <TabButton label="Client Intake" id="intake" activeTab={activeTab} setTab={setActiveTab} />
                        <TabButton label="Prior Auth" id="auth" activeTab={activeTab} setTab={setActiveTab} />
                        <TabButton label="HR Onboarding" id="onboarding" activeTab={activeTab} setTab={setActiveTab} />
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-blue-600 rounded text-sm font-semibold transition-colors">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        <span>New {activeTab === 'intake' ? 'Lead' : activeTab === 'auth' ? 'Request' : 'Applicant'}</span>
                    </button>
                </div>
            </header>

            {/* Main Kanban Area */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                {activeTab === 'intake' && <IntakeBoard />}
                {activeTab === 'auth' && <AuthBoard />}
                {activeTab === 'onboarding' && <OnboardingBoard />}
            </main>
        </div>
    );
}

interface TabButtonProps {
    label: string;
    id: TabType;
    activeTab: TabType;
    setTab: (tab: TabType) => void;
}

function TabButton({ label, id, activeTab, setTab }: TabButtonProps) {
    const isActive = activeTab === id;
    return (
        <button
            onClick={() => setTab(id)}
            className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${isActive ? 'bg-primary text-white shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
            {label}
        </button>
    );
}

interface KanbanColumnProps {
    title: string;
    count?: number;
    color: 'blue' | 'yellow' | 'purple' | 'green' | 'slate' | 'orange';
    children: ReactNode;
}

function KanbanColumn({ title, count, color, children }: KanbanColumnProps) {
    const colorMap: Record<string, string> = {
        blue: "bg-blue-500",
        yellow: "bg-yellow-500",
        purple: "bg-purple-500",
        green: "bg-green-500",
        slate: "bg-slate-500",
        orange: "bg-orange-500",
    };

    return (
        <div className="w-80 flex flex-col h-full bg-surface-dark rounded-xl border border-border-dark shrink-0">
            <div className="p-3 border-b border-border-dark flex justify-between items-center bg-white/5 rounded-t-xl">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${colorMap[color]}`}></span>
                    <h3 className="font-bold text-sm">{title}</h3>
                    {count !== undefined && <span className="text-xs bg-white/10 px-1.5 rounded text-slate-400">{count}</span>}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {children}
            </div>
        </div>
    );
}

interface KanbanCardProps {
    title: string;
    subtitle: string;
    tags?: ReactNode;
    footer?: ReactNode;
}

function KanbanCard({ title, subtitle, tags, footer }: KanbanCardProps) {
    return (
        <div className="bg-background-dark p-4 rounded border border-border-dark hover:border-primary/50 cursor-pointer group">
            {tags && <div className="flex justify-between items-start mb-2">{tags}</div>}
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
            {footer && <div className="mt-3 flex items-center justify-between border-t border-border-dark pt-2">{footer}</div>}
        </div>
    );
}

// --- Specific Boards ---

function IntakeBoard() {
    return (
        <div className="flex h-full gap-6 min-w-max">
            <KanbanColumn title="New Lead" count={3} color="blue">
                <KanbanCard
                    title="Martha Stewart"
                    subtitle="Referred by St. Mary's Hospital. Needs 24/7 care."
                    tags={<><span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">MEDICAID</span><span className="text-xs text-slate-500">2h ago</span></>}
                    footer={<><div className="flex items-center gap-1 text-slate-400 text-xs"><span className="material-symbols-outlined text-[14px]">call</span> Call Pending</div><div className="w-6 h-6 rounded-full bg-indigo-600 text-[10px] flex items-center justify-center">JD</div></>}
                />
            </KanbanColumn>
            <KanbanColumn title="Consult Scheduled" count={2} color="yellow">
                <KanbanCard
                    title="George Miller"
                    subtitle="Consultation for memory care services."
                    tags={<><span className="text-[10px] font-bold text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded">PRIVATE PAY</span><span className="text-xs text-slate-500">1d ago</span></>}
                    footer={<div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-1 flex items-center gap-2 w-full"><span className="material-symbols-outlined text-yellow-500 text-[16px]">event</span><span className="text-xs text-yellow-500 font-medium">Tomorrow, 2:00 PM</span></div>}
                />
            </KanbanColumn>
            <KanbanColumn title="Assessment Review" count={1} color="purple">
                <KanbanCard
                    title="Alice Wonderland"
                    subtitle="RN Assessment uploaded. Creating Care Plan."
                    tags={undefined}
                    footer={<div className="flex gap-1"><span className="text-[10px] border border-border-dark px-1 rounded text-slate-400">OASIS-E</span></div>}
                />
            </KanbanColumn>
            <KanbanColumn title="Ready for Staffing" count={4} color="green">
                <KanbanCard
                    title="John Doe"
                    subtitle="Auth Approved (T1019). Needs staffing."
                    tags={undefined}
                    footer={<button className="w-full py-1.5 bg-border-dark hover:bg-primary/20 hover:text-primary rounded text-xs font-bold transition-colors">Find Caregiver</button>}
                />
            </KanbanColumn>
        </div>
    );
}

function AuthBoard() {
    return (
        <div className="flex h-full gap-6 min-w-max">
            <KanbanColumn title="Draft" count={undefined} color="slate">
                <KanbanCard title="T1019 - Sarah Connor" subtitle="Missing Diagnosis Code" />
            </KanbanColumn>
            <KanbanColumn title="Submitted to Payer" count={undefined} color="blue">
                <KanbanCard title="James Bond" subtitle="ForwardHealth. Sent Oct 23." />
            </KanbanColumn>
            <KanbanColumn title="Approved" count={undefined} color="green">
                <div className="bg-background-dark p-4 rounded border border-border-dark cursor-pointer border-l-4 border-l-green-500">
                    <h4 className="font-semibold text-white">Ellen Ripley</h4>
                    <p className="text-xs text-green-400 font-bold mt-1">450 Units / 6 Months</p>
                    <p className="text-xs text-slate-500">Exp: Apr 2024</p>
                </div>
            </KanbanColumn>
        </div>
    );
}

function OnboardingBoard() {
    return (
        <div className="flex h-full gap-6 min-w-max">
            <KanbanColumn title="New Applicants" count={5} color="slate">
                <KanbanCard title="Harry Potter" subtitle="Applied for: CNA (Full Time)" footer={<button className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Review</button>} />
            </KanbanColumn>
            <KanbanColumn title="Background Check" count={undefined} color="orange">
                <KanbanCard title="Ron Weasley" subtitle="Processing (WI DOJ)" />
            </KanbanColumn>
            <KanbanColumn title="Training" count={undefined} color="purple">
                <div className="bg-background-dark p-4 rounded border border-border-dark cursor-pointer">
                    <h4 className="font-semibold text-white">Hermione Granger</h4>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-purple-500 h-full w-[80%]"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">4/5 Modules Complete</p>
                </div>
            </KanbanColumn>
        </div>
    );
}
