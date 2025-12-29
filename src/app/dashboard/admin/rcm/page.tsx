
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { DollarSign, TrendingUp, AlertCircle, FileText } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { getClaimsAnalytics } from '@/lib/actions/administrative/rcm';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function RCMPage() {
    const [analytics, setAnalytics] = useState<any>(null);

    const loadData = async () => {
        const data = await getClaimsAnalytics('mock-org-id');
        setAnalytics(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    if (!analytics) return <div className="p-8 text-center text-nord3">Loading RCM Data...</div>;

    const chartData = [
        { name: 'Jan', revenue: 45000 },
        { name: 'Feb', revenue: 52000 },
        { name: 'Mar', revenue: 48000 },
        { name: 'Apr', revenue: 61000 },
        { name: 'May', revenue: 55000 },
    ];

    return (
        <ModuleLayout
            moduleName="Revenue Cycle Management"
            moduleIcon={<DollarSign className="w-5 h-5" />}
            breadcrumbs={[{ label: 'RCM', href: '/dashboard/admin/rcm' }]}
        >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <Card.Body className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-nord3 dark:text-nord4 font-bold uppercase">Total Revenue (YTD)</div>
                            <div className="text-2xl font-bold text-nord1 dark:text-nord6">${(analytics.totalRevenue / 1000).toFixed(1)}k</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-nord14/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-nord14" />
                        </div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-nord3 dark:text-nord4 font-bold uppercase">Pending Claims</div>
                            <div className="text-2xl font-bold text-nord1 dark:text-nord6">{analytics.pendingClaims}</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-nord10/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-nord10" />
                        </div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-nord3 dark:text-nord4 font-bold uppercase">Denial Rate</div>
                            <div className="text-2xl font-bold text-nord11">4.2%</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-nord11/20 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-nord11" />
                        </div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-nord3 dark:text-nord4 font-bold uppercase">Avg Days to Pay</div>
                            <div className="text-2xl font-bold text-nord1 dark:text-nord6">{analytics.avgDaysToPayment}</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-nord15/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-nord15" />
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2">
                    <Card.Header>
                        <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Revenue Trend</h3>
                    </Card.Header>
                    <Card.Body className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="#5E81AC" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <Card.Header>
                        <div>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Recent Claims</h3>
                            <p className="text-sm text-nord3 dark:text-nord4">Latest submission status</p>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="space-y-4">
                            {analytics.recentClaims.map((claim: any) => (
                                <div key={claim.id} className="flex items-center justify-between border-b border-nord4 dark:border-nord2 last:border-0 pb-3 last:pb-0">
                                    <div>
                                        <div className="font-semibold text-nord1 dark:text-nord6">{claim.patient}</div>
                                        <div className="text-sm text-nord3 dark:text-nord4">ID: #{claim.id} • {claim.date}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-nord1 dark:text-nord6">${claim.amount}</div>
                                        <Badge variant={
                                            claim.status === 'PAID' ? 'success' :
                                                claim.status === 'DENIED' ? 'error' :
                                                    'warning'
                                        }>
                                            {claim.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full mt-2">View All Claims</Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </ModuleLayout>
    );
}
