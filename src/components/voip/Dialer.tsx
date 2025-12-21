'use client';

import React, { useState } from 'react';
import { useSip } from '@/lib/contexts/SipContext';
import { Phone, Search } from 'lucide-react';

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

    const keys = [
        { main: '1', sub: '' }, { main: '2', sub: 'ABC' }, { main: '3', sub: 'DEF' },
        { main: '4', sub: 'GHI' }, { main: '5', sub: 'JKL' }, { main: '6', sub: 'MNO' },
        { main: '7', sub: 'PQRS' }, { main: '8', sub: 'TUV' }, { main: '9', sub: 'WXYZ' },
        { main: '*', sub: '' }, { main: '0', sub: '+' }, { main: '#', sub: '' }
    ];

    return (
        <div style={{
            width: '280px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 0.5rem'
            }}>
                <div style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-main)',
                    flex: 1,
                    textAlign: 'left',
                    padding: '0.5rem',
                    minHeight: '2rem'
                }}>
                    {number || 'Enter a name or number'}
                </div>
                {number && (
                    <button
                        onClick={() => setNumber('')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                        clear
                    </button>
                )}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                justifyItems: 'center'
            }}>
                {keys.map(key => (
                    <button
                        key={key.main}
                        onClick={() => handleKeyPress(key.main)}
                        className="glass-hover"
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{key.main}</span>
                        {key.sub && <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>{key.sub}</span>}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <button
                    onClick={handleCall}
                    disabled={!number}
                    style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'var(--success)',
                        border: 'none',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: number ? 'pointer' : 'not-allowed',
                        opacity: number ? 1 : 0.5,
                        boxShadow: number ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    <Phone size={24} fill="white" />
                </button>
            </div>
        </div>
    );
}
