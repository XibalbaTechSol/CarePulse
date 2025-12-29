'use client';

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { BadgeCheck, FileText, AlertTriangle, ShieldCheck, Upload } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { getProviderCredentials } from '@/lib/actions/administrative/credentialing';

export default function CredentialingPage() {
    const [credentials, setCredentials] = useState<any[]>([]);

    const loadData = async () => {
        const data = await getProviderCredentials('mock-provider');
        setCredentials(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <ModuleLayout
            moduleName="Credentialing"
            moduleIcon={<BadgeCheck className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Credentialing', href: '/dashboard/admin/credentialing' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <Card>
                        <Card.Header className="text-center">
                            <div className="w-20 h-20 bg-nord4 dark:bg-nord2 rounded-full mx-auto mb-2 flex items-center justify-center">
                                <span className="text-2xl font-bold text-nord3 dark:text-nord4">JD</span>
                            </div>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Dr. John Doe</h3>
                            <p className="text-sm text-nord3 dark:text-nord4">Internal Medicine • NPI: 1234567890</p>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm p-2 bg-nord14/10 rounded border border-nord14">
                                    <span className="text-nord1 dark:text-nord6">Status</span>
                                    <span className="font-bold text-nord14 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Active
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm p-2 bg-nord6 dark:bg-nord1 rounded border border-nord4 dark:border-nord2">
                                    <span className="text-nord1 dark:text-nord6">Primary Panel</span>
                                    <span className="font-medium text-nord1 dark:text-nord6">BlueCross</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="mt-4 border-l-4 border-l-nord13">
                        <Card.Body className="p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-nord13 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-nord13">Action Required</h4>
                                    <p className="text-sm text-nord3 dark:text-nord4 mt-1">
                                        DEA Registration expires in 30 days. Please upload renewal documentation.
                                    </p>
                                    <Button size="sm" variant="outline" className="mt-2 text-nord13 border-nord13 hover:bg-nord13 hover:text-white">
                                        Renew Now
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Credentials List */}
                <div className="md:col-span-2">
                    <Card>
                        <Card.Header className="flex flex-row items-center justify-between">
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Credentials & Licenses</h3>
                            <Button size="sm"><Upload className="w-4 h-4 mr-2" /> Upload Document</Button>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-4">
                                {credentials.map(cred => (
                                    <div key={cred.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-nord4 dark:border-nord2 rounded-lg hover:bg-nord6 dark:hover:bg-nord1">
                                        <div className="flex items-center gap-4 mb-2 sm:mb-0">
                                            <div className="bg-nord9/20 p-2 rounded">
                                                <FileText className="w-5 h-5 text-nord9" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-nord1 dark:text-nord6">{cred.type}</div>
                                                <div className="text-sm text-nord3 dark:text-nord4">
                                                    {cred.state} • #{cred.number}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm text-nord3 dark:text-nord4">Expires</div>
                                                <div className="font-medium text-nord1 dark:text-nord6">{new Date(cred.expires).toLocaleDateString()}</div>
                                            </div>
                                            <Badge variant={
                                                cred.status === 'VERIFIED' ? 'success' :
                                                    cred.status === 'EXPIRING_SOON' ? 'warning' : 'primary'
                                            }>
                                                {cred.status.replace('_', ' ')}
                                            </Badge>
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
