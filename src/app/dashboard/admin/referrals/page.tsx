'use client';

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Network, Send, UserPlus, CheckCircle, Clock } from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/nord';
import { createReferral, getReferrals } from '@/lib/actions/administrative/referrals';

export default function ReferralPage() {
    const [referrals, setReferrals] = useState<any[]>([]);

    const loadData = async () => {
        const data = await getReferrals('mock-org');
        setReferrals(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSendReferral = async () => {
        await createReferral({
            patientId: 'mock-p',
            targetProviderId: 'mock-doc',
            specialty: 'Cardiology',
            reason: 'Chest pain evaluation',
            urgency: 'ROUTINE'
        });
        loadData();
        alert('Referral sent!');
    };

    return (
        <ModuleLayout
            moduleName="Referrals & Coordination"
            moduleIcon={<Network className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Referrals', href: '/dashboard/admin/referrals' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Create Referral Panel */}
                <div className="md:col-span-1">
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">New Referral</h3>
                            <p className="text-sm text-nord3 dark:text-nord4">Send patient to specialist</p>
                        </Card.Header>
                        <Card.Body className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-nord3 dark:text-nord4">Patient</label>
                                <Input placeholder="Search patient..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-nord3 dark:text-nord4">Specialty</label>
                                <select className="w-full rounded-md border border-nord4 bg-nord6 px-3 py-2 text-sm shadow-sm focus:border-nord8 focus:outline-none focus:ring-1 focus:ring-nord8 dark:border-nord2 dark:bg-nord1 dark:text-nord6">
                                    <option value="" disabled selected>Select specialty</option>
                                    <option value="cardio">Cardiology</option>
                                    <option value="ortho">Orthopedics</option>
                                    <option value="derm">Dermatology</option>
                                    <option value="neuro">Neurology</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-nord3 dark:text-nord4">Urgency</label>
                                <select className="w-full rounded-md border border-nord4 bg-nord6 px-3 py-2 text-sm shadow-sm focus:border-nord8 focus:outline-none focus:ring-1 focus:ring-nord8 dark:border-nord2 dark:bg-nord1 dark:text-nord6" defaultValue="routine">
                                    <option value="routine">Routine</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="stat">STAT</option>
                                </select>
                            </div>
                            <Button className="w-full" onClick={handleSendReferral}>
                                <Send className="w-4 h-4 mr-2" /> Send Referral
                            </Button>
                        </Card.Body>
                    </Card>
                </div>

                {/* Active Referrals List */}
                <div className="md:col-span-2">
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Active Referrals</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-4">
                                {referrals.map(ref => (
                                    <div key={ref.id} className="flex items-center justify-between p-4 border border-nord4 dark:border-nord2 rounded-lg hover:bg-nord6 dark:hover:bg-nord1">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-nord9/20 rounded-full flex items-center justify-center text-nord9">
                                                <UserPlus className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-nord1 dark:text-nord6">{ref.patient}</div>
                                                <div className="text-sm text-nord3 dark:text-nord4">
                                                    To: {ref.provider} ({ref.specialty})
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <Badge variant={
                                                ref.status === 'ACCEPTED' ? 'success' :
                                                    ref.status === 'SENT' ? 'info' : 'primary'
                                            }>
                                                {ref.status === 'ACCEPTED' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                {ref.status === 'SENT' && <Clock className="w-3 h-3 mr-1" />}
                                                {ref.status}
                                            </Badge>
                                            <div className="text-xs text-nord3 dark:text-nord4">{ref.date}</div>
                                            {ref.urgency === 'URGENT' && <span className="text-xs font-bold text-nord11">URGENT</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
