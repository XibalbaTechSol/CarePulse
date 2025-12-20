'use client';

import React, { useState } from 'react';
import { saveEmailAccountAction } from '@/lib/actions/settings';

export default function EmailConfigForm({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        imapHost: '',
        imapPort: 993,
        smtpHost: '',
        smtpPort: 465,
        username: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const result = await saveEmailAccountAction(userId, formData);
        if (result.error) {
            alert(result.error);
        } else {
            alert('Email configuration saved successfully!');
        }
        setLoading(false);
    };

    return (
        <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>📧 Email Account Configuration</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>IMAP Host</label>
                        <input
                            type="text"
                            className="glass"
                            style={{ width: '100%', padding: '0.75rem' }}
                            value={formData.imapHost}
                            onChange={(e) => setFormData({ ...formData, imapHost: e.target.value })}
                            placeholder="imap.gmail.com"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>IMAP Port</label>
                        <input
                            type="number"
                            className="glass"
                            style={{ width: '100%', padding: '0.75rem' }}
                            value={formData.imapPort}
                            onChange={(e) => setFormData({ ...formData, imapPort: parseInt(e.target.value) })}
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>SMTP Host</label>
                        <input
                            type="text"
                            className="glass"
                            style={{ width: '100%', padding: '0.75rem' }}
                            value={formData.smtpHost}
                            onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                            placeholder="smtp.gmail.com"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>SMTP Port</label>
                        <input
                            type="number"
                            className="glass"
                            style={{ width: '100%', padding: '0.75rem' }}
                            value={formData.smtpPort}
                            onChange={(e) => setFormData({ ...formData, smtpPort: parseInt(e.target.value) })}
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Username/Email</label>
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
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password (App Password)</label>
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
