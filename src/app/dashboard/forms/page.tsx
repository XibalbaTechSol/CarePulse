'use server';

import React from 'react';
import { getForms } from '@/lib/actions/forms';
import { Trash2, ClipboardList } from 'lucide-react';
import FormBuilderDialog from '@/components/forms/FormBuilderDialog';
import PDFFillerDialog from '@/components/forms/PDFFillerDialog';
import FormCard from '@/components/forms/FormCard';
import { prisma } from '@/lib/db';

export default async function FormsDashboard() {
    const forms = await getForms();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contacts = await (prisma as any).contact.findMany({ select: { id: true, firstName: true, lastName: true } });

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>No-Code Form Builder</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create and manage digital forms for ADLs, assessments, and signatures.</p>
                </div>
                <div className="flex gap-4">
                    <PDFFillerDialog contacts={contacts} />
                    <FormBuilderDialog />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {forms.map((form: { id: string; title: string; description: string | null; fields: { id: string }[]; submissions?: { id: string }[] }) => (
                    <FormCard key={form.id} form={form} />
                ))}
            </div>

            {forms.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                    <ClipboardList size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                    <p style={{ color: 'var(--text-muted)' }}>No forms created yet. Start by clicking &quot;New Form&quot;.</p>
                </div>
            )}
        </div>
    );
}
