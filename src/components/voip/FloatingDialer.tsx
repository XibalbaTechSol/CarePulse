'use client';

import React, { useState, useEffect } from 'react';
import { useSip } from '@/lib/contexts/SipContext';
import { Phone, PhoneOff, Mic, X, Star } from 'lucide-react';

export default function FloatingDialer() {
    const { state, makeCall, endCall } = useSip();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    // Simplified: manual expansion only for now to avoid cascading render lint
    // In real app, we'd use a more complex state sync or ref

    if (!isExpanded && !state.activeCall) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="glass glass-hover"
                data-testid="floating-dialer-btn"
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--primary)',
                    color: '#fff',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                }}
            >
                <Phone size={24} />
            </button>
        );
    }

    return (
        <div className="glass fade-in" style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '320px',
            padding: '1.5rem',
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={16} className="text-primary" /> Dialer
                </h4>
                <button
                    onClick={() => setIsExpanded(false)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    disabled={state.activeCall}
                >
                    <X size={18} />
                </button>
            </div>

            {state.activeCall ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{state.callDetails?.number}</div>
                    <div style={{ color: 'var(--success)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Connected</div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                        <button className="glass glass-hover" style={{ width: '48px', height: '48px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Mic size={20} />
                        </button>
                        <button
                            onClick={endCall}
                            style={{ width: '60px', height: '60px', borderRadius: '30px', background: 'var(--error)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <PhoneOff size={24} />
                        </button>
                        <button className="glass glass-hover" style={{ width: '48px', height: '48px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Star size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <input
                        type="text"
                        className="glass"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.25rem', textAlign: 'center', marginBottom: '1rem' }}
                        placeholder="Enter number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(num => (
                            <button
                                key={num}
                                onClick={() => setPhoneNumber(prev => prev + num)}
                                className="glass-hover"
                                data-testid={`keypad-${num}`}
                                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: '#fff', cursor: 'pointer' }}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => makeCall(phoneNumber)}
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
                    >
                        <Phone size={20} /> Call
                    </button>
                </>
            )}
        </div>
    );
}
