'use client'

import React, { useState } from 'react';
import { Card, Button, Input, Select } from '@/components/nord';
import { createPrescription } from '@/lib/actions/clinical/medications';
import { Loader2, Pill, Plus } from 'lucide-react';

interface PrescriptionComposerProps {
    patientId: string;
    onPrescriptionAdded?: () => void;
}

export function PrescriptionComposer({ patientId, onPrescriptionAdded }: PrescriptionComposerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        medicationName: '',
        dosage: '',
        frequency: 'QD', // Daily
        route: 'PO', // Oral
        quantity: 30,
        refills: 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await createPrescription({
                ...formData,
                patientId,
                providerId: 'current-user-id' // Mock
            });

            // Reset form
            setFormData({
                medicationName: '',
                dosage: '',
                frequency: 'QD',
                route: 'PO',
                quantity: 30,
                refills: 0
            });

            if (onPrescriptionAdded) onPrescriptionAdded();
        } catch (error) {
            console.error("Prescription failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <Card.Header className="pb-3 border-b border-nord4 dark:border-nord2 bg-nord6 dark:bg-nord1">
                <div className="text-sm font-semibold flex items-center gap-2 text-nord1 dark:text-nord6">
                    <Pill className="w-4 h-4 text-nord14" /> New Prescription
                </div>
            </Card.Header>
            <Card.Body className="pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            label="Medication"
                            placeholder="Search drug..."
                            value={formData.medicationName}
                            onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                label="Dosage"
                                placeholder="e.g. 10mg"
                                value={formData.dosage}
                                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Select
                                label="Route"
                                value={formData.route}
                                onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                            >
                                <option value="PO">Oral (PO)</option>
                                <option value="IV">Intravenous (IV)</option>
                                <option value="IM">Intramuscular (IM)</option>
                                <option value="TOP">Topical</option>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Select
                                label="Frequency"
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            >
                                <option value="QD">Daily (QD)</option>
                                <option value="BID">Twice Daily (BID)</option>
                                <option value="TID">Thrice Daily (TID)</option>
                                <option value="QID">Four Times Daily (QID)</option>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Input
                                label="Qty"
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                label="Refills"
                                type="number"
                                value={formData.refills}
                                onChange={(e) => setFormData({ ...formData, refills: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" variant="primary" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-2" /> Prescribe
                            </>
                        )}
                    </Button>
                </form>
            </Card.Body>
        </Card>
    );
}
