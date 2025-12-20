'use client';

import React from 'react';

interface Deal {
    id: string;
    title: string;
    value: string;
    company: string;
    stage: string;
    owner: string;
    startDate: string;
    endDate: string;
}

export default function OpportunityGantt({ deals }: { deals: Deal[] }) {
    // Helper to calculate position and width based on dates
    // For demo simplicity, we will map dates to a 100% width container representing "This Month" or "This Quarter"

    const minDate = new Date(Math.min(...deals.map(d => new Date(d.startDate).getTime())));
    const maxDate = new Date(Math.max(...deals.map(d => new Date(d.endDate).getTime())));
    const totalDuration = maxDate.getTime() - minDate.getTime();

    const getPosition = (start: string) => {
        const date = new Date(start).getTime();
        return ((date - minDate.getTime()) / totalDuration) * 100;
    };

    const getWidth = (start: string, end: string) => {
        const startDate = new Date(start).getTime();
        const endDate = new Date(end).getTime();
        return ((endDate - startDate) / totalDuration) * 100;
    };

    return (
        <div className="glass fade-in" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Timeline View</h3>

            <div style={{ position: 'relative', minWidth: '600px' }}>
                {/* Header with months/dates - simplified */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <span>{minDate.toLocaleDateString()}</span>
                    <span>timeline</span>
                    <span>{maxDate.toLocaleDateString()}</span>
                </div>

                {deals.map((deal) => {
                    const left = getPosition(deal.startDate);
                    const width = getWidth(deal.startDate, deal.endDate);

                    return (
                        <div key={deal.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ width: '150px', fontSize: '0.85rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '1rem' }}>
                                {deal.company}
                            </div>
                            <div style={{ flex: 1, position: 'relative', height: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                                <div style={{
                                    position: 'absolute',
                                    left: `${left}%`,
                                    width: `${width}%`,
                                    height: '24px',
                                    top: '4px',
                                    background: 'var(--primary)',
                                    borderRadius: '4px',
                                    opacity: 0.8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0 0.5rem',
                                    fontSize: '0.75rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden'
                                }}>
                                    {deal.title}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Vertical marker for today if in range */}
                <div style={{
                    position: 'absolute',
                    left: '50%', // approximate for demo
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    background: 'var(--accent)',
                    opacity: 0.5,
                    pointerEvents: 'none'
                }}></div>
            </div>
        </div>
    );
}
