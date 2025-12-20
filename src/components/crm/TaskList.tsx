'use client';

import React, { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '@/lib/actions';

export default function TaskList() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTasks() {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadTasks();
    }, []);

    const handleToggle = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'COMPLETED' ? 'OPEN' : 'COMPLETED';
        try {
            await updateTaskStatus(id, newStatus);
            setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No pending tasks.</div>
            ) : (
                tasks.map((task) => (
                    <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                        <input
                            type="checkbox"
                            checked={task.status === 'COMPLETED'}
                            onChange={() => handleToggle(task.id, task.status)}
                            style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', color: task.status === 'COMPLETED' ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none' }}>
                                {task.title}
                            </div>
                            {task.dueDate && <div style={{ fontSize: '0.65rem', color: 'var(--error)' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</div>}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
