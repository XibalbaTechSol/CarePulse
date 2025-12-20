'use client';

import React, { useState } from 'react';
import { saveCarePlan } from '@/lib/actions/crm';

interface Task {
    taskName: string;
    category: string;
}

export default function CarePlanBuilder({ contactId, initialTasks = [] }: { contactId: string, initialTasks?: Task[] }) {
    const [title, setTitle] = useState('Standard Care Plan');
    const [tasks, setTasks] = useState<Task[]>(initialTasks.length > 0 ? initialTasks : [
        { taskName: 'Meal Preparation', category: 'IADL' },
        { taskName: 'Bathing Assistance', category: 'ADL' },
        { taskName: 'Medication Reminder', category: 'CLINICAL' }
    ]);
    const [isSaving, setIsSaving] = useState(false);

    const addTask = () => {
        setTasks([...tasks, { taskName: '', category: 'ADL' }]);
    };

    const removeTask = (index: number) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const updateTask = (index: number, field: keyof Task, value: string) => {
        const newTasks = [...tasks];
        newTasks[index] = { ...newTasks[index], [field]: value };
        setTasks(newTasks);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const validTasks = tasks.filter(t => t.taskName.trim() !== '');
            if (validTasks.length === 0) {
                alert('Please add at least one task');
                return;
            }
            await saveCarePlan(contactId, title, validTasks);
            alert('Care Plan saved successfully! It will now appear in the caregiver app.');
        } catch (error) {
            console.error(error);
            alert('Failed to save care plan');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Care Plan Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Monday Morning Checklist"
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '1.1rem'
                    }}
                />
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Care Tasks & Daily Checklists</h3>
                    <button
                        onClick={addTask}
                        className="btn-primary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--glass-border)' }}
                    >
                        + Add Task
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {tasks.map((task, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.02)',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <div style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    placeholder="Task Name (e.g. Assist with grooming)"
                                    value={task.taskName}
                                    onChange={(e) => updateTask(index, 'taskName', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <div style={{ width: '150px' }}>
                                <select
                                    value={task.category}
                                    onChange={(e) => updateTask(index, 'category', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'white',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <option value="ADL">ADL</option>
                                    <option value="IADL">IADL</option>
                                    <option value="CLINICAL">CLINICAL</option>
                                    <option value="SAFETY">SAFETY</option>
                                </select>
                            </div>
                            <button
                                onClick={() => removeTask(index)}
                                style={{
                                    background: 'rgba(255,68,68,0.1)',
                                    border: 'none',
                                    color: '#ff4444',
                                    cursor: 'pointer',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem'
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '8px' }}>
                            No tasks added yet. Click &quot;+ Add Task&quot; to begin.
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                    onClick={handleSave}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1.2rem', fontSize: '1rem', fontWeight: 'bold' }}
                    disabled={isSaving}
                >
                    {isSaving ? 'Processing...' : 'Deploy Care Plan'}
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Deployed care plans are immediately synced with the caregiver mobile app for this client.
                </p>
            </div>
        </div>
    );
}
