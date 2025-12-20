'use client';

import React, { useState } from 'react';
import {
    Search,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Zap,
    Plus,
    Clock,
    AlertTriangle,
} from 'lucide-react';

export default function PatientScheduling() {
    const [selectedPatient, setSelectedPatient] = useState('Robert Miller');

    const patients = [
        { name: 'Robert Miller', id: 'P-101', status: 'Active', plan: 'HHA 24/7' },
        { name: 'Sarah Connor', id: 'P-102', status: 'Active', plan: 'SN Weekly' },
        { name: 'James Wilson', id: 'P-103', status: 'Pending', plan: 'PT/OT Evaluation' },
        { name: 'Patricia Brown', id: 'P-104', status: 'Active', plan: 'HHA Daily' },
    ];

    const schedule = [
        { day: 'Mon', date: '25', shifts: [{ type: 'HHA visit', time: '8a-12p', caregiver: 'Diana P.', color: 'blue' }] },
        { day: 'Tue', date: '26', shifts: [{ type: 'SN visit', time: '10a-11a', caregiver: 'Steve R.', color: 'emerald' }] },
        { day: 'Wed', date: '27', shifts: [{ type: 'HHA visit', time: '8a-12p', caregiver: 'Diana P.', color: 'blue' }] },
        { day: 'Thu', date: '28', shifts: [] },
        { day: 'Fri', date: '29', shifts: [{ type: 'HHA visit', time: '8a-12p', caregiver: 'Diana P.', color: 'blue' }] },
        { day: 'Sat', date: '30', shifts: [] },
        { day: 'Sun', date: '31', shifts: [] },
    ];

    return (
        <div className="flex h-screen bg-white dark:bg-[#111a22] transition-colors duration-300 font-sans overflow-hidden">
            {/* Master: Patient List Sidebar */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full bg-gray-50 dark:bg-[#111a22]/50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Patient Scheduling</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Find patient..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none transition-all dark:text-white focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {patients.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setSelectedPatient(p.name)}
                            className={`w-full flex flex-col p-3 rounded-lg transition-all text-left group ${selectedPatient === p.name
                                ? 'bg-white dark:bg-[#1e293b] shadow-sm border border-gray-200 dark:border-gray-700'
                                : 'hover:bg-gray-200 dark:hover:bg-gray-800/50 border border-transparent'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-bold ${selectedPatient === p.name ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-200'}`}>
                                    {p.name}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono tracking-tighter">{p.id}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 italic line-clamp-1">{p.plan}</span>
                            <div className="flex items-center gap-2 mt-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.status}</span>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="p-4 bg-blue-600 text-white m-4 rounded-xl shadow-lg relative overflow-hidden group cursor-pointer">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={16} className="text-yellow-300 fill-yellow-300" />
                            <span className="text-xs font-bold uppercase tracking-widest">AI Optimizer</span>
                        </div>
                        <p className="text-[10px] text-blue-100 font-medium leading-tight">Match caregiver skills and minimize travel time.</p>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                </div>
            </div>

            {/* Detail: Schedule Grid */}
            <div className="flex-1 flex flex-col bg-white dark:bg-[#111a22] h-full overflow-hidden">
                {/* Grid Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#111a22] z-20">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedPatient}&apos;s Schedule</h3>
                        <div className="flex bg-gray-100 dark:bg-[#1e293b] p-1 rounded-lg">
                            <button className="px-3 py-1 text-xs font-bold text-gray-900 dark:text-white bg-white dark:bg-[#111a22] rounded shadow-sm">Week</button>
                            <button className="px-3 py-1 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Month</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                            <button className="p-2 hover:bg-gray-50 dark:hover:bg-[#1e293b] text-gray-400"><ChevronLeft size={16} /></button>
                            <span className="px-4 py-1.5 text-xs font-bold text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-700">Oct 25 - Oct 31, 2023</span>
                            <button className="p-2 hover:bg-gray-50 dark:hover:bg-[#1e293b] text-gray-400"><ChevronRight size={16} /></button>
                        </div>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all">
                            <Plus size={18} />
                            <span>Add Shift</span>
                        </button>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-7 min-w-[1000px] h-full border-b border-gray-200 dark:border-gray-800">
                        {schedule.map((day) => (
                            <div key={day.day} className="border-r border-gray-200 dark:border-gray-800 last:border-r-0 flex flex-col bg-gray-50/30 dark:bg-[#111a22]/10 h-full">
                                <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111a22] sticky top-0 z-10 text-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{day.day}</span>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{day.date}</p>
                                </div>
                                <div className="flex-1 p-2 space-y-2">
                                    {day.shifts.map((shift, i) => (
                                        <div
                                            key={i}
                                            className={`p-2.5 rounded-lg border-l-4 shadow-sm group cursor-pointer transition-all hover:translate-x-1 ${shift.color === 'blue'
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-900 dark:text-blue-100'
                                                : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest">{shift.type}</span>
                                                <MoreVertical size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-xs font-bold leading-tight line-clamp-2">{shift.caregiver}</p>
                                            <div className="flex items-center gap-1 mt-2 text-[10px] font-bold opacity-70">
                                                <Clock size={10} />
                                                <span>{shift.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-gray-400 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group">
                                        <Plus size={16} className="group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase tracking-widest mt-1">Assign</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid Footer / Summary */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111a22] flex justify-between items-center z-20">
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">HHA (32 hrs/wk)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">SN (4 hrs/wk)</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                            <AlertTriangle size={14} />
                            <span>2 Potential Conflicts Found</span>
                        </div>
                        <button className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline">Re-Validate All</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
