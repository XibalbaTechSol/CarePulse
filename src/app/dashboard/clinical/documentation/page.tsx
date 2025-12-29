'use client'

import React, { useState } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { FileText, PenTool, Save } from 'lucide-react';
import { Button, Tabs, TabsList, TabsTrigger, TabsContent, Card, Textarea, Label } from '@/components/nord';
import { AmbientScribe } from '@/components/clinical/AmbientScribe';
import { createClinicalNote } from '@/lib/actions/clinical/documentation';

interface NoteContent {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

export default function ClinicalDocumentationPage() {
    const [noteContent, setNoteContent] = useState<NoteContent>({
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });

    // Mock user for now - normally from session
    const [patientId] = useState('mock-patient-id');
    const [isSaving, setIsSaving] = useState(false);

    const handleNoteGenerated = (note: any) => {
        setNoteContent((prev: any) => ({
            ...prev,
            ...note
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await createClinicalNote({
                patientId,
                providerId: 'current-user-id',
                type: 'SOAP',
                content: JSON.stringify(noteContent)
            });
            // Show success toast
            alert('Note saved successfully!');
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ModuleLayout
            moduleName="Clinical Documentation"
            moduleIcon={<FileText className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Documentation', href: '/dashboard/clinical/documentation' }]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
                {/* Left Side: Ambient Scribe */}
                <div className="flex flex-col gap-6">
                    <AmbientScribe onNoteGenerated={handleNoteGenerated} />
                </div>

                {/* Right Side: Note Editor */}
                <div className="flex flex-col gap-4 overflow-hidden">
                    <div className="flex justify-between items-center bg-nord6 dark:bg-nord0 p-4 rounded-lg border border-nord4 dark:border-nord2 shadow-sm">
                        <h2 className="font-semibold flex items-center gap-2 text-nord1 dark:text-nord6">
                            <PenTool className="w-4 h-4 text-nord10" />
                            Note Editor
                        </h2>
                        <Button onClick={handleSave} disabled={isSaving} className="gap-2" variant="primary">
                            <Save className="w-4 h-4" /> Save Note
                        </Button>
                    </div>

                    <Card className="flex-1 overflow-y-auto">
                        <Card.Body className="p-6 space-y-6">
                            {/* Patient Info Header Mock */}
                            <div className="flex gap-4 p-4 bg-nord5 dark:bg-nord1/50 rounded-md border border-nord4 dark:border-nord2 text-sm">
                                <div>
                                    <Label className="text-xs text-nord3">Patient</Label>
                                    <div className="font-medium text-nord0 dark:text-nord6">John Doe (DOB: 01/15/1980)</div>
                                </div>
                                <div className="h-full w-px bg-nord4 dark:bg-nord2" />
                                <div>
                                    <Label className="text-xs text-nord3">Encounter</Label>
                                    <div className="font-medium text-nord0 dark:text-nord6">Initial Consultation</div>
                                </div>
                            </div>

                            <Tabs defaultValue="soap" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="soap">SOAP Note</TabsTrigger>
                                    <TabsTrigger value="free">Free Text</TabsTrigger>
                                </TabsList>
                                <TabsContent value="soap" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Textarea
                                            label="Subjective"
                                            value={noteContent.subjective}
                                            onChange={(e) => setNoteContent({ ...noteContent, subjective: e.target.value })}
                                            className="min-h-[100px]"
                                            placeholder="Patient's chief complaint, history of present illness..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Textarea
                                            label="Objective"
                                            value={noteContent.objective}
                                            onChange={(e) => setNoteContent({ ...noteContent, objective: e.target.value })}
                                            className="min-h-[100px]"
                                            placeholder="Vital signs, physical exam findings..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Textarea
                                            label="Assessment"
                                            value={noteContent.assessment}
                                            onChange={(e) => setNoteContent({ ...noteContent, assessment: e.target.value })}
                                            className="min-h-[80px]"
                                            placeholder="Diagnoses, differential diagnoses..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Textarea
                                            label="Plan"
                                            value={noteContent.plan}
                                            onChange={(e) => setNoteContent({ ...noteContent, plan: e.target.value })}
                                            className="min-h-[100px]"
                                            placeholder="Treatment plan, medications, follow-up..."
                                        />
                                    </div>
                                </TabsContent>
                                <TabsContent value="free">
                                    <Textarea
                                        className="min-h-[400px]"
                                        placeholder="Type free text note here..."
                                    />
                                </TabsContent>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
