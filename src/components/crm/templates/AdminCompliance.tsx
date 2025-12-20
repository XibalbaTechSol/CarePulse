'use client';

import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

export default function AdminCompliance() {
    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Compliance & Operations Dashboard</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass p-4">
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Caregiver Compliance</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>94%</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--warning)', marginTop: '0.25rem' }}>3 Expired Certs</div>
                </div>
                <div className="glass p-4">
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Auth Utilization</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>78%</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '0.25rem' }}>Within Budget</div>
                </div>
                <div className="glass p-4">
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Open Referrals</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '0.25rem' }}>4 High Priority</div>
                </div>
                <div className="glass p-4">
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Avg Assessment Time</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>4.2d</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '0.25rem' }}>-0.5d from last month</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div className="glass" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={18} /> Caregiver Certification Status
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Caregiver</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Certification</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Exp. Date</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Alice Johnson', cert: 'CPR License', expiry: '2025-12-17', status: 'Expired' },
                                { name: 'Bob Smith', cert: 'TB Test', expiry: '2025-12-24', status: 'Due Soon' },
                                { name: 'Carol White', cert: 'Nursing License', expiry: '2026-05-12', status: 'Valid' },
                                { name: 'Dave Brown', cert: 'Background Check', expiry: '2026-01-15', status: 'Valid' },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '0.75rem' }}>{row.name}</td>
                                    <td style={{ padding: '0.75rem' }}>{row.cert}</td>
                                    <td style={{ padding: '0.75rem' }}>{row.expiry}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.7rem',
                                            background: row.status === 'Expired' ? 'rgba(239, 68, 68, 0.1)' : row.status === 'Due Soon' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                            color: row.status === 'Expired' ? 'var(--error)' : row.status === 'Due Soon' ? 'var(--warning)' : 'var(--success)'
                                        }}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="glass" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={18} /> Authorization Tracking
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { client: 'John Doe', auth: 'PA-55432', used: 85, color: 'var(--error)' },
                            { client: 'Jane Roe', auth: 'PA-99821', used: 42, color: 'var(--primary)' },
                            { client: 'Richard Miles', auth: 'PA-11234', used: 92, color: 'var(--error)' },
                        ].map((auth, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>{auth.client} ({auth.auth})</span>
                                    <span style={{ fontWeight: '600' }}>{auth.used}%</span>
                                </div>
                                <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${auth.used}%`, background: auth.used > 90 ? 'var(--error)' : auth.used > 75 ? 'var(--warning)' : 'var(--primary)' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
