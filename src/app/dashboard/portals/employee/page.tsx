'use client';

'use client';

import React, { useState } from 'react';
import {
    UserCircle,
    Calendar,
    Award,
    Wallet,
    MessageSquare,
    Clock,
    ChevronRight,
    ArrowUpRight,
    FileText,
    ScanFace,
    Search,
    Bell,
    CheckCircle2,
    Briefcase,
    BookOpen,
    MoreVertical
} from 'lucide-react';

export default function EmployeePortal() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'paystubs' | 'credentials' | 'training'>('dashboard');

    const upcomingAssignments = [
        { patient: 'Robert Miller', date: 'Oct 24', time: '09:00 AM - 01:00 PM', location: '123 Maple St, Madison', type: 'Clinical' },
        { patient: 'Alice Wonderland', date: 'Oct 25', time: '10:00 AM - 02:00 PM', location: '456 Oak Ave, Verona', type: 'Personal Care' },
    ];


    return (
        <div className="flex h-screen bg-white dark:bg-[#111a22] transition-colors duration-300 font-sans overflow-hidden">
            {/* Employee Portal Sidebar */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full bg-gray-50 dark:bg-[#111a22]/50">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none font-black text-xl">
                            <UserCircle size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Staff Portal</h1>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                                <ScanFace size={40} />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Employee ID</p>
                            <p className="text-lg font-black text-gray-900 dark:text-white">#EMP-8842</p>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1 uppercase tracking-tighter">
                                <CheckCircle2 size={12} /> Status: Fully Compliant
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {[
                        { id: 'dashboard', label: 'My Dashboard', icon: <Briefcase size={18} />, count: 'v1.2' },
                        { id: 'schedule', label: 'My Schedule', icon: <Calendar size={18} />, count: 2 },
                        { id: 'paystubs', label: 'Pay Stubs & Tax', icon: <Wallet size={18} />, count: 24 },
                        { id: 'credentials', label: 'My Credentials', icon: <Award size={18} />, count: 3 },
                        { id: 'training', label: 'LearnLoop Training', icon: <BookOpen size={18} />, count: 2 },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as 'dashboard' | 'schedule' | 'paystubs' | 'credentials' | 'training')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-indigo-600 text-white shadow-md'
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
                        <MessageSquare size={14} className="text-indigo-600" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Agency Communication</span>
                    </div>
                    <p className="text-[11px] text-indigo-800 dark:text-indigo-300 font-medium leading-relaxed">Direct support available for payroll queries via staff chat.</p>
                </div>
            </div>

            {/* Portal Workspace */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111a22]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#111a22] z-10">
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search schedule/docs..."
                                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#111a22] border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white lg:w-80"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#111a22]" />
                        </button>
                        <button className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2 transition-transform active:scale-95 group">
                            <Clock size={16} /> Request Time Off
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Hot Shift Card */}
                            <div className="bg-indigo-700 dark:bg-indigo-900 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100 dark:shadow-none relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                                    <Clock size={200} />
                                </div>
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                                            <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Next Assignment: Today</span>
                                        </div>
                                        <h2 className="text-4xl font-black mb-2 tracking-tight">Robert Miller</h2>
                                        <p className="text-lg text-indigo-100 font-medium opacity-80 mb-8 flex items-center gap-2">
                                            <Calendar size={18} /> 09:00 AM — 01:00 PM <span className="opacity-40">|</span> 123 Maple St, Madison
                                        </p>
                                        <div className="flex flex-wrap gap-4">
                                            <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-95 flex items-center gap-2">
                                                Clock In Now <ChevronRight size={16} />
                                            </button>
                                            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/20 flex items-center gap-2 backdrop-blur-sm">
                                                View Directions
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full md:w-auto">
                                        <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">Patient Vitals Alert</p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="opacity-60">Last BP</span>
                                                <span className="font-black">120/80</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="opacity-60">High Fall Risk</span>
                                                <span className="text-rose-400 font-black">Yes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Career Progress */}
                                <div className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm col-span-1 lg:col-span-2">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Training & Compliance</h3>
                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">2 Needed</span>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="p-4 bg-gray-50 dark:bg-[#111a22]/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group cursor-pointer hover:border-indigo-300 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600"><Clock size={20} /></div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 dark:text-white">HIPAA Annual Refresher</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Required by: Oct 30, 2023</p>
                                                </div>
                                            </div>
                                            <ArrowUpRight size={18} className="text-gray-300 group-hover:text-indigo-600" />
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-[#111a22]/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group cursor-pointer hover:border-indigo-300 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600"><FileText size={20} /></div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 dark:text-white">Wound Care Documentation</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Skill Enhancement</p>
                                                </div>
                                            </div>
                                            <ArrowUpRight size={18} className="text-gray-300 group-hover:text-indigo-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* Pay Quick View */}
                                <div className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Last Pay Period</h3>
                                    <div className="text-center mb-8">
                                        <p className="text-4xl font-black text-gray-900 dark:text-white mb-1 tabular-nums">$1,840.20</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deposited: Oct 15</p>
                                    </div>
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-xs font-bold px-2">
                                            <span className="text-gray-400 uppercase tracking-tighter">REG Hours</span>
                                            <span className="text-gray-900 dark:text-white tabular-nums">72.5h</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold px-2">
                                            <span className="text-gray-400 uppercase tracking-tighter">OT Hours</span>
                                            <span className="text-gray-900 dark:text-white tabular-nums">0.0h</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('paystubs')} className="w-full py-3 bg-gray-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-transparent hover:border-indigo-200">
                                        View All Stubs
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'schedule' && (
                        <div className="animate-in slide-in-from-right-5 duration-500">
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Assignment Schedule</h2>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-600">Weekly</button>
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">List View</button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {upcomingAssignments.map((shift, i) => (
                                    <div key={i} className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-center group transition-all hover:border-indigo-300 dark:hover:border-indigo-600">
                                        <div className="flex items-center gap-8">
                                            <div className="text-center w-12 border-r border-gray-100 dark:border-gray-800 pr-8">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Oct</span>
                                                <span className="text-3xl font-black text-gray-900 dark:text-white leading-none tabular-nums">{shift.date.split(' ')[1]}</span>
                                            </div>
                                            <div>
                                                <p className="font-black text-xl text-gray-900 dark:text-white mb-1">{shift.patient}</p>
                                                <p className="text-xs font-bold text-gray-400 flex items-center gap-2 tracking-tight">
                                                    <Clock size={14} className="text-indigo-600" /> {shift.time} <span className="opacity-40">|</span> {shift.location}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 mt-6 md:mt-0">
                                            <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{shift.type}</span>
                                            <button className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all active:scale-95">Shift Details</button>
                                            <MoreVertical size={20} className="text-gray-300" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
