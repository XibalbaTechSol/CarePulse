'use client';

import React, { useState } from 'react';
import {
    ShieldCheck,
    Clock,
    FileCheck,
    Activity,
    MoreVertical,
    Plus,
    Search,
    Filter,
    ClipboardList,
} from 'lucide-react';

export default function AuthorizationsPOC() {
    const [activeTab, setActiveTab] = useState<'authorizations' | 'poc' | 'compliance'>('authorizations');

    const authorizations = [
        { id: 'AUTH-8821', patient: 'Robert Miller', payer: 'Medicare', type: 'SN Visit', authorized: 24, used: 12, remaining: 12, expires: 'Dec 15, 2023', status: 'Active' },
        { id: 'AUTH-9902', patient: 'Sarah Connor', payer: 'Blue Cross Blue Shield', type: 'HHA Hour', authorized: 120, used: 45, remaining: 75, expires: 'Nov 30, 2023', status: 'Warning' },
        { id: 'AUTH-1123', patient: 'James Wilson', payer: 'Medicaid', type: 'PT Visit', authorized: 10, used: 10, remaining: 0, expires: 'Oct 10, 2023', status: 'Expired' },
        { id: 'AUTH-4456', patient: 'Patricia Brown', payer: 'Aetna', type: 'OT Visit', authorized: 30, used: 5, remaining: 25, expires: 'Jan 20, 2024', status: 'Active' },
    ];

    const pocs = [
        { id: 'POC-2023-001', patient: 'Robert Miller', physician: 'Dr. Smith', startDate: 'Oct 01, 2023', endDate: 'Nov 30, 2023', status: 'Active', compliance: 98 },
        { id: 'POC-2023-002', patient: 'Sarah Connor', physician: 'Dr. Jones', startDate: 'Sep 15, 2023', endDate: 'Nov 14, 2023', status: 'Pending Review', compliance: 85 },
        { id: 'POC-2023-003', patient: 'James Wilson', physician: 'Dr. White', startDate: 'Aug 01, 2023', endDate: 'Sep 30, 2023', status: 'Expired', compliance: 100 },
    ];

    return (
        <div className="p-6 space-y-6 bg-white dark:bg-[#111a22] min-h-screen transition-colors duration-300 font-sans">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Service Authorization & POC</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage payer authorizations and clinical Plans of Care (485).</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-gray-100 dark:bg-[#1e293b] text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 font-medium transition-all hover:bg-gray-200 dark:hover:bg-gray-800 text-sm">
                        <FileCheck size={18} />
                        <span>Generate 485</span>
                    </button>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md active:scale-95 font-medium text-sm">
                        <Plus size={20} />
                        <span>New Auth/POC</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Auth Units', value: '4.8k', icon: <Activity className="text-blue-500" />, color: 'blue' },
                    { label: 'Expiring (30d)', value: '14', icon: <Clock className="text-amber-500" />, color: 'amber' },
                    { label: 'Compliance Rate', value: '94.2%', icon: <ShieldCheck className="text-emerald-500" />, color: 'emerald' },
                    { label: 'Open Tasks', value: '23', icon: <ClipboardList className="text-rose-500" />, color: 'rose' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111a22] sticky top-0 z-10">
                {(['authorizations', 'poc', 'compliance'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-4 text-sm font-bold capitalize transition-all relative ${activeTab === tab
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        {tab === 'poc' ? 'Plan of Care' : tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 animate-in slide-in-from-left-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[500px]">
                {activeTab === 'authorizations' && (
                    <>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-[#111a22]/30">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by patient, auth # or payer..."
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#111a22] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none transition-all dark:text-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                    <Filter size={20} />
                                </button>
                                <button className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                    Show Expired
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-[#111a22]">
                                    <tr>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Number</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payer & Service</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usage / Units</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expiration</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {authorizations.map((auth) => (
                                        <tr key={auth.id} className="hover:bg-gray-50 dark:hover:bg-[#111a22]/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 dark:text-blue-400">
                                                {auth.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                                {auth.patient}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{auth.payer}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{auth.type}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1.5 min-w-[120px]">
                                                    <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                                                        <span>{auth.used} used</span>
                                                        <span>{auth.authorized} total</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${auth.status === 'Active' ? 'bg-blue-500' :
                                                                auth.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'
                                                                }`}
                                                            style={{ width: `${(auth.used / auth.authorized) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-medium italic">
                                                {auth.expires}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${auth.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                                    auth.status === 'Warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                                        'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                                                    }`}>
                                                    {auth.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'poc' && (
                    <div className="p-0">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#111a22]/30">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Plan of Care (485)</h3>
                            <button className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 hover:underline">
                                <Plus size={16} /> Add CMS-485
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-[#111a22]">
                                    <tr>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Physician</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Period</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Compliance</th>
                                        <th className="px-6 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {pocs.map((poc) => (
                                        <tr key={poc.id} className="hover:bg-gray-50 dark:hover:bg-[#111a22]/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                                {poc.patient}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {poc.physician}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-medium">
                                                {poc.startDate} - {poc.endDate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-xs font-bold text-gray-900 dark:text-white">{poc.compliance}%</div>
                                                    <div className="flex-1 min-w-[60px] max-w-[100px] bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
                                                        <div className="bg-emerald-500 h-full" style={{ width: `${poc.compliance}%` }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${poc.status === 'Active' ? 'border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10' :
                                                    poc.status === 'Pending Review' ? 'border-amber-200 text-amber-600 bg-amber-50 dark:bg-amber-900/10' :
                                                        'border-gray-200 text-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400'
                                                    }`}>
                                                    {poc.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">View Detail</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'compliance' && (
                    <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <ShieldCheck size={64} className="text-blue-100 dark:text-blue-900" />
                        <h3 className="text-xl font-bold dark:text-white">Compliance Watchdog</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                            All scheduled visits are being automatically verified against authorized Plan of Care and payer limitations.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8 text-left">
                            <div className="p-4 bg-gray-50 dark:bg-[#111a22] rounded-xl border border-gray-200 dark:border-gray-800">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">POC Overlaps</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-[#111a22] rounded-xl border border-gray-200 dark:border-gray-800">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Late Recertifications</p>
                                <p className="text-2xl font-bold text-rose-600">3</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
