'use client';

import React, { useState } from 'react';
import { saveDashboardLayoutAction } from '@/lib/actions/settings';

const AVAILABLE_WIDGETS = [
    { id: 'morning_coffee', name: 'Morning Coffee (Summary)', icon: '☕' },
    { id: 'billing_attention', name: 'Billing Alerts', icon: '🚨' },
    { id: 'crm_metrics', name: 'CRM Pipeline', icon: '📈' },
    { id: 'payroll_watchdog', name: 'Payroll Watchdog', icon: '🛡️' },
    { id: 'voip_activity', name: 'Call Log', icon: '📞' },
    { id: 'fax_status', name: 'Fax Status', icon: '📠' },
];

export default function DashboardCustomizer({ organizationId, currentLayout }: { organizationId: string, currentLayout: string[] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [enabledWidgets, setEnabledWidgets] = useState<string[]>(currentLayout);
    const [isSaving, setIsSaving] = useState(false);

    const toggleWidget = (id: string) => {
        if (enabledWidgets.includes(id)) {
            setEnabledWidgets(enabledWidgets.filter(w => w !== id));
        } else {
            setEnabledWidgets([...enabledWidgets, id]);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await saveDashboardLayoutAction(organizationId, JSON.stringify(enabledWidgets));
        if ('success' in result) {
            setIsEditing(false);
            alert('Dashboard updated!');
        } else {
            alert('Failed to save layout');
        }
        setIsSaving(false);
    };

    if (!isEditing) {
        return (
            <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    zIndex: 100,
                    padding: '0.8rem 1.5rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: '30px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                ⚙️ Customize Dashboard
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Customize Your Dashboard</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {AVAILABLE_WIDGETS.map(w => (
                        <div
                            key={w.id}
                            onClick={() => toggleWidget(w.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: enabledWidgets.includes(w.id) ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>{w.icon}</span>
                            <span style={{ flex: 1 }}>{w.name}</span>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '4px',
                                border: '2px solid var(--accent)',
                                background: enabledWidgets.includes(w.id) ? 'var(--accent)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {enabledWidgets.includes(w.id) && <span style={{ fontSize: '0.7rem', color: 'white' }}>✓</span>}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setEnabledWidgets(currentLayout);
                        }}
                        className="btn-primary"
                        style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: 'white' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn-primary"
                        style={{ flex: 1 }}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </div>
        </div>
    );
}
