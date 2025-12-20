'use client';

import React, { useState } from 'react';
import { Trash2, ClipboardList, Loader2 } from 'lucide-react';
import { deleteForm } from '@/lib/actions/forms';

interface FormCardProps {
    form: {
        id: string;
        title: string;
        description: string | null;
        fields: { id: string }[];
        submissions?: { id: string }[];
    };
}

export default function FormCard({ form }: FormCardProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this form?')) return;
        setLoading(true);
        try {
            await deleteForm(form.id);
        } catch (error) {
            console.error(error);
            alert('Failed to delete form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{form.title}</div>
                <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: 'var(--success)'
                }}>Active</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1, marginBottom: '1.5rem' }}>
                {form.description || 'No description provided.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {form.fields.length} Fields • {form.submissions?.length || 0} Submissions
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-ghost" style={{ padding: '0.5rem' }} title="View Submissions" onClick={() => alert('View Submissions Implementation Pending')}>
                        <ClipboardList size={18} />
                    </button>
                    <button className="btn-ghost" style={{ padding: '0.5rem', color: 'var(--error)' }} title="Delete Form" onClick={handleDelete} disabled={loading}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
