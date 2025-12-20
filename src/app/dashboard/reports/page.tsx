'use client';

import React, { useState } from 'react';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Download,
    Filter,
    Calendar,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    Printer,
    FileSpreadsheet,
    Sparkles,
    Bell,
    ShieldCheck,
    Briefcase,
    MoreVertical
} from 'lucide-react';

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState<'library' | 'custom' | 'scheduled' | 'bi' | 'compliance'>('library');


    const recentReports = [
        { name: 'Monthly Revenue by Payer', category: 'Financial', lastRun: '2 hours ago', format: 'XLSX' },
        { name: 'Caregiver Overtime Watchdog', category: 'Operations', lastRun: '10 mins ago', format: 'PDF' },
        { name: 'OASIS-E Completion Rates', category: 'Clinical', lastRun: 'Yesterday', format: 'XLSX' },
        { name: 'EVV Compliance Audit', category: 'Compliance', lastRun: 'Oct 20, 2023', format: 'CSV' },
    ];

    return (
        <div className="flex h-screen bg-white dark:bg-[#111a22] transition-colors duration-300 font-sans overflow-hidden">
            {/* Reports Sidebar */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full bg-gray-50 dark:bg-[#111a22]/50">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white shadow-lg">
                            <BarChart3 size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reports & BI</h1>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Intelligence Engine</p>
                            <p className="text-lg font-black text-gray-900 dark:text-white truncate">Agency Health v2.4</p>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
                                <TrendingUp size={12} /> Live Data Stream Active
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {[
                        { id: 'library', label: 'Report Library', icon: <Briefcase size={18} />, count: 42 },
                        { id: 'custom', label: 'Custom Builder', icon: <Sparkles size={18} />, count: 'New' },
                        { id: 'scheduled', label: 'Scheduled Exports', icon: <Calendar size={18} />, count: 5 },
                        { id: 'bi', label: 'BI Visualizations', icon: <PieChart size={18} />, count: 8 },
                        { id: 'compliance', label: 'Compliance Audits', icon: <ShieldCheck size={18} />, count: 3 },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as 'library' | 'custom' | 'scheduled' | 'bi' | 'compliance')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#1e293b]'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                <span className="text-sm font-bold">{item.label}</span>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                                }`}>{item.count}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border-t border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Printer size={14} className="text-indigo-600" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Global Export Center</span>
                    </div>
                    <p className="text-[11px] text-indigo-800 dark:text-indigo-300 font-medium leading-relaxed">System supports PDF, XLSX, and CSV (CMS-1500 compliant formats).</p>
                </div>
            </div>

            {/* Reports Workspace */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111a22]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#111a22] z-10">
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search report library..."
                                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#111a22] border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-slate-500/20 transition-all dark:text-white lg:w-80"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-all">
                            <Filter size={14} /> More Filters
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#111a22]" />
                        </button>
                        <button className="bg-slate-900 dark:bg-white dark:text-black text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-slate-200 dark:shadow-none flex items-center gap-2 transition-transform active:scale-95 group">
                            <Sparkles size={16} /> Create Custom BI
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {activeTab === 'library' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* KPI Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Revenue (MM)', value: '$1.24', trend: '+12.5%', trendDir: 'up' },
                                    { label: 'Active Patients', value: '482', trend: '+4%', trendDir: 'up' },
                                    { label: 'Avg Length of Stay', value: '184d', trend: '-2.1%', trendDir: 'down' },
                                    { label: 'NP Margin', value: '18.4%', trend: '+0.5%', trendDir: 'up' },
                                ].map((kpi) => (
                                    <div key={kpi.label} className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                                            <TrendingUp size={60} />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">{kpi.label}</p>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-2xl font-black text-gray-900 dark:text-white leading-none tabular-nums">{kpi.value}</p>
                                            <span className={`text-[10px] font-bold ${kpi.trendDir === 'up' ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-0.5`}>
                                                {kpi.trendDir === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                                {kpi.trend}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Recent Agency Reports</h3>
                                    <span className="text-[10px] font-bold text-gray-400 italic">Auto-refresh: Every 15 mins</span>
                                </div>
                                <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 dark:bg-[#111a22]">
                                            <tr>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Report Name</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Run</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Preferred Type</th>
                                                <th className="px-6 py-4 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {recentReports.map((report) => (
                                                <tr key={report.name} className="hover:bg-gray-50 dark:hover:bg-[#111a22]/50 transition-colors group">
                                                    <td className="px-6 py-4 text-xs">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"><FileSpreadsheet size={16} /></div>
                                                            <span className="font-bold text-gray-900 dark:text-white capitalize">{report.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-full">{report.category}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 italic">{report.lastRun}</span>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-[10px] text-gray-400 font-black">{report.format}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                            <button className="p-2 text-gray-400 hover:text-slate-900 dark:hover:text-white"><Download size={16} /></button>
                                                            <button className="p-2 text-gray-400 hover:text-slate-900 dark:hover:text-white"><MoreVertical size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bi' && (
                        <div className="animate-in slide-in-from-right-5 duration-500">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Business Intelligence Visualizations</h2>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-blue-200">New Dashboard</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative group overflow-hidden h-80">
                                    <PieChart size={32} className="text-blue-500 mb-6" />
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Payer Mix Analysis</h3>
                                    <p className="text-xs text-gray-400 mb-8">Live breakdown of revenue streams across Medicare, Medicaid, and Private Pay.</p>
                                    <div className="flex items-end gap-2 h-20">
                                        <div className="flex-1 bg-blue-500 rounded-t-lg h-[80%]" />
                                        <div className="flex-1 bg-indigo-500 rounded-t-lg h-[45%]" />
                                        <div className="flex-1 bg-emerald-500 rounded-t-lg h-[60%]" />
                                        <div className="flex-1 bg-slate-300 dark:bg-slate-700 rounded-t-lg h-[25%]" />
                                    </div>
                                </div>
                                <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 dark:shadow-none flex flex-col justify-between">
                                    <div>
                                        <TrendingUp className="text-indigo-200 mb-4" size={32} />
                                        <h3 className="text-lg font-black leading-tight mb-2 uppercase tracking-wide">Predictive Analytics</h3>
                                        <p className="text-indigo-100 text-sm font-medium opacity-80">AI-driven forecasts for payroll expansion and patient acquisition for Q4 2024.</p>
                                    </div>
                                    <button className="w-full mt-6 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors">Generate Projection</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
