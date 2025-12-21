'use client';

'use client';

import React, { useState, useEffect } from 'react';
import EvvMonitor from '@/components/evv/EvvMonitor';
import {
    MapPin,
    AlertTriangle,
    ShieldCheck,
    Smartphone,
    History,
    Search,
    Filter,
    Download,
    Navigation
} from 'lucide-react';

import { getDashboardStats, getEvvExceptions, resolveException } from '@/lib/actions/evv';

export default function EVVPage() {
    const [view, setView] = useState<'monitor' | 'exceptions' | 'history' | 'mobile'>('monitor');
    const [exceptions, setExceptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        missedVisits: 0,
        expiringAuths: 0,
        unbilledVerified: 0
    });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const statsRes = await getDashboardStats();
            if (statsRes) {
                setStats(statsRes);
            }

            const res = await getEvvExceptions();
            if (res.success && res.data) {
                setExceptions(res.data);
            }
            setLoading(false);
        };

        loadData();
    }, []);

    const handleResolve = async (id: string, action: 'RESOLVE' | 'REJECT' | 'APPROVE') => {
        if (!confirm(`Are you sure you want to ${action} this exception?`)) return;
        const res = await resolveException(id, action);
        if (res.success) {
            alert(res.message);
            // Reload
            const reload = await getEvvExceptions();
            if (reload.success && reload.data) setExceptions(reload.data);
        } else {
            alert('Failed to process exception');
        }
    };

    return (
        <div className="flex h-screen bg-white dark:bg-[#111a22] transition-colors duration-300 font-sans overflow-hidden">
            {/* EVV Sidebar */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full bg-gray-50 dark:bg-[#111a22]/50">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
                            <MapPin size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">EVV & Console</h1>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Compliance Rating</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white">99.8%</p>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
                                <ShieldCheck size={12} /> DHS Aggregator Sync: OK
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {[
                        { id: 'monitor', label: 'Live GPS Monitor', icon: <Navigation size={18} />, count: 14 },
                        { id: 'exceptions', label: 'EVV Exceptions', icon: <AlertTriangle size={18} />, count: exceptions.length || stats.missedVisits },
                        { id: 'history', label: 'Visit History Logs', icon: <History size={18} />, count: 'v1.0' },
                        { id: 'mobile', label: 'Mobile App Status', icon: <Smartphone size={18} />, count: 'Active' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id as 'monitor' | 'exceptions' | 'history' | 'mobile')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${view === item.id
                                ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#1e293b]'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                <span className="text-sm font-bold">{item.label}</span>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${view === item.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                                }`}>{item.count}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border-t border-amber-100 dark:border-amber-900/30">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={14} className="text-amber-600" />
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Late Alert Watchdog</span>
                    </div>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                        {stats.missedVisits > 0 ? `${stats.missedVisits} Visits missed/late.` : 'System running smoothly.'}
                    </p>
                </div>
            </div>

            {/* EVV Workspace */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111a22]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#111a22] z-40">
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search field staff or client..."
                                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#111a22] border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-slate-500/20 transition-all dark:text-white lg:w-80"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-all">
                            <Filter size={14} /> Filter Status
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                            Live GPS Sync Enabled
                        </span>
                        <button className="bg-slate-900 dark:bg-white dark:text-black text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-slate-200 dark:shadow-none flex items-center gap-2 transition-transform active:scale-95 group">
                            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> Export Aggregator Logs
                        </button>
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden">
                    {view === 'monitor' && (
                        <div className="h-full w-full animate-in fade-in duration-500">
                            <EvvMonitor />
                        </div>
                    )}

                    {view === 'exceptions' && (
                        <div className="p-8 space-y-6 animate-in slide-in-from-bottom-5 duration-500 overflow-y-auto h-full custom-scrollbar">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Critical EVV Exceptions</h3>
                                <span className="text-[10px] font-bold text-gray-400 italic">Requires administrative sign-off</span>
                            </div>

                            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-[#111a22]">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Caregiver</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {loading ? (
                                            <tr><td colSpan={5} className="p-4 text-center">Loading exceptions...</td></tr>
                                        ) : exceptions.length === 0 ? (
                                            <tr><td colSpan={5} className="p-4 text-center">No active exceptions found.</td></tr>
                                        ) : exceptions.map((exc, i) => (
                                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#111a22]/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-${exc.color}-100 dark:bg-${exc.color}-900/30 text-${exc.color}-700 dark:text-${exc.color}-400`}>
                                                        {exc.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-bold text-gray-900 dark:text-white capitalize">{exc.staff}</td>
                                                <td className="px-6 py-4 text-xs font-bold text-gray-900 dark:text-white capitalize">{exc.client}</td>
                                                <td className="px-6 py-4 text-[10px] text-gray-400 font-medium">{exc.detail}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleResolve(exc.id, 'RESOLVE')}
                                                        className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors">
                                                        Resolve
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
