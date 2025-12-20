'use client';

import React, { useState } from 'react';
import {
    Heart,
    Calendar,
    FileText,
    CreditCard,
    MessageSquare,
    ShieldCheck,
    Clock,
    User,
    Activity,
    Bell,
    Info,
    CheckCircle2,
    MoreVertical
} from 'lucide-react';

export default function FamilyPortal() {
    const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'team' | 'billing' | 'docs'>('overview');

    const upcomingVisits = [
        { date: 'Oct 24', time: '09:00 AM - 01:00 PM', caregiver: 'Sarah Jenkins', service: 'Personal Care', status: 'Confirmed' },
        { date: 'Oct 25', time: '10:00 AM - 02:00 PM', caregiver: 'Michael Chen', service: 'Respite Care', status: 'Confirmed' },
        { date: 'Oct 26', time: '09:00 AM - 01:00 PM', caregiver: 'Sarah Jenkins', service: 'Personal Care', status: 'Pending' },
    ];


    return (
        <div className="flex h-screen bg-white dark:bg-[#111a22] transition-colors duration-300 font-sans overflow-hidden">
            {/* Family Portal Sidebar */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full bg-gray-50 dark:bg-[#111a22]/50">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200 dark:shadow-none font-black text-xl">
                            <Heart size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Family Portal</h1>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
                                <User size={40} />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Resident</p>
                            <p className="text-lg font-black text-gray-900 dark:text-white">Robert Miller</p>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
                                <CheckCircle2 size={12} /> Care Active
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {[
                        { id: 'overview', label: 'Care Overview', icon: <Activity size={18} />, count: 'Live' },
                        { id: 'schedule', label: 'Care Schedule', icon: <Calendar size={18} />, count: 3 },
                        { id: 'team', label: 'Care Team', icon: <User size={18} />, count: 4 },
                        { id: 'billing', label: 'Billing & Payments', icon: <CreditCard size={18} />, count: 2 },
                        { id: 'docs', label: 'Shared Documents', icon: <FileText size={18} />, count: 5 },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as 'overview' | 'schedule' | 'team' | 'billing' | 'docs')}
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

                <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border-t border-rose-100 dark:border-rose-900/30">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={14} className="text-rose-600" />
                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Connect with Agency</span>
                    </div>
                    <p className="text-[11px] text-rose-800 dark:text-rose-300 font-medium leading-relaxed">Direct message restricted to administrative hours (8AM-5PM).</p>
                </div>
            </div>

            {/* Portal Workspace */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111a22]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#111a22] z-10">
                    <div className="flex gap-4">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-500" /> Secure HIPAA Session Active
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#111a22]" />
                        </button>
                        <button className="bg-slate-900 dark:bg-white dark:text-black text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-slate-200 dark:shadow-none flex items-center gap-2 transition-transform active:scale-95 group">
                            <MessageSquare size={16} /> Open Chat
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Live Care Summary Card */}
                            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-slate-50 dark:shadow-none relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                                    <Activity size={180} />
                                </div>
                                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Live Care Update</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight">Patient Status: Optimal</h2>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xl">
                                            &quot;Sarah Jenkins (SN) is currently concluding the morning session. Robert has participated well in mobility exercises. Appetite is improving, and he is resting comfortably before lunch.&quot;
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 w-full md:w-80">
                                        {[
                                            { label: 'Mobility', value: 'Excellent', color: 'emerald' },
                                            { label: 'Nutrition', value: 'High', color: 'indigo' },
                                            { label: 'Hydration', value: '8/10 Cups', color: 'blue' },
                                            { label: 'Vitals', value: 'Normal', color: 'emerald' },
                                        ].map((stat) => (
                                            <div key={stat.label} className="p-4 bg-gray-50 dark:bg-[#111a22]/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</span>
                                                <span className={`text-sm font-black text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Next Visit Card */}
                                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Next Scheduled Visit</h3>
                                        <div className="flex items-center gap-5 mb-6">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-white">
                                                <span className="text-[10px] font-black uppercase leading-none mb-1">Oct</span>
                                                <span className="text-2xl font-black leading-none uppercase">25</span>
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-gray-900 dark:text-white">Professional Respite</p>
                                                <p className="text-xs font-bold text-gray-400 flex items-center gap-1"><Clock size={12} /> 10:00 AM - 02:00 PM</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#111a22]/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-black text-xs">MC</div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">Michael Chen, RN</p>
                                                <p className="text-[10px] text-gray-400 font-bold">Assigned Caregiver</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-6 py-3 border border-slate-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-white transition-all">Reschedule Request</button>
                                </div>

                                {/* Financial Pulse */}
                                <div className="bg-indigo-600 p-8 rounded-2xl text-white shadow-xl shadow-indigo-100 dark:shadow-none flex flex-col justify-between group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                        <CreditCard size={120} />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">Account Balance</p>
                                        <h3 className="text-4xl font-black mb-1">$0.00</h3>
                                        <p className="text-xs font-bold text-indigo-100 opacity-80 mb-6">All invoices are settled.</p>
                                    </div>
                                    <div className="relative z-10 space-y-3">
                                        <button className="w-full py-4 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg active:scale-95">Download Statements</button>
                                        <p className="text-[10px] text-center font-bold text-indigo-200 uppercase tracking-tighter italic flex items-center justify-center gap-1">
                                            <Info size={12} /> Next invoice cycle: Nov 01, 2023
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'schedule' && (
                        <div className="animate-in slide-in-from-right-5 duration-500">
                            <div className="flex justify-between items-center mb-8 px-2">
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Care Schedule</h2>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">Monthly View</button>
                                    <button className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-black text-white rounded-lg text-xs font-bold">List View</button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {upcomingVisits.map((visit, i) => (
                                    <div key={i} className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-center group transition-all hover:border-slate-300 dark:hover:border-slate-600">
                                        <div className="flex items-center gap-8">
                                            <div className="text-center w-12 flex flex-col items-center">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Oct</span>
                                                <span className="text-2xl font-black text-gray-900 dark:text-white leading-none tabular-nums">{visit.date.split(' ')[1]}</span>
                                            </div>
                                            <div className="h-10 w-[1px] bg-slate-100 dark:bg-slate-700 md:block hidden" />
                                            <div>
                                                <p className="font-black text-lg text-gray-900 dark:text-white mb-1">{visit.service}</p>
                                                <p className="text-xs font-bold text-gray-400 flex items-center gap-2"><Clock size={14} className="text-gray-300" /> {visit.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-12 mt-6 md:mt-0">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Caregiver</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-gray-900 dark:text-white">{visit.caregiver}</span>
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"><User size={16} /></div>
                                                </div>
                                            </div>
                                            <div className="h-10 w-[1px] bg-slate-100 dark:bg-slate-700 md:block hidden" />
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${visit.status === 'Confirmed' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800'}`}>
                                                    {visit.status}
                                                </span>
                                                <button className="p-2 text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                                                    <MoreVertical size={20} />
                                                </button>
                                            </div>
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
