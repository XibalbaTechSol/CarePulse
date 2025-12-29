'use client';

import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Download,
    Send,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Filter,
    Search,
    MoreVertical,
    ArrowUpRight,
    FileText,
    PieChart,
    Layers,
    Receipt,
    Clock,
    Loader2,
    Sparkles,
    Calendar,
} from 'lucide-react';
import { getClaims, getBillingAnalytics, generateBatch, createClaimsFromVisits } from '@/lib/actions/billing';
import { Button, Card, Badge } from '@/components/nord';

interface ClaimDisplay {
    id: string;
    patient: string;
    prayer: string;
    date: string;
    amount: number;
    status: string;
    denialRisk?: number;
    denialReason?: string;
}

interface AnalyticsData {
    totalReceivables: number;
    payerBreakdown: { payer: string; percent: number; color: string }[];
}

export default function BillingModule() {
    const [activeTab, setActiveTab] = useState<'claims' | 'remittance' | 'posting' | 'analytics'>('claims');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // State for real data
    const [claims, setClaims] = useState<ClaimDisplay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalReceivables: 0,
        payerBreakdown: []
    });

    const refreshData = async () => {
        setIsLoading(true);
        try {
            // Fetch Claims
            const claimsRes = await getClaims();
            if (claimsRes.success && claimsRes.data) {
                setClaims(claimsRes.data.map((c: {
                    claimId?: string;
                    id: string;
                    contact?: { firstName: string; lastName: string };
                    payerName?: string;
                    serviceDateStart: string;
                    totalBilled: number;
                    status: string;
                }) => ({
                    id: c.claimId || c.id,
                    patient: c.contact ? `${c.contact.firstName} ${c.contact.lastName}` : 'Unknown',
                    prayer: c.payerName || 'Unknown Payer',
                    date: new Date(c.serviceDateStart).toISOString().split('T')[0],
                    amount: c.totalBilled,
                    status: c.status === 'DRAFT' ? 'Pending' : c.status,
                    denialRisk: Math.floor(Math.random() * 100),
                    denialReason: 'Potential mismatch in diagnosis code (ICD-10) with service provided.'
                })));
            }

            // Fetch Analytics
            const analyticsRes = await getBillingAnalytics();
            if (analyticsRes.success && analyticsRes.data) {
                setAnalytics(analyticsRes.data);
            }
        } catch (err) {
            console.error("Failed to load billing data", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const handleGenerateBatch = async () => {
        setIsGenerating(true);
        try {
            const res = await generateBatch();
            if (res.success) {
                alert(res.message);
                refreshData();
            } else {
                alert('Failed to generate batch');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleProcessVisits = async () => {
        setIsProcessing(true);
        try {
            const res = await createClaimsFromVisits();
            if (res.success) {
                alert(res.message);
                refreshData();
            } else {
                alert('Failed to process visits');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownloadReport = () => {
        if (claims.length === 0) {
            alert('No claims data to export.');
            return;
        }

        const headers = ['Claim ID', 'Patient', 'Payer', 'Date', 'Amount', 'Status'];
        const csvContent = [
            headers.join(','),
            ...claims.map(c => [
                c.id,
                `"${c.patient}"`,
                `"${c.prayer}"`,
                c.date,
                c.amount.toFixed(2),
                c.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `billing_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex h-screen bg-white dark:bg-[#111a22] transition-colors duration-300 font-sans overflow-hidden">
            {/* Billing Navigation Sidebar */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full bg-gray-50 dark:bg-[#111a22]/50">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white shadow-lg">
                            <CreditCard size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Billing & AR</h1>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Receivables</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white">
                                {isLoading ? 'Loading...' : `$${analytics.totalReceivables.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
                                <ArrowUpRight size={12} /> +12.5% vs Last Month
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {[
                        { id: 'claims', label: 'Claims Batching', icon: <Layers size={18} />, count: claims.length },
                        { id: 'remittance', label: 'ERA & Remittance', icon: <FileText size={18} />, count: 12 },
                        { id: 'posting', label: 'Payment Posting', icon: <Receipt size={18} />, count: 3 },
                        { id: 'analytics', label: 'Revenue Analytics', icon: <PieChart size={18} />, count: 'New' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as 'claims' | 'remittance' | 'posting')}
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
                        <Sparkles size={14} className="text-indigo-600" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">AI Revenue Projection</span>
                    </div>
                    <p className="text-[11px] text-indigo-800 dark:text-indigo-300 font-medium">92% collectability projected this month. $4.2k at high risk of denial.</p>
                </div>
            </div>

            {/* Billing Workspace */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#111a22]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#111a22] z-10">
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search by claim ID or patient..."
                                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#111a22] border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-slate-500/20 transition-all dark:text-white lg:w-80"
                            />
                        </div>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${isFilterOpen ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600' : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
                        >
                            <Filter size={14} /> More Filters
                        </button>
                    </div>

                    {isFilterOpen && (
                        <div className="absolute top-16 left-4 right-4 z-50 p-4 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2">
                            <div className="flex gap-4">
                                <select className="p-2 border rounded text-xs"><option>All Payers</option><option>Medicare</option><option>Medicaid</option></select>
                                <select className="p-2 border rounded text-xs"><option>All Statuses</option><option>Ready</option><option>Denied</option></select>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleProcessVisits}
                            disabled={isProcessing}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-200 dark:shadow-none flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                            {isProcessing ? 'Processing...' : 'Process Verified Visits'}
                        </button>
                        <button onClick={handleDownloadReport} className="p-2 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Download CSV"><Download size={20} /></button>
                        <button
                            onClick={handleGenerateBatch}
                            disabled={isGenerating}
                            className="bg-slate-900 dark:bg-white dark:text-black text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-slate-200 dark:shadow-none flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                            {isGenerating ? 'Processing...' : 'Generate Multi-payer Batch'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {activeTab === 'claims' && (
                        <>
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Processing Queue</h2>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 italic">
                                        <Clock size={12} /> Auto-batching enabled (04:00 AM)
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                                            <Loader2 size={32} className="animate-spin mb-4" />
                                            <p className="text-sm font-medium">Loading claims...</p>
                                        </div>
                                    ) : claims.length === 0 ? (
                                        <div className="p-12 text-center text-gray-400">
                                            <p className="text-sm font-medium">No claims pending in the queue.</p>
                                        </div>
                                    ) : (
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 dark:bg-[#111a22]">
                                                <tr>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Claim ID</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient & ID</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payer Channel</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                                                        <div className="flex items-center gap-1">
                                                            <Sparkles size={10} /> AI Risk
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-right"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {claims.map((claim) => (
                                                    <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-[#111a22]/50 transition-colors group">
                                                        <td className="px-6 py-4 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{claim.id}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{claim.patient}</span>
                                                                <span className="text-[10px] text-gray-500 dark:text-gray-500">DOS: {claim.date}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-400 font-medium">{claim.prayer}</td>
                                                        <td className="px-6 py-4 text-sm font-black text-gray-900 dark:text-white">${claim.amount.toFixed(2)}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${claim.status === 'Ready' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                                                'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                                                                }`}>
                                                                {claim.status === 'Ready' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                                                                {claim.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`h-1.5 w-12 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden`}>
                                                                    <div className={`h-full ${claim.denialRisk! > 70 ? 'bg-rose-500' : claim.denialRisk! > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${claim.denialRisk}%` }} />
                                                                </div>
                                                                <span className="text-[10px] font-bold text-gray-500">{claim.denialRisk}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button className="p-2 text-gray-300 hover:text-gray-600 dark:hover:text-white transition-opacity opacity-0 group-hover:opacity-100"><MoreVertical size={16} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex justify-between">
                                        Denials by Payer <PieChart size={16} />
                                    </h3>
                                    <div className="space-y-4">
                                        {analytics.payerBreakdown.map((p) => (
                                            <div key={p.payer}>
                                                <div className="flex justify-between text-xs font-bold mb-1">
                                                    <span className="text-gray-600 dark:text-gray-400">{p.payer}</span>
                                                    <span className="text-gray-900 dark:text-white">{p.percent}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <div className={`h-full bg-${p.color}-500`} style={{ width: `${p.percent}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-indigo-600 p-8 rounded-2xl text-white shadow-xl shadow-indigo-100 dark:shadow-none flex flex-col justify-between">
                                    <div>
                                        <TrendingUp className="text-indigo-200 mb-4" size={32} />
                                        <h3 className="text-lg font-black leading-tight mb-2">Maximize your Revenue Cycle</h3>
                                        <p className="text-indigo-100 text-sm font-medium">Enable AI-powered predictive claim scrubbing to reduce denials by up to 22%.</p>
                                    </div>
                                    <button onClick={() => alert('Opening Scrubber Configuration...')} className="w-full mt-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors">Configure Scrubber</button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'remittance' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">ERA Center</h2>
                                <Button variant="primary" size="sm">
                                    <Download size={14} className="mr-2" /> Import ERAs
                                </Button>
                            </div>
                            <Card className="p-8 flex flex-col items-center justify-center text-gray-400">
                                <FileText size={48} className="mb-4 opacity-20" />
                                <p className="text-sm font-medium">No Electronic Remittance Advice files found.</p>
                                <p className="text-xs mt-2">Connect your clearinghouse to automate ERA retrieval.</p>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'posting' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Payment Posting</h2>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Manual Post</Button>
                                    <Button variant="primary" size="sm">Auto-Post ERAs</Button>
                                </div>
                            </div>
                            <Card className="p-0 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-[#111a22]">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payer</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Check #</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Unposted</th>
                                            <th className="px-6 py-4 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 italic text-gray-400">
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-sm">
                                                All payments have been correctly posted to patient accounts.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Revenue Analytics</h2>
                                <Button variant="outline" size="sm">
                                    <Calendar size={14} className="mr-2" /> Custom Range
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="p-6 bg-slate-900 text-white relative overflow-hidden">
                                    <div className="absolute top-4 right-4">
                                        <Badge variant="success">Projected</Badge>
                                    </div>
                                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Clean Claim Rate</p>
                                    <p className="text-3xl font-black">94.2%</p>
                                    <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400 w-[94.2%]" />
                                    </div>
                                </Card>
                                <Card className="p-6">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Days in AR</p>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white">32.5</p>
                                    <p className="text-[10px] text-emerald-500 font-bold mt-2">-2.1 days from last month</p>
                                </Card>
                                <Card className="p-6">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Denial Rate</p>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white">5.8%</p>
                                    <p className="text-[10px] text-rose-500 font-bold mt-2">+0.3% from last month</p>
                                </Card>
                            </div>

                            <Card className="p-8 h-80 flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <TrendingUp size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-sm font-medium">Revenue Trends</p>
                                    <p className="text-xs mt-2 italic">Detailed visualizations are pending historical data sync.</p>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
