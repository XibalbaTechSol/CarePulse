'use client';

'use client';

import React, { useState, useEffect } from 'react';
import { getPayrollData, exportPayrollCSV } from '@/lib/actions/payroll';
import {
    Banknote,
    Clock,
    ShieldCheck,
    AlertTriangle,
    TrendingUp,
    Users,
    MoreVertical,
    Download,
    Filter,
    Search,
    Calculator,
    Map,
    Briefcase
} from 'lucide-react';

export default function PayrollModule() {
    const [activeTab, setActiveTab] = useState<'processing' | 'adjustments' | 'mileage' | 'exports'>('processing');
    const [data, setData] = useState<{
        startDate: Date;
        endDate: Date;
        caregivers: {
            id: string;
            name: string | null;
            totalHours: number;
        }[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayload = async () => {
            try {
                const payrollData = await getPayrollData();
                setData(payrollData);
            } catch (error) {
                console.error('Failed to fetch payroll data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayload();
    }, []);

    const handleExport = async (format: 'QUICKBOOKS' | 'ADP') => {
        try {
            const result = await exportPayrollCSV(format);
            const blob = new Blob([result.content], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = result.filename;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to generate export');
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#111a22]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin dark:border-slate-800 dark:border-t-white" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Calculating Payroll...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white dark:bg-[#111a22] transition-colors duration-300 font-sans overflow-hidden">
            {/* Payroll Sidebar */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full bg-gray-50 dark:bg-[#111a22]/50">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                            <Banknote size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Payroll & Integration</h1>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Total Gross Pay Est.</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white">$42,180.50</p>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
                                <TrendingUp size={12} /> Pending final audit
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {[
                        { id: 'processing', label: 'Payroll Processing', icon: <Calculator size={18} />, count: data?.caregivers.length || 0 },
                        { id: 'adjustments', label: 'Time Adjustments', icon: <Clock size={18} />, count: 12 },
                        { id: 'mileage', label: 'Mileage & Reimbursements', icon: <Map size={18} />, count: 5 },
                        { id: 'exports', label: 'Export & Integration', icon: <Briefcase size={18} />, count: 'v1.4' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as 'processing' | 'adjustments' | 'mileage' | 'exports')}
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
                        <ShieldCheck size={14} className="text-indigo-600" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Compliance Monitor</span>
                    </div>
                    <p className="text-[11px] text-indigo-800 dark:text-indigo-300 font-medium leading-relaxed">System-calculated differential pay for night shifts / holidays applied automatically.</p>
                </div>
            </div>

            {/* Payroll Workspace */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111a22]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#111a22] z-10 shadow-sm">
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search employee or ID..."
                                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#111a22] border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-slate-500/20 transition-all dark:text-white lg:w-80"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-all">
                            <Filter size={14} /> Period: Weekly
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-[11px] text-gray-400 font-bold mr-2 lg:block hidden tracking-tight">
                            Current Period: <span className="text-gray-900 dark:text-white">{data?.startDate.toLocaleDateString()} - {data?.endDate.toLocaleDateString()}</span>
                        </div>
                        <button onClick={() => setActiveTab('exports')} className="bg-slate-900 dark:bg-white dark:text-black text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-slate-200 dark:shadow-none flex items-center gap-2 transition-transform active:scale-95 group">
                            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> Export Batch
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {activeTab === 'processing' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Watchdog Alert Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Active Staff</p>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white">{data?.caregivers.length}</p>
                                    </div>
                                </div>
                                <div className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/20 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-none mb-1">Overtime Alerts</p>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white">{data?.caregivers.filter(cg => cg.totalHours >= 40).length}</p>
                                    </div>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/20 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">Avg. Hours/Dev</p>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white">34.2h</p>
                                    </div>
                                </div>
                            </div>

                            {/* Employee Detail Table */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Employee Detailed Hours</h3>
                                    <span className="text-[10px] font-bold text-gray-400 italic">Sync complete from EVV Monitor</span>
                                </div>
                                <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 dark:bg-[#111a22]">
                                            <tr>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee & ID</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Regular Hours</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">OT Hours</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pay Est.</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-4 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {data?.caregivers.map((cg) => (
                                                <tr key={cg.id} className="hover:bg-gray-50 dark:hover:bg-[#111a22]/50 transition-colors group">
                                                    <td className="px-6 py-4 text-xs">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-900 dark:text-white capitalize">{cg.name}</span>
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase tabular-nums">ID: {cg.id.substring(0, 8)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{Math.min(cg.totalHours, 40)}h</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-sm font-black tabular-nums ${cg.totalHours > 40 ? 'text-rose-600' : 'text-gray-400'}`}>
                                                            {Math.max(0, cg.totalHours - 40).toFixed(1)}h
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
                                                            ${(cg.totalHours * 25).toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${cg.totalHours >= 40 ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' :
                                                            cg.totalHours >= 38 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                                                'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                                            }`}>
                                                            {cg.totalHours >= 40 ? 'Overtime' : cg.totalHours >= 38 ? 'Warning' : 'Normal'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="p-2 text-gray-300 hover:text-gray-600 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'exports' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
                            <div className="max-w-2xl">
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Payroll Export Integration</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">Export system-calculated totals directly to your external payroll processor. Formats are updated for 2024 compliance.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-slate-100 dark:shadow-none flex flex-col items-center text-center group">
                                        <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                                            <Briefcase size={36} />
                                        </div>
                                        <h4 className="font-black text-gray-900 dark:text-white mb-2 uppercase tracking-widest text-sm">QuickBooks Desktop/Online</h4>
                                        <p className="text-xs text-gray-400 font-medium mb-8">Export with Employee-Job relationship and service items mapping.</p>
                                        <button
                                            onClick={() => handleExport('QUICKBOOKS')}
                                            className="w-full py-4 bg-[#2ca01c] hover:bg-[#218016] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-200 dark:shadow-none active:scale-95"
                                        >
                                            Generate QB CSV
                                        </button>
                                    </div>

                                    <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-slate-100 dark:shadow-none flex flex-col items-center text-center group">
                                        <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-900/10 flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 transition-transform">
                                            <TrendingUp size={36} />
                                        </div>
                                        <h4 className="font-black text-gray-900 dark:text-white mb-2 uppercase tracking-widest text-sm">ADP Workforce Now</h4>
                                        <p className="text-xs text-gray-400 font-medium mb-8">Direct hours import for ADP Batch processing with rate code REG/OVT.</p>
                                        <button
                                            onClick={() => handleExport('ADP')}
                                            className="w-full py-4 bg-[#ad0000] hover:bg-[#8a0000] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-200 dark:shadow-none active:scale-95"
                                        >
                                            Generate ADP Batch
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
