'use client';

import React from 'react';
import Link from 'next/link';

export function MorningCoffeeWidget({ stats }: { stats: any }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', gridColumn: '1 / -1' }}>
            {/* Missed Visits */}
            <div className="glass" style={{ padding: '1.5rem', borderLeft: stats.missedVisits > 0 ? '4px solid var(--error)' : '4px solid var(--success)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>MISSED VISITS</span>
                    <span>⚠️</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stats.missedVisits > 0 ? 'var(--error)' : 'inherit' }}>
                    {stats.missedVisits}
                </div>
            </div>

            {/* Expiring Authorizations */}
            <div className="glass" style={{ padding: '1.5rem', borderLeft: stats.expiringAuths > 0 ? '4px solid var(--warning)' : '4px solid var(--success)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>EXPIRING AUTHS</span>
                    <span>📅</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {stats.expiringAuths}
                </div>
            </div>

            {/* Unbilled Verified Visits */}
            <div className="glass" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>UNBILLED VERIFIED</span>
                    <span>💰</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                    {stats.unbilledVerified}
                </div>
            </div>
        </div>
    );
}

export function CRMMetricsWidget({ deals, value }: { deals: number, value: string }) {
    return (
        <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem' }}>CRM Overview</h3>
                <span>📊</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Open Deals</span>
                    <span style={{ fontWeight: 'bold' }}>{deals}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pipeline Value</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{value}</span>
                </div>
            </div>
            <Link href="/dashboard/crm" className="btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: '0.8rem', marginTop: '1rem', padding: '0.4rem' }}>
                Go to CRM
            </Link>
        </div>
    );
}

export function PayrollWatchdogWidget({ caregivers }: { caregivers: any[] }) {
    return (
        <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem' }}>Payroll Highlights</h3>
                <span>🛡️</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {caregivers.slice(0, 3).map(cg => (
                    <div key={cg.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                            <span>{cg.name}</span>
                            <span style={{ color: cg.totalHours >= 38 ? 'var(--warning)' : 'inherit' }}>{cg.totalHours}h</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                            <div style={{ width: `${Math.min((cg.totalHours / 40) * 100, 100)}%`, height: '100%', background: cg.totalHours >= 38 ? 'var(--warning)' : 'var(--accent)' }} />
                        </div>
                    </div>
                ))}
            </div>
            <Link href="/dashboard/payroll" className="btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: '0.8rem', marginTop: '1rem', padding: '0.4rem' }}>
                All Payroll
            </Link>
        </div>
    );
}

export function BillingAttentionWidget({ visits }: { visits: any[] }) {
    if (visits.length === 0) return null;
    return (
        <div className="glass" style={{ padding: '1.5rem', gridColumn: '1 / -1', border: '1px solid rgba(255,68,68,0.2)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--error)' }}>● Billing Attention Required ({visits.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {visits.slice(0, 3).map(v => (
                    <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px' }}>
                        <span>{v.client.firstName} {v.client.lastName}</span>
                        <span style={{ color: 'var(--error)' }}>{v.errors.length} errors</span>
                    </div>
                ))}
            </div>
            <Link href="/dashboard/evv" style={{ display: 'block', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>
                View all errors →
            </Link>
        </div>
    );
}

export function FaxStatusWidget({ newFaxes, total }: { newFaxes: number, total: number }) {
    return (
        <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem' }}>Fax Status</h3>
                <span>📠</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>New Faxes</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>{newFaxes}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Recent Activity</span>
                    <span style={{ fontWeight: 'bold' }}>{total}</span>
                </div>
            </div>
            <Link href="/dashboard/fax" className="btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: '0.8rem', marginTop: '1rem', padding: '0.4rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--glass-border)' }}>
                Fax Inbox
            </Link>
        </div>
    );
}

export function VoIPActivityWidget({ calls, missed }: { calls: number, missed: number }) {
    return (
        <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem' }}>Call Log</h3>
                <span>📞</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Today's Calls</span>
                    <span style={{ fontWeight: 'bold' }}>{calls}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Missed</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--error)' }}>{missed}</span>
                </div>
            </div>
            <Link href="/dashboard/phone" className="btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: '0.8rem', marginTop: '1rem', padding: '0.4rem', background: 'linear-gradient(135deg, var(--accent), #3b82f6)' }}>
                Open Dialer
            </Link>
        </div>
    );
}
