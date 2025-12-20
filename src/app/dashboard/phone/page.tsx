'use client';

import React, { useState } from 'react';
import { useSip } from '@/lib/contexts/SipContext';
import Dialer from '@/components/voip/Dialer';
import CallWindow from '@/components/voip/CallWindow';
import SipConfigForm from '@/components/voip/SipConfigForm';
import { Settings, Phone } from 'lucide-react';

function SipStatusAndTabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: 'dashboard' | 'settings') => void }) {
    const { state } = useSip();

    let statusColor = 'var(--text-muted)';
    let statusText = 'Disconnected';

    switch (state.status) {
        case 'CONNECTED': statusColor = 'var(--success)'; statusText = 'SIP Line: Active'; break;
        case 'REGISTERING': statusColor = 'var(--warning)'; statusText = 'Connecting...'; break;
        case 'ERROR': statusColor = 'var(--error)'; statusText = 'Connection Failed'; break;
        case 'DISCONNECTED': statusColor = 'var(--text-muted)'; statusText = 'Disconnected'; break;
    }

    return (
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Phone System</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage calls, view history, and handle team communications.</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="glass" style={{ display: 'flex', padding: '4px', gap: '4px' }}>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'dashboard' ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Phone size={16} /> Phone
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: activeTab === 'settings' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'settings' ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Settings size={16} /> Settings
                    </button>
                </div>

                <div className="glass" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: statusColor }}>●</span>
                    <span style={{ fontSize: '0.9rem' }}>{statusText}</span>
                </div>
            </div>
        </div>
    );
}

export default function PhoneDashboard() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');
    const userId = 'user_1'; // Mock

    return (
        <div className="fade-in">
            <SipStatusAndTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === 'dashboard' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Call History</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { name: 'John Smith', number: '+1 (555) 123-4567', time: '10:30 AM', type: 'INBOUND', duration: '5:24' },
                                { name: 'Sarah Wilson', number: '+1 (555) 987-6543', time: 'Yesterday', type: 'OUTBOUND', duration: '2:15' },
                                { name: 'Unknown', number: '+1 (555) 444-5555', time: 'Dec 18', type: 'MISSED', duration: '-' },
                            ].map((call, i) => (
                                <div key={i} className="glass-hover" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    background: 'rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '20px',
                                            background: 'rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {call.type === 'INBOUND' ? '📞' : call.type === 'OUTBOUND' ? '📤' : '❌'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{call.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{call.number}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.85rem' }}>{call.time}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{call.duration}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Dial Pad</h2>
                        <Dialer />
                    </div>
                </div>
            ) : (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <SipConfigForm userId={userId} />
                </div>
            )}

            <CallWindow />
        </div>
    );
}
