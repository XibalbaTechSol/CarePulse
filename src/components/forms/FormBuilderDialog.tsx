'use client';

import React, { useState } from 'react';
import { Plus, X, GripVertical, Save, Trash2 } from 'lucide-react';
import { createForm } from '@/lib/actions/forms';

const FIELD_TYPES = [
    { value: 'TEXT', label: 'Short Text', icon: 'abc' },
    { value: 'NUMBER', label: 'Number', icon: '123' },
    { value: 'DATE', label: 'Date', icon: '📅' },
    { value: 'SIGNATURE', label: 'Signature Pad', icon: '✍️' },
    { value: 'SELECT', label: 'Dropdown Selection', icon: '🔽' },
];

interface Field {
    label: string;
    type: string;
    required: boolean;
    options?: string;
}

export default function FormBuilderDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState<Field[]>([]);
    const [loading, setLoading] = useState(false);

    const addField = () => {
        setFields([...fields, { label: 'New Field', type: 'TEXT', required: false }]);
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const updateField = (index: number, updates: Partial<Field>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        setFields(newFields);
    };

    const handleSave = async () => {
        if (!title) return alert('Title is required');
        if (fields.length === 0) return alert('Add at least one field');

        setLoading(true);
        try {
            await createForm(title, description, fields);
            setIsOpen(false);
            setTitle('');
            setDescription('');
            setFields([]);
        } catch (error) {
            console.error(error);
            alert('Failed to save form');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> New Form
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '2rem'
        }}>
            <div className="glass" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Create New No-Code Form</h2>
                    <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Form Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., ADL Daily Monitoring"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Explain the purpose of this form..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '8px', color: '#fff', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Form Fields</h3>
                        <button onClick={addField} className="btn-ghost" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Plus size={16} /> Add Field
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {fields.map((field, index) => (
                            <div key={index} className="glass" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '1rem', alignItems: 'end' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Field Label</label>
                                    <input
                                        value={field.label}
                                        onChange={(e) => updateField(index, { label: e.target.value })}
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: '4px', color: '#fff' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Field Type</label>
                                    <select
                                        value={field.type}
                                        onChange={(e) => updateField(index, { type: e.target.value })}
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: '4px', color: '#fff' }}
                                    >
                                        {FIELD_TYPES.map(t => <option key={t.value} value={t.value} style={{ color: 'black' }}>{t.label}</option>)}
                                    </select>
                                </div>
                                <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={(e) => updateField(index, { required: e.target.checked })}
                                    />
                                    <span style={{ fontSize: '0.75rem' }}>Req.</span>
                                </div>
                                <button onClick={() => removeField(index)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', marginBottom: '0.5rem' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleSave} disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }}>
                        <Save size={18} /> {loading ? 'Saving...' : 'Publish Form'}
                    </button>
                </div>
            </div>
        </div>
    );
}
