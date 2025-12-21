'use client';

import React, { useState } from 'react';
import { Play, Pause, Trash2, Phone, Download } from 'lucide-react';

export default function VoicemailView() {
    const [playingId, setPlayingId] = useState<number | null>(null);

    const voicemails = [
        { id: 1, name: '76934', number: '76934', time: 'Fri', duration: '0:24', transcript: 'Your verification code for LinkedIn is 994886...', avatar: '76', color: '#ff5722', isNew: true },
        { id: 2, name: 'Caller Unknown', number: '+1 (555) 000-0000', time: 'Mon', duration: '1:45', transcript: 'Hello this is an important message regarding your vehicle extended warranty...', avatar: '#', color: '#607d8b', isNew: false },
        { id: 3, name: 'Mom', number: '+1 (555) 111-2222', time: 'Last Week', duration: '0:58', transcript: 'Hey just calling to check in, give me a call back when you can.', avatar: 'M', color: '#e91e63', isNew: false },
    ];

    const togglePlay = (id: number) => {
        if (playingId === id) {
            setPlayingId(null);
        } else {
            setPlayingId(id);
        }
    };

    return (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '300', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Voicemail</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {voicemails.map(vm => (
                        <div key={vm.id} style={{
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)',
                            padding: '1.5rem',
                            display: 'flex',
                            gap: '1.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }} className="glass-hover">
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: vm.color,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                flexShrink: 0
                            }}>
                                {vm.avatar}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <div>
                                        <span style={{ fontWeight: vm.isNew ? '700' : '500', fontSize: '1.1rem', color: 'var(--text-main)', marginRight: '0.5rem' }}>{vm.name}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{vm.number}</span>
                                    </div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{vm.time}</span>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); togglePlay(vm.id); }}
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: 'var(--primary)',
                                            border: 'none',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {playingId === vm.id ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" style={{ marginLeft: '2px' }} />}
                                    </button>
                                    <div style={{
                                        flex: 1,
                                        height: '4px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '2px',
                                        position: 'relative',
                                        maxWidth: '300px'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: playingId === vm.id ? '40%' : '0%',
                                            background: 'var(--primary)',
                                            borderRadius: '2px'
                                        }} />
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{vm.duration}</span>
                                </div>

                                <div style={{
                                    fontSize: '0.95rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: '1.5',
                                    fontStyle: 'italic',
                                    background: 'rgba(0,0,0,0.2)',
                                    padding: '0.75rem',
                                    borderRadius: '8px'
                                }}>
                                    &quot;{vm.transcript}&quot;
                                </div>

                                {/* Actions */}
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    marginTop: '1rem',
                                    opacity: 0.7
                                }}>
                                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }} title="Call back"><Phone size={18} /></button>
                                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }} title="Delete"><Trash2 size={18} /></button>
                                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }} title="Download"><Download size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
