'use client';

import React, { useEffect, useState } from 'react';
import { getContacts } from '@/lib/actions';

export default function ActivityFeed() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadActivities() {
            try {
                const contacts = await getContacts();
                const allActivities = contacts.flatMap((c: any) => c.activities || []);
                allActivities.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setActivities(allActivities.slice(0, 5));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadActivities();
    }, []);

    if (loading) return <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activities.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent activities.</div>
            ) : (
                activities.map((act) => (
                    <div key={act.id} style={{ padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid var(--primary)', background: 'rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>{act.type}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{new Date(act.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', margin: 0 }}>{act.content}</p>
                    </div>
                ))
            )}
        </div>
    );
}
