
'use client'

import React, { useState } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Pill, AlertTriangle } from 'lucide-react';
import { PrescriptionComposer } from '@/components/clinical/PrescriptionComposer';
import { Card, Badge } from '@/components/nord';

export default function MedicationsPage() {
    const [medications, setMedications] = useState<any[]>([
        { id: '1', medicationName: 'Lisinopril', dosage: '10mg', frequency: 'QD', status: 'ACTIVE' },
        { id: '2', medicationName: 'Metformin', dosage: '500mg', frequency: 'BID', status: 'ACTIVE' }
    ]);

    const handlePrescriptionAdded = () => {
        // Refresh list
        alert('Prescription sent to pharmacy (Simulation)');
    };

    return (
        <ModuleLayout
            moduleName="Medication Management"
            moduleIcon={<Pill className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Medications', href: '/dashboard/clinical/medications' }]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Medications List */}
                    <Card>
                        <Card.Header>
                            <div>
                                <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Active Medications</h3>
                                <p className="text-sm text-nord3 dark:text-nord4">Current regimen for John Doe</p>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-4">
                                {medications.map(med => (
                                    <div key={med.id} className="flex justify-between items-center p-3 border border-nord4 dark:border-nord2 rounded-lg hover:bg-nord6 dark:hover:bg-nord1">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-nord14/20 p-2 rounded-full">
                                                <Pill className="w-4 h-4 text-nord14" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-nord1 dark:text-nord6">{med.medicationName}</div>
                                                <div className="text-sm text-nord3 dark:text-nord4">{med.dosage} • {med.frequency}</div>
                                            </div>
                                        </div>
                                        <Badge variant="success">Active</Badge>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Interaction Alerts Panel */}
                    <Card className="border-l-4 border-l-nord13 bg-nord13/10">
                        <Card.Body className="pt-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-nord13 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-nord13">Potential Interaction</h4>
                                    <p className="text-sm text-nord1 dark:text-nord6 mt-1">
                                        Moderate interaction detected between <strong>Lisinopril</strong> and <strong>Potassium Supplements</strong>. Monitor serum potassium levels.
                                    </p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <PrescriptionComposer patientId="mock-patient-id" onPrescriptionAdded={handlePrescriptionAdded} />
                </div>
            </div>
        </ModuleLayout>
    );
}
