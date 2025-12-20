'use client';

import React, { useState } from 'react';
import { saveSipAccountAction } from '@/lib/actions/settings';

export default function SipConfigForm({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        domain: '',
        websocketUrl: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const result = await saveSipAccountAction(userId, formData);
        if (result.error) {
            alert(result.error);
        } else {
            alert('SIP configuration saved successfully!');
        }
        setLoading(false);
    };

    return (
        <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>📞 SIP Phone Configuration</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>SIP Domain</label>
                    <input
                        type="text"
                        className="glass"
                        style={{ width: '100%', padding: '0.75rem' }}
                        value={formData.domain}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                        placeholder="sip.nextiva.com"
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>WebSocket URL (WSS)</label>
                    <input
                        type="text"
                        className="glass"
                        style={{ width: '100%', padding: '0.75rem' }}
                        value={formData.websocketUrl}
                        onChange={(e) => setFormData({ ...formData, websocketUrl: e.target.value })}
                        placeholder="wss://sip.nextiva.com:8089/ws"
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>SIP Username</label>
                        <input
                            type="text"
                            className="glass"
                            style={{ width: '100%', padding: '0.75rem' }}
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>SIP Password</label>
                        <input
                            type="password"
                            className="glass"
                            style={{ width: '100%', padding: '0.75rem' }}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ padding: '1rem' }}
                >
                    {loading ? 'Saving...' : 'Save Configuration'}
                </button>
            </form>
        </div>
    );
}
