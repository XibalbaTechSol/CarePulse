'use client';

import React, { useState } from 'react';
import {
    Stethoscope,
    Pill,
    Save,
    Clock,
    ChevronRight,
    Search,
    User,
    CheckCircle2,
    AlertCircle,
    FileText,
    Signature,
    ClipboardList,
    TrendingUp
} from 'lucide-react';

export default function ClinicalPOC() {
    const [activeTab, setActiveTab] = useState<'assessments' | 'mar' | 'notes' | 'signatures'>('assessments');

    const assessments = [
        { id: 'M1021', question: 'Primary Diagnosis', answer: 'I10 - Essential (primary) hypertension', status: 'Complete' },
        { id: 'M1830', question: 'Bathing: Current ability to wash entire body safely', answer: '1 - With minimal assistance', status: 'Pending' },
        { id: 'M1400', question: 'When is the patient dyspneic?', answer: '2 - Walking more than 20 feet', status: 'Complete' },
    ];

    const medications = [
        { name: 'Lisinopril', dose: '10mg', freq: 'Daily', time: '08:00 AM', status: 'Given' },
        { name: 'Metformin', dose: '500mg', freq: 'BID', time: '08:00 AM', status: 'Given' },
        { name: 'Atorvastatin', dose: '20mg', freq: 'Daily', time: '08:00 PM', status: 'Due' },
    ];

    return (
        <div className="flex h-screen bg-white dark:bg-[#111a22] transition-colors duration-300 font-sans overflow-hidden">
            {/* Master Sidebar: Patient Summary & Alerts */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full bg-gray-50 dark:bg-[#111a22]/50 overflow-y-auto custom-scrollbar">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">RM</div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Robert Miller</h3>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">ID: #882199</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex justify-between">
                                Vitals History <TrendingUp size={12} />
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">BP</span>
                                    <span className="font-bold text-gray-900 dark:text-gray-200">120/80</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">HR</span>
                                    <span className="font-bold text-gray-900 dark:text-gray-200">72 bpm</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">SpO2</span>
                                    <span className="font-bold text-emerald-500 font-black">98%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
                            <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <AlertCircle size={12} /> Clinical Alerts
                            </h4>
                            <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium italic">High fall risk reported. Patient dizzy upon rising.</p>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">OASIS-E Progress</h4>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full w-[65%]" />
                            </div>
                            <p className="text-[10px] text-indigo-800 dark:text-indigo-300 font-bold mt-2">65% Complete</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail View: Documentation Interface */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111a22]">
                {/* Header & Tabs */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111a22] z-20">
                    <div className="flex justify-between items-center mb-6 px-4">
                        <div className="flex items-center gap-2">
                            <Stethoscope size={20} className="text-indigo-600" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Clinical documentation</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-gray-400 italic">Last Sync: Just Now</span>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
                                <Save size={16} /> Save session
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-1 px-4">
                        {[
                            { id: 'assessments', label: 'Assessments', icon: <FileText size={14} /> },
                            { id: 'mar', label: 'Med MAR', icon: <Pill size={14} /> },
                            { id: 'notes', label: 'Narrative Notes', icon: <ClipboardList size={14} /> },
                            { id: 'signatures', label: 'Signatures', icon: <Signature size={14} /> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as 'assessments' | 'mar' | 'notes' | 'signatures')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-bold transition-all border-b-2 ${activeTab === tab.id
                                    ? 'text-blue-600 dark:text-blue-400 border-blue-600 bg-blue-50 dark:bg-blue-900/10'
                                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/50 dark:bg-[#111a22]/10">
                    {activeTab === 'assessments' && (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">OASIS-E SOC Items</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                    <input type="text" placeholder="Jump to item..." className="pl-9 pr-4 py-1.5 text-xs bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-lg outline-none w-48 focus:w-64 transition-all dark:text-white" />
                                </div>
                            </div>
                            {assessments.map((item) => (
                                <div key={item.id} className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 font-bold">{item.id}</span>
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${item.status === 'Complete' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">{item.question}</p>
                                    <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-[#111a22] border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 transition-colors flex justify-between items-center group/btn">
                                        <span>{item.answer}</span>
                                        <ChevronRight size={14} className="text-gray-400 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'mar' && (
                        <div className="max-w-4xl mx-auto space-y-4">
                            <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Pill className="text-rose-600" size={20} />
                                    <span className="text-xs font-bold text-rose-800 dark:text-rose-300">Unconfirmed medication dose alert: Lisinopril @ 08:00 AM</span>
                                </div>
                                <button className="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase underline">Resolve</button>
                            </div>
                            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-[#111a22]">
                                        <tr>
                                            <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Medication</th>
                                            <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                                            <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {medications.map((med) => (
                                            <tr key={med.name} className="hover:bg-gray-50 dark:hover:bg-[#111a22]/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{med.name}</span>
                                                        <span className="text-[10px] text-gray-500 font-bold">{med.dose} • {med.freq}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-bold text-gray-600 dark:text-gray-400">{med.time}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${med.status === 'Given' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                                                        }`}>
                                                        {med.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase hover:underline">Administer</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Skilled Nurse Narrative</h3>
                                    <div className="flex gap-2">
                                        <button className="p-2 bg-gray-50 dark:bg-[#111a22] border border-gray-100 dark:border-gray-700 rounded-lg text-gray-400 hover:text-blue-600"><Clock size={16} /></button>
                                        <button className="p-2 bg-gray-50 dark:bg-[#111a22] border border-gray-100 dark:border-gray-700 rounded-lg text-gray-400 hover:text-blue-600"><User size={16} /></button>
                                    </div>
                                </div>
                                <textarea
                                    className="w-full h-64 p-6 bg-gray-50 dark:bg-[#111a22] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white"
                                    placeholder="Enter clinical observations, responses to treatment, and care coordination summary..."
                                />
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {['Stable', 'Post-Op', 'Wound Clean', 'Assistance Req', 'Vitals Normal'].map(tag => (
                                        <button key={tag} className="px-3 py-1.5 bg-gray-100 dark:bg-[#111a22] hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-[10px] font-bold text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">+ {tag}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111a22] flex justify-between items-center z-20">
                    <div className="flex gap-6 items-center">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">HIPAA Session Encrypted</span>
                        </div>
                        <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Point of Care Terminal #11</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
