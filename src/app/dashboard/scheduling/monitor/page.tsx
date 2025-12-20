'use client';

import React from 'react';
import {
    Activity,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    Navigation,
    Loader2,
    Phone,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

export default function ScheduleMonitor() {
    const visits = [
        { id: 'V-1001', type: 'SN', patient: 'Robert Miller', caregiver: 'Diana Prince', scheduled: '08:00 AM', actual: '08:02 AM', variance: '+2m', status: 'On-Site', color: 'emerald' },
        { id: 'V-1002', type: 'HHA', patient: 'Sarah Connor', caregiver: 'Steve Rogers', scheduled: '09:00 AM', actual: '---', variance: '-15m', status: 'Late', color: 'rose' },
        { id: 'V-1003', type: 'PT', patient: 'James Wilson', caregiver: 'Natasha Romanoff', scheduled: '09:30 AM', actual: '09:28 AM', variance: '-2m', status: 'Traveling', color: 'blue' },
        { id: 'V-1004', type: 'OT', patient: 'Patricia Brown', caregiver: 'Wanda Maximoff', scheduled: '10:00 AM', actual: '---', variance: '---', status: 'Confirmed', color: 'amber' },
    ];

    return (
        <div className="p-6 space-y-6 bg-white dark:bg-[#111a22] min-h-screen transition-colors duration-300 font-sans">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Real Time Schedule Monitor</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Live tracking of all shifts and EVV verification statuses.</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-[#1e293b] p-1 rounded-lg">
                    <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-[#111a22] text-blue-600 dark:text-blue-400 rounded shadow-sm">Grid View</button>
                    <button className="px-4 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Map View</button>
                </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Overdue', value: '3', icon: <AlertCircle className="text-rose-500" />, color: 'rose', trend: 'High Priority' },
                    { label: 'In Progress', value: '18', icon: <Loader2 className="text-blue-500 animate-spin" />, color: 'blue', trend: 'Active Now' },
                    { label: 'Confirmed', value: '42', icon: <CheckCircle2 className="text-amber-500" />, color: 'amber', trend: 'Starting Soon' },
                    { label: 'Completed', value: '112', icon: <Activity className="text-emerald-500" />, color: 'emerald', trend: 'Today&apos;s Total' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                                <p className={`text-[10px] font-bold mt-2 text-${stat.color}-600 dark:text-${stat.color}-400 italic`}>{stat.trend}</p>
                            </div>
                            <div className={`p-3 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className={`absolute bottom-0 left-0 h-1 bg-${stat.color}-500 w-0 group-hover:w-full transition-all duration-500`} />
                    </div>
                ))}
            </div>

            {/* Main Content Card */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                {/* Filter & Live Indicator Bar */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-[#111a22]/30">
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search live queue..."
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#111a22] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none transition-all dark:text-white"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30 uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Live Sync Active
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Filter size={20} />
                        </button>
                        <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Export Logs</button>
                    </div>
                </div>

                {/* Live Monitor Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-[#111a22]">
                            <tr>
                                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient & Caregiver</th>
                                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Scheduled</th>
                                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actual</th>
                                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Variance</th>
                                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {visits.map((visit) => (
                                <tr key={visit.id} className="hover:bg-gray-50 dark:hover:bg-[#111a22]/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`p-2 rounded font-bold text-[10px] ${visit.type === 'SN' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                            }`}>
                                            {visit.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{visit.patient}</span>
                                            <span className="text-[10px] text-gray-500 dark:text-gray-400 italic">assigned to {visit.caregiver}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-600 dark:text-gray-300">
                                        {visit.scheduled}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-600 dark:text-gray-300">
                                        {visit.actual}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`flex items-center gap-1 text-[10px] font-black ${visit.variance.includes('+') ? 'text-rose-600 dark:text-rose-400' :
                                            visit.variance.includes('-') ? 'text-emerald-600 dark:text-emerald-400' :
                                                'text-gray-400'
                                            }`}>
                                            {visit.variance.includes('+') && <ArrowUpRight size={12} />}
                                            {visit.variance.includes('-') && <ArrowDownRight size={12} />}
                                            {visit.variance}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${visit.status === 'On-Site' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                            visit.status === 'Late' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' :
                                                visit.status === 'Traveling' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                                    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                                            }`}>
                                            <span className={`w-1 h-1 rounded-full ${visit.status === 'On-Site' ? 'bg-emerald-500' :
                                                visit.status === 'Late' ? 'bg-rose-500' :
                                                    visit.status === 'Traveling' ? 'bg-blue-500' :
                                                        'bg-gray-500'
                                                }`}></span>
                                            {visit.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2 group-hover:opacity-100 lg:opacity-0 transition-opacity">
                                            <button className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="GPS Map Link">
                                                <Navigation size={16} />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="Contact Field Staff">
                                                <Phone size={16} />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="p-4 bg-gray-50 dark:bg-[#111a22] border-t border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#111a22]/30">
                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 italic">
                        All GPS data verified via CV-Mobile integration. Next sweep in 4s.
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#1e293b] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded transition-all">Previous</button>
                        <button className="px-3 py-1 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#1e293b] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded transition-all">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
