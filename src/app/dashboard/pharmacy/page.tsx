'use client';

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Pill, Search, AlertTriangle, CheckCircle, Clock, Package } from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/nord';

export default function PharmacyPage() {
    const [prescriptions, setPrescriptions] = useState<any[]>([
        {
            id: '1',
            medication: 'Lisinopril 10mg',
            patient: 'John Doe',
            prescriber: 'Dr. Smith',
            quantity: 30,
            refills: 3,
            status: 'FILLED',
            filledDate: new Date().toISOString(),
            dueDate: null
        },
        {
            id: '2',
            medication: 'Metformin 500mg',
            patient: 'Jane Smith',
            prescriber: 'Dr. Johnson',
            quantity: 60,
            refills: 5,
            status: 'PENDING',
            filledDate: null,
            dueDate: new Date().toISOString()
        },
        {
            id: '3',
            medication: 'Atorvastatin 20mg',
            patient: 'Bob Wilson',
            prescriber: 'Dr. Brown',
            quantity: 30,
            refills: 2,
            status: 'READY',
            filledDate: new Date().toISOString(),
            dueDate: null
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredPrescriptions = prescriptions.filter(p =>
        p.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.patient.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statusCounts = {
        pending: prescriptions.filter(p => p.status === 'PENDING').length,
        ready: prescriptions.filter(p => p.status === 'READY').length,
        filled: prescriptions.filter(p => p.status === 'FILLED').length,
    };

    return (
        <ModuleLayout
            moduleName="Pharmacy Management"
            moduleIcon={<Pill className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Pharmacy', href: '/dashboard/pharmacy' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Panel */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Pharmacy Queue</h3>
                            <p className="text-sm text-nord3 dark:text-nord4">Current status</p>
                        </Card.Header>
                        <Card.Body className="space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-nord13/10 border border-nord13/20">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-nord13" />
                                    <span className="text-sm font-medium text-nord1 dark:text-nord6">Pending</span>
                                </div>
                                <Badge variant="warning">{statusCounts.pending}</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-nord14/10 border border-nord14/20">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-nord14" />
                                    <span className="text-sm font-medium text-nord1 dark:text-nord6">Ready</span>
                                </div>
                                <Badge variant="success">{statusCounts.ready}</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-nord10/10 border border-nord10/20">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-nord10" />
                                    <span className="text-sm font-medium text-nord1 dark:text-nord6">Filled Today</span>
                                </div>
                                <Badge variant="info">{statusCounts.filled}</Badge>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="bg-nord11/10 border-nord11">
                        <Card.Body className="p-4">
                            <h4 className="font-semibold text-nord11 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Drug Interactions
                            </h4>
                            <div className="text-sm text-nord11 space-y-1">
                                <p className="font-medium">No critical alerts</p>
                                <p className="text-xs opacity-80">System monitoring active</p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Prescriptions Feed */}
                <div className="md:col-span-2">
                    <Card className="h-full">
                        <Card.Header>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Prescriptions</h3>
                                <Button variant="primary" size="sm">
                                    <Pill className="w-4 h-4 mr-2" />
                                    New Prescription
                                </Button>
                            </div>
                            <div className="mt-4 relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Search className="w-4 h-4 text-nord3 dark:text-nord4" />
                                </div>
                                <Input
                                    placeholder="Search by medication or patient..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-4">
                                {filteredPrescriptions.map(rx => (
                                    <div key={rx.id} className="border border-nord4 dark:border-nord2 rounded-lg p-4 flex flex-col gap-3 hover:bg-nord6 dark:hover:bg-nord1 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-nord1 dark:text-nord6 flex items-center gap-2">
                                                    <Pill className="w-4 h-4 text-nord10" />
                                                    {rx.medication}
                                                </h4>
                                                <div className="text-sm text-nord3 dark:text-nord4 mt-1">
                                                    <p>Patient: <span className="font-medium">{rx.patient}</span></p>
                                                    <p>Prescriber: <span className="font-medium">{rx.prescriber}</span></p>
                                                    <p>Quantity: {rx.quantity} • Refills: {rx.refills}</p>
                                                </div>
                                            </div>
                                            {rx.status === 'FILLED' && (
                                                <Badge variant="info">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Filled
                                                </Badge>
                                            )}
                                            {rx.status === 'PENDING' && (
                                                <Badge variant="warning">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Pending
                                                </Badge>
                                            )}
                                            {rx.status === 'READY' && (
                                                <Badge variant="success">
                                                    <Package className="w-3 h-3 mr-1" />
                                                    Ready
                                                </Badge>
                                            )}
                                        </div>

                                        {rx.filledDate && (
                                            <div className="text-xs text-nord3 dark:text-nord4">
                                                Filled: {new Date(rx.filledDate).toLocaleString()}
                                            </div>
                                        )}

                                        {rx.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <Button variant="primary" size="sm" className="flex-1">
                                                    Fill Prescription
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    Contact Prescriber
                                                </Button>
                                            </div>
                                        )}

                                        {rx.status === 'READY' && (
                                            <div className="flex gap-2">
                                                <Button variant="success" size="sm" className="flex-1">
                                                    Mark as Picked Up
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    Notify Patient
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {filteredPrescriptions.length === 0 && (
                                    <div className="text-center py-12 text-nord3 dark:text-nord4">
                                        <Pill className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p className="text-sm">No prescriptions found</p>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
