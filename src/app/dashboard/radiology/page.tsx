'use client';

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Scan, FileImage, Download, Eye, Upload } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { createImagingOrder, getImagingExams } from '@/lib/actions/hospital/radiology';

export default function RadiologyPage() {
    const [exams, setExams] = useState<any[]>([]);

    const loadExams = async () => {
        const data = await getImagingExams('mock-patient-id');
        setExams(data as any[]);
    };

    useEffect(() => {
        loadExams();
    }, []);

    const handleOrder = async () => {
        await createImagingOrder({
            patientId: 'mock-patient-id',
            modality: 'CT',
            bodyPart: 'Abdomen',
            reason: 'Pain',
            providerId: 'doc-1',
            priority: 'ROUTINE'
        });
        loadExams();
        alert('Imaging ordered!');
    };

    return (
        <ModuleLayout
            moduleName="Radiology & Imaging"
            moduleIcon={<Scan className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Radiology', href: '/dashboard/radiology' }]}
        >
            <div className="flex gap-4 mb-6">
                <Button onClick={handleOrder}><Scan className="w-4 h-4 mr-2" /> Order Study</Button>
                <Button variant="outline"><Upload className="w-4 h-4 mr-2" /> Upload External Images</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Exams List */}
                <div className="space-y-4">
                    {exams.map(exam => (
                        <Card key={exam.id}>
                            <Card.Body className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-nord6 dark:bg-nord2 rounded flex items-center justify-center">
                                        <FileImage className="w-6 h-6 text-nord3 dark:text-nord4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-nord1 dark:text-nord6">{exam.modality} {exam.bodyPart}</h4>
                                        <div className="text-sm text-nord3 dark:text-nord4">{new Date(exam.orderedAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant={exam.status === 'COMPLETED' ? 'success' : 'primary'}>
                                        {exam.status}
                                    </Badge>
                                    {exam.status === 'COMPLETED' && (
                                        <Button size="sm" variant="ghost">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>

                {/* Viewer (Mock) */}
                <Card className="bg-black border-nord0 min-h-[400px] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-4 left-4 text-white text-xs z-10">
                        <div>DICOM VIEWER v2.0</div>
                        <div className="text-nord4">Series: 231A • Slice: 45/120</div>
                    </div>

                    <div className="text-nord3 flex flex-col items-center">
                        <Scan className="w-16 h-16 mb-4 opacity-50" />
                        <p>Select an exam to view images</p>
                    </div>

                    {/* Grid lines mock */}
                    <div className="absolute inset-0 border-t border-nord0/50 top-1/2" />
                    <div className="absolute inset-0 border-l border-nord0/50 left-1/2" />
                </Card>
            </div>
        </ModuleLayout>
    );
}
