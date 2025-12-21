'use client';

import React from 'react';
import Dialer from './Dialer';

export default function CallsView() {
    const calls = [
        { id: 1, name: '76934', number: '76934', time: 'Fri', type: 'INBOUND', subtext: 'Your LinkedIn verification code is 994886.', avatar: '76', color: '#ff5722' },
        { id: 2, name: 'Alyssa G Voice', number: '+1 (262) 412-3861', time: 'Fri', type: 'OUTBOUND', subtext: 'You: ^^crazy egg shaped baby thing from ...', avatar: 'A', color: '#795548' },
        { id: 3, name: '98900', number: '98900', time: 'Thu', type: 'INBOUND', subtext: 'CHS: Your student Brayden has an unexc...', avatar: '98', color: '#e91e63' },
        { id: 4, name: 'LilMike', number: '+1 (612) 562-7746', time: 'Wed', type: 'OUTBOUND', subtext: 'You: Shit got that gas money', avatar: 'L', color: '#3f51b5' },
        { id: 5, name: 'Sam', number: '+1 (555) 123-4567', time: 'Tue', type: 'OUTBOUND', subtext: 'You: This is Jacob my phone is turned off...', avatar: 'S', color: '#f44336' },
    ];

    return (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Middle List Pane */}
            <div style={{
                width: '320px',
                overflowY: 'auto',
                borderRight: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.01)'
            }}>
                <div style={{ padding: '1rem 1.5rem' }}>
                    <button style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '24px',
                        background: 'transparent',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--primary)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }} className="glass-hover">
                        <span style={{ fontSize: '1.5rem', lineHeight: '0' }}>+</span> Make a call
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {calls.map(call => (
                        <div key={call.id} className="glass-hover" style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.75rem 1.5rem',
                            cursor: 'pointer',
                            gap: '1rem',
                            borderBottom: '1px solid rgba(255,255,255,0.03)'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: call.color || 'var(--primary-soft)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                flexShrink: 0
                            }}>
                                {call.avatar}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <span style={{ fontWeight: '500', fontSize: '0.95rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {call.name}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{call.time}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {call.subtext}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Dialpad */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                    {/* Empty state or call history detail could go here */}
                    <div style={{ opacity: 0.5 }}>Select a call to view details</div>
                </div>

                {/* Dialpad Section (Bottom Right) */}
                <div style={{
                    borderTop: '1px solid var(--glass-border)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.01)'
                }}>
                    <Dialer />
                </div>
            </div>
        </div>
    );
}
