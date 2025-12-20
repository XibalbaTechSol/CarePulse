'use client';

import React, { useState } from 'react';

const STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'];

// Shared text removed, updating signature
interface Deal {
    id: string;
    title: string;
    value: string;
    company: string;
    stage: string;
    // adding optional props to match shared type if needed
    owner?: string;
    startDate?: string;
    endDate?: string;
}

export default function PipelineBoard({ deals }: { deals: Deal[] }) {
    // const [deals, setDeals] = useState(INITIAL_DEALS); // Removing internal state init

    return (
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            {STAGES.map(stage => (
                <div key={stage} style={{ minWidth: '280px', flex: 1 }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px'
                    }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>{stage}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {deals.filter(d => d.stage === stage).length}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {deals.filter(d => d.stage === stage).map(deal => (
                            <div key={deal.id} className="glass glass-hover" style={{ padding: '1rem', cursor: 'pointer' }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{deal.title}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{deal.company}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{deal.value}</span>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>👤</div>
                                </div>
                            </div>
                        ))}

                        <button className="glass-hover" style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px dashed var(--glass-border)',
                            borderRadius: '8px',
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                        }}>
                            + Add Deal
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
