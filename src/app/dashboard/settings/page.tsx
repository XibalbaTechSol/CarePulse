import React from 'react';
import ModuleSettings from '@/components/settings/ModuleSettings';
import FaxSettings from '@/components/settings/FaxSettings';
import { getCurrentUser } from '@/lib/auth';

export default async function SettingsPage() {
    const user = await getCurrentUser();
    if (!user) return <div>Unauthorized</div>;

    const organizationId = user.organizationId || 'org_1';

    return (
        <div className="fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
            <header>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Suite Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your enterprise modules and communication configurations.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <ModuleSettings organizationId={organizationId} />

                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Global Preferences</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Application-wide settings such as theme and notifications.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <FaxSettings userId={user.id} />
                </div>
            </div>
        </div>
    );
}
