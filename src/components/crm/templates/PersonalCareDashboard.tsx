'use client';

import React from 'react';
import { HeartPulse, Calendar, UserPlus, ClipboardList, ShieldCheck, FileWarning, Clock } from 'lucide-react';
import LeadTable from '@/components/crm/LeadTable';

export default function PersonalCareDashboard() {
    return (
        <div className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass p-6 text-card-foreground">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Active Clients</span>
                        <HeartPulse size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>124</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+2 this week</div>
                </div>
                <div className="glass p-6 text-card-foreground">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Visits Today</span>
                        <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>42</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>12 in progress</div>
                </div>
                <div className="glass p-6 text-card-foreground">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Pending Intake</span>
                        <UserPlus size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>8</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Needs Assessment</div>
                </div>
                <div className="glass p-6 text-card-foreground">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Expiring Auths</span>
                        <FileWarning size={16} style={{ color: 'var(--error)' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>5</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Next 7 days</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="glass" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>Recent Visits</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Client</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Caregiver</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Service</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { client: 'John Doe', caregiver: 'Alice Johnson', service: 'Personal Care', status: 'In Progress' },
                                { client: 'Jane Roe', caregiver: 'Bob Smith', service: 'Respite Care', status: 'Completed' },
                                { client: 'Richard Miles', caregiver: 'Carol White', service: 'HHA', status: 'Completed' },
                                { client: 'Sarah Connor', caregiver: 'Alice Johnson', service: 'Personal Care', status: 'Scheduled' },
                            ].map((visit, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '0.75rem' }}>{visit.client}</td>
                                    <td style={{ padding: '0.75rem' }}>{visit.caregiver}</td>
                                    <td style={{ padding: '0.75rem' }}>{visit.service}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            background: visit.status === 'In Progress' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                            color: visit.status === 'In Progress' ? 'var(--success)' : 'var(--text-muted)'
                                        }}>
                                            {visit.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="glass" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldCheck size={20} className="text-primary" /> Compliance Alerts
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { name: 'Alice Johnson', issue: 'CPR License Expired', date: '2 days ago', severity: 'high' },
                            { name: 'Bob Smith', issue: 'TB Test Renewal Due', date: 'In 5 days', severity: 'medium' },
                            { name: 'Office Staff', issue: 'New Hire Training', date: 'Tomorrow', severity: 'low' },
                        ].map((alert, i) => (
                            <div key={i} style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.03)',
                                borderLeft: `4px solid ${alert.severity === 'high' ? 'var(--error)' : alert.severity === 'medium' ? 'var(--warning)' : 'var(--primary)'}`
                            }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{alert.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{alert.issue}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{alert.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Active Contacts & Leads</h3>
                <LeadTable />
            </div>
        </div>
    );
}
