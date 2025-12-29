import React from 'react';
import { sql } from '@/lib/db-sql';
import CarePlanBuilder from '@/components/crm/CarePlanBuilder';
import ScribeRecorder from '@/components/clinical/ScribeRecorder';
import PatientAiOverview from '@/components/clinical/PatientAiOverview';

export default async function CarePlanBuilderPage({ params }: { params: Promise<{ contactId: string }> }) {
    const { contactId } = await params;

    const client = sql.get<any>(`SELECT * FROM Contact WHERE id = ?`, [contactId]);

    if (!client) return <div style={{ padding: '2rem' }}>Client not found</div>;

    // Hydrate care plans
    client.carePlans = sql.all(`SELECT * FROM CarePlan WHERE contactId = ? AND status = 'ACTIVE'`, [contactId]);
    for (const plan of client.carePlans) {
        plan.tasks = sql.all(`SELECT * FROM CarePlanTask WHERE carePlanId = ?`, [plan.id]);
    }

    const activeCarePlan = client.carePlans[0];
    const initialTasks = activeCarePlan?.tasks.map((t: any) => ({
        taskName: t.taskName,
        category: t.category || 'ADL'
    })) || [];

    return (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
            <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Care Plan Builder</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Customize the daily care checklist for <strong>{client.firstName} {client.lastName}</strong>.
                    </p>
                </div>

                <CarePlanBuilder contactId={contactId} initialTasks={initialTasks} />

                {/* Contextual help for the &quot;No-Code&quot; builder */}
                <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                    <h3 style={{ fontSize: '1rem', color: '#3b82f6', marginBottom: '0.5rem' }}>💡 Pro-Tip: Custom Checklists</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                        You can add specific tasks like &quot;Confirm Monday Morning Meds&quot; or &quot;Check Fridge for Expired Food&quot;.
                        Changes are synced in real-time to the caregiver&apos;s mobile app for their next visit.
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <PatientAiOverview
                    contactId={contactId}
                    patientName={`${client.firstName} ${client.lastName}`}
                />
                <ScribeRecorder />
            </div>
        </div>
    );
}
