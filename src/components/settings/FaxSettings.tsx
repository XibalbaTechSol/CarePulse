'use client';

import React, { useState, useEffect } from 'react';
import { saveSRFaxConfigAction } from '@/lib/actions/settings';
import { getCurrentUser } from '@/lib/auth'; // Note: This might need to be a server action or passed as prop

export default function FaxSettings({ userId }: { userId: string }) {
    const [config, setConfig] = useState({
        accountId: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const result = await saveSRFaxConfigAction(userId, config);

        if (result.error) {
            setMessage('Error: ' + result.error);
        } else {
            setMessage('SRFax settings saved successfully!');
        }
        setLoading(false);
    };

    return (
        <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📠 SRFax Configuration
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Account ID</label>
                    <input
                        type="text"
                        value={config.accountId}
                        onChange={(e) => setConfig({ ...config, accountId: e.target.value })}
                        className="input-glass"
                        placeholder="e.g. 123456"
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>API Password</label>
                    <input
                        type="password"
                        value={config.password}
                        onChange={(e) => setConfig({ ...config, password: e.target.value })}
                        className="input-glass"
                        placeholder="••••••••"
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        This password is encrypted before being stored.
                    </p>
                </div>
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ marginTop: '1rem', padding: '0.75rem' }}
                >
                    {loading ? 'Saving...' : 'Update SRFax Credentials'}
                </button>
                {message && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        background: message.startsWith('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                        color: message.startsWith('Error') ? 'var(--error)' : 'var(--success)',
                        border: message.startsWith('Error') ? '1px solid var(--error)' : '1px solid var(--success)'
                    }}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}
