'use client';

import React, { useEffect, useState } from 'react';
import { useSip } from '@/lib/contexts/SipContext';

export default function CallWindow() {
    const { state, endCall, toggleHold, answerCall, rejectCall } = useSip();
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: any;
        if (state.activeCall && state.callDetails?.status === 'CONNECTED') {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [state.activeCall, state.callDetails?.status]);

    if (!state.activeCall || !state.callDetails) return null;

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass fade-in" style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '320px',
            padding: '2rem',
            zIndex: 100,
            background: 'rgba(5, 7, 10, 0.95)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            border: '1px solid var(--primary)'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '32px',
                    background: state.callDetails.status === 'RINGING' ? 'var(--accent)' : 'var(--primary-glow)',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    animation: state.callDetails.status === 'RINGING' ? 'pulse 1.5s infinite' : 'none'
                }}>
                    👤
                </div>
                <h3 style={{ marginBottom: '0.25rem' }}>{state.callDetails.number}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {state.callDetails.status === 'HELD' ? 'On Hold' :
                        state.callDetails.status === 'RINGING' ? 'Incoming Call...' :
                            'In Call • ' + formatTime(timer)}
                </div>
            </div>

            {state.callDetails.status === 'RINGING' ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={rejectCall}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '12px',
                            background: 'var(--error)',
                            color: 'white',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Decline
                    </button>
                    <button
                        onClick={answerCall}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '12px',
                            background: 'var(--success)',
                            color: 'white',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Answer
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        {[
                            { icon: '🎤', label: 'Mute' },
                            { icon: '⏸', label: state.callDetails.status === 'HELD' ? 'Resume' : 'Hold', action: toggleHold },
                            { icon: '➕', label: 'Add' },
                        ].map((btn, i) => (
                            <button
                                key={i}
                                onClick={btn.action}
                                className="glass-hover"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-main)',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{btn.icon}</span>
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={endCall}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: 'var(--error)',
                            color: 'white',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        End Call
                    </button>
                </>
            )}
        </div>
    );
}
