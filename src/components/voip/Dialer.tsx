'use client';

import React, { useState } from 'react';
import { useSip } from '@/lib/contexts/SipContext';

export default function Dialer() {
    const [number, setNumber] = useState('');
    const { makeCall } = useSip();

    const handleKeyPress = (key: string) => {
        setNumber(prev => prev + key);
    };

    const handleCall = () => {
        if (number) {
            makeCall(number);
        }
    };

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

    return (
        <div className="glass" style={{
            width: '320px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            margin: '0 auto'
        }}>
            <div style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center',
                fontSize: '2rem',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '0.1em'
            }}>
                {number || '000-000-0000'}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem'
            }}>
                {keys.map(key => (
                    <button
                        key={key}
                        onClick={() => handleKeyPress(key)}
                        className="glass-hover"
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '30px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-main)',
                            fontSize: '1.25rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {key}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                    onClick={() => setNumber(prev => prev.slice(0, -1))}
                    className="glass-hover"
                    style={{
                        flex: 1,
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-main)',
                        cursor: 'pointer'
                    }}
                >
                    Delete
                </button>
                <button
                    onClick={handleCall}
                    style={{
                        flex: 2,
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'var(--success)',
                        border: 'none',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                    }}
                >
                    Call
                </button>
            </div>
        </div>
    );
}
