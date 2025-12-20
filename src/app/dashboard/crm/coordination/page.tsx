'use client';

import React, { useState } from 'react';
import {
    MessageSquare,
    Users,
    ClipboardList,
    MoreVertical,
    Send,
    Search,
    Filter,
    UserPlus,
    Video,
    Phone
} from 'lucide-react';

export default function CareCoordination() {
    const [view, setView] = useState<'messages' | 'tasks' | 'directory'>('messages');

    const threads = [
        { id: 'T-1', subject: 'Robert Miller - Wound Care', participants: 'SN, PT, MD', lastMsg: 'Vitals stable post-treatment.', time: '10:45 AM', unread: true },
        { id: 'T-2', subject: 'Scheduling Conflict - Prince', participants: 'Admin, Coordinator', lastMsg: 'Rescheduled for tomorrow.', time: '09:30 AM', unread: false },
        { id: 'T-3', subject: 'Medication Review - Connor', participants: 'PharmD, SN', lastMsg: 'Dosage confirmed.', time: 'Yesterday', unread: false },
    ];

    const tasks = [
        { id: 'TK-101', title: 'Upload OASIS SOC', assignedTo: 'Diana Prince', dueDate: 'Today', priority: 'High', status: 'Pending' },
        { id: 'TK-102', title: 'Physician Signature req.', assignedTo: 'Dr. Strange', dueDate: 'Oct 25', priority: 'Medium', status: 'Sent' },
        { id: 'TK-103', title: 'Eligibility Check', assignedTo: 'Admin', dueDate: 'Oct 24', priority: 'Low', status: 'Complete' },
    ];

    return (
        <div className="flex h-screen bg-white dark:bg-[#111a22] transition-colors duration-300 font-sans overflow-hidden">
            {/* Coordination Sidebar */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full bg-gray-50 dark:bg-[#111a22]/50">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Care Coordination</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search coordination..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#111a22] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none transition-all dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {[
                        { id: 'messages', label: 'Secure Messaging', icon: <MessageSquare size={18} />, count: 3 },
                        { id: 'tasks', label: 'Action Tasks', icon: <ClipboardList size={18} />, count: 5 },
                        { id: 'directory', label: 'Team Directory', icon: <Users size={18} />, count: 12 },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id as 'messages' | 'tasks' | 'directory')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${view === item.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#1e293b]'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                <span className="text-sm font-bold">{item.label}</span>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${view === item.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'
                                }`}>{item.count}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 mt-auto">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl text-white shadow-lg">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Physician Portal</p>
                        <h4 className="text-sm font-bold mb-3">Dr. Gregory House</h4>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all backdrop-blur-sm">Access Portal</button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111a22]">
                {view === 'messages' && (
                    <>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#111a22] z-10">
                            <div>
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Active Channels</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors mr-2"><UserPlus size={20} /></button>
                                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors mr-2"><Filter size={20} /></button>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md">
                                    <MessageSquare size={16} /> New Thread
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-3 flex-1">
                                {/* Thread List */}
                                <div className="border-r border-gray-100 dark:border-gray-800 overflow-y-auto bg-gray-50/50 dark:bg-[#111a22]/20">
                                    {threads.map((thread) => (
                                        <div key={thread.id} className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-white dark:hover:bg-[#1e293b] cursor-pointer transition-all group">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`text-sm font-bold ${thread.unread ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {thread.subject}
                                                </h3>
                                                <span className="text-[10px] text-gray-400">{thread.time}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">{thread.participants}</p>
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs text-gray-400 italic truncate pr-4">{thread.lastMsg}</p>
                                                {thread.unread && <div className="w-2 h-2 rounded-full bg-blue-600 shadow-blue-500/50 shadow-md"></div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Message View Placeholder */}
                                <div className="md:col-span-2 flex flex-col bg-white dark:bg-[#111a22]">
                                    <div className="flex-1 flex items-center justify-center text-center p-12">
                                        <div>
                                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <MessageSquare className="text-blue-600" size={40} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Select a channel to begin</h3>
                                            <p className="text-gray-500 text-sm max-w-xs">All messages are HIPAA encrypted and logged for inter-disciplinary compliance.</p>
                                        </div>
                                    </div>
                                    <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="bg-gray-50 dark:bg-[#1e293b] p-2 rounded-xl flex items-center gap-2">
                                            <input
                                                disabled
                                                type="text"
                                                placeholder="Select a thread to reply..."
                                                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none border-none dark:text-white opacity-50 cursor-not-allowed"
                                            />
                                            <button disabled className="p-2 text-gray-300 cursor-not-allowed"><Send size={20} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {view === 'tasks' && (
                    <div className="p-8 space-y-6 overflow-y-auto">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Action Tasks</h2>
                            <button className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 hover:underline">
                                <Plus size={16} /> New Task
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'To-Do', count: 3, color: 'blue' },
                                { label: 'In Review', count: 1, color: 'amber' },
                                { label: 'Done', count: 4, color: 'emerald' },
                            ].map((stat, i) => (
                                <div key={i} className={`p-4 rounded-xl border border-${stat.color}-100 dark:border-${stat.color}-900/30 bg-${stat.color}-50/50 dark:bg-${stat.color}-900/10`}>
                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">{stat.label}</p>
                                    <p className={`text-2xl font-black text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.count}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-[#111a22]">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Task</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Due</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {tasks.map((task) => (
                                        <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-[#111a22]/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{task.title}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{task.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">{task.assignedTo}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-500">{task.dueDate}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${task.status === 'Complete' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                                    task.status === 'Sent' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                                    }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions Float */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3">
                <button className="p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all group relative">
                    <Video size={24} />
                    <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Start Tele-consult</span>
                </button>
                <button className="p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full shadow-lg hover:shadow-gray-200 dark:hover:shadow-black hover:-translate-y-1 transition-all group relative">
                    <Phone size={24} />
                    <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Voice Call</span>
                </button>
            </div>
        </div>
    );
}

const Plus = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);
