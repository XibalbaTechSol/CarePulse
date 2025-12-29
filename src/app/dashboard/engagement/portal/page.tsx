
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { MessageSquare, Calendar, Users, Send } from 'lucide-react';
import { Card, Badge, Button, Input, Textarea } from '@/components/nord';
import { getPortalMessages, getAppointmentRequests } from '@/lib/actions/engagement/portal';

export default function PortalPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const msgs = await getPortalMessages('mock-org');
        setMessages(msgs);
        const reqs = await getAppointmentRequests();
        setRequests(reqs);
    };

    return (
        <ModuleLayout
            moduleName="Patient Engagement"
            moduleIcon={<Users className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Portal', href: '/dashboard/engagement/portal' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Message Inbox */}
                <div className="md:col-span-2 space-y-4">
                    <Card className="h-full">
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-nord10" /> Secure Messages
                            </h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-0 divide-y divide-nord4 dark:divide-nord2">
                                {messages.map(msg => (
                                    <div key={msg.id} className="p-4 hover:bg-nord6 dark:hover:bg-nord1 transition-colors cursor-pointer">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`font-bold ${msg.status === 'UNREAD' ? 'text-nord0 dark:text-nord6' : 'text-nord3 dark:text-nord4'}`}>
                                                {msg.from}
                                            </span>
                                            <span className="text-xs text-nord3 dark:text-nord4">
                                                {new Date(msg.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="text-sm font-medium text-nord1 dark:text-nord5 mb-1">{msg.subject}</div>
                                        <div className="text-sm text-nord3 dark:text-nord4 truncate">{msg.preview}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-nord4 dark:border-nord2">
                                <Button className="w-full" variant="outline">View All Messages</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Appointment Requests & Quick Action */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-nord10" /> Appt Requests
                            </h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-3">
                                {requests.map(req => (
                                    <div key={req.id} className="p-3 border border-nord4 dark:border-nord2 rounded bg-nord6 dark:bg-nord1">
                                        <div className="font-bold text-nord1 dark:text-nord6">{req.patient}</div>
                                        <div className="text-sm text-nord3 dark:text-nord4">{req.reason}</div>
                                        <div className="text-xs font-mono text-nord10 mt-1">Req: {req.requestedDate}</div>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" variant="primary" className="flex-1 text-xs">Approve</Button>
                                            <Button size="sm" variant="outline" className="flex-1 text-xs">Reschedule</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Broadcast Message</h3>
                        </Card.Header>
                        <Card.Body className="space-y-3">
                            <Input placeholder="Subject" />
                            <Textarea placeholder="Message to all patients..." />
                            <Button className="w-full">
                                <Send className="w-4 h-4 mr-2" /> Send Broadcast
                            </Button>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
