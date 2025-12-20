import React from 'react';
import { prisma } from '@/lib/db';
import CarePlanBuilder from '@/components/crm/CarePlanBuilder';

export default async function CarePlanBuilderPage({ params }: { params: Promise<{ contactId: string }> }) {
    const { contactId } = await params;

    const client = await prisma.contact.findUnique({
        where: { id: contactId },
        include: {
            carePlans: {
                where: { status: 'ACTIVE' },
                include: { tasks: true }
            }
        }
    });

    if (!client) return <div style={{ padding: '2rem' }}>Client not found</div>;

    const activeCarePlan = client.carePlans[0];
    const initialTasks = activeCarePlan?.tasks.map(t => ({
        taskName: t.taskName,
        category: t.category || 'ADL'
    })) || [];

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Care Plan Builder</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Customize the daily care checklist for <strong>{client.firstName} {client.lastName}</strong>.
                </p>
            </div>

            <CarePlanBuilder contactId={contactId} initialTasks={initialTasks} />

            {/* Contextual help for the "No-Code" builder */}
            <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <h3 style={{ fontSize: '1rem', color: '#3b82f6', marginBottom: '0.5rem' }}>💡 Pro-Tip: Custom Checklists</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    You can add specific tasks like "Confirm Monday Morning Meds" or "Check Fridge for Expired Food".
                    Changes are synced in real-time to the caregiver's mobile app for their next visit.
                </p>
            </div>
        </div>
    );
}
