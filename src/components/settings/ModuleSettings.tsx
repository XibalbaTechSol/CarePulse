'use client';

import React, { useEffect, useState } from 'react';
import { getModuleConfigAction, updateModuleConfigAction } from '@/lib/actions/settings';

interface ModuleConfig {
    id: string;
    crmEnabled: boolean;
    emailEnabled: boolean;
    voipEnabled: boolean;
    faxEnabled: boolean;
    storageEnabled: boolean;
}

export default function ModuleSettings({ organizationId }: { organizationId: string }) {
    const [config, setConfig] = useState<ModuleConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadConfig() {
            const result = await getModuleConfigAction(organizationId);
            if (result && result.data) {
                setConfig(result.data as ModuleConfig);
            }
            setLoading(false);
        }
        loadConfig();
    }, [organizationId]);

    const toggleModule = async (module: keyof Omit<ModuleConfig, 'id'>) => {
        if (!config) return;

        const newConfig = { ...config, [module]: !config[module] };
        setConfig(newConfig);
        setSaving(true);

        const result = await updateModuleConfigAction(config.id, { [module]: newConfig[module] });
        if (result.error) {
            alert(result.error);
            setConfig(config); // Revert on error
        }
        setSaving(false);
    };

    if (loading) return <div style={{ color: 'var(--text-muted)' }}>Loading settings...</div>;
    if (!config) return <div style={{ color: 'var(--error)' }}>Failed to load configuration.</div>;

    const modules = [
        { id: 'crmEnabled', label: 'CRM System', icon: '📊', desc: 'Customer and lead management' },
        { id: 'emailEnabled', label: 'Email Suite', icon: '📧', desc: 'IMAP/SMTP business email' },
        { id: 'voipEnabled', label: 'VoIP Phone', icon: '📞', desc: 'SIP-based communication' },
        { id: 'faxEnabled', label: 'Digital Fax', icon: '📠', desc: 'SRFax API integration' },
        { id: 'storageEnabled', label: 'Enterprise Storage', icon: '📁', desc: 'Secure file management' },
    ];

    return (
        <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Module Management</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {modules.map((m) => (
                    <div key={m.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{m.label}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => toggleModule(m.id as any)}
                            disabled={saving}
                            data-testid={`toggle-${m.id}`}
                            style={{
                                width: '48px',
                                height: '24px',
                                borderRadius: '12px',
                                border: 'none',
                                background: (config as any)[m.id] ? 'var(--success)' : 'rgba(255,255,255,0.1)',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '10px',
                                background: '#fff',
                                position: 'absolute',
                                top: '2px',
                                left: (config as any)[m.id] ? '26px' : '2px',
                                transition: 'all 0.3s ease'
                            }} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
