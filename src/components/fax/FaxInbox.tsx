'use client';

import React, { useEffect, useState } from 'react';
import { getFaxes } from '@/lib/actions';
import { FileText, Clock, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface Fax {
    id: string;
    recipient: string;
    sender: string;
    direction: string;
    status: string;
    isRead?: boolean;
    createdAt: Date;
    remoteJobId?: string;
}

interface FaxInboxProps {
    filter?: 'inbox' | 'sent' | 'queued';
    selectedId?: string | null;
    onSelect?: (id: string) => void;
}

export default function FaxInbox({ filter = 'inbox', selectedId, onSelect }: FaxInboxProps) {
    const [faxes, setFaxes] = useState<Fax[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFaxes = async () => {
        try {
            const data = await getFaxes();
            setFaxes(data as unknown as Fax[]);
        } catch (error) {
            console.error('Failed to load faxes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFaxes();
    }, []);

    const filteredFaxes = faxes.filter(fax => {
        if (filter === 'inbox') return fax.direction === 'INBOUND';
        if (filter === 'sent') return fax.direction === 'OUTBOUND' && fax.status === 'DELIVERED';
        if (filter === 'queued') return fax.direction === 'OUTBOUND' && ['QUEUED', 'IN_PROCESS', 'SENT'].includes(fax.status);
        return true;
    });

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</div>;

    const getHeader = () => {
        if (filter === 'inbox') return 'Received Faxes';
        if (filter === 'sent') return 'Sent Faxes';
        return 'Fax Queue';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header always visible */}
            <h2 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', padding: '1rem 1.25rem 0.5rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {getHeader()}
            </h2>

            {filteredFaxes.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <FileText size={32} style={{ marginBottom: '1rem', opacity: 0.1 }} />
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>No documents found.</p>
                </div>
            ) : (
                filteredFaxes.map((fax) => (
                    <div
                        key={fax.id}
                        onClick={() => onSelect?.(fax.id)}
                        className="glass-hover"
                        style={{
                            padding: '1rem 1.25rem',
                            borderBottom: '1px solid var(--glass-border)',
                            cursor: 'pointer',
                            background: selectedId === fax.id ? 'rgba(var(--primary-rgb), 0.08)' : 'transparent',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start'
                        }}
                    >
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: fax.isRead ? 'rgba(255,255,255,0.03)' : 'rgba(var(--primary-rgb), 0.1)',
                            color: fax.isRead ? 'var(--text-muted)' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {filter === 'inbox' ? <ArrowDownLeft size={18} /> : filter === 'sent' ? <ArrowUpRight size={18} /> : <Clock size={18} />}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                marginBottom: '2px'
                            }}>
                                <span style={{
                                    fontSize: '0.9rem',
                                    fontWeight: fax.isRead ? '500' : '700',
                                    color: fax.isRead ? 'var(--text-main)' : 'white',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {filter === 'inbox' ? fax.sender : fax.recipient}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                                    {new Date(fax.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </span>
                            </div>

                            <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                ID: {fax.remoteJobId || fax.id.substring(0, 8)} • {fax.status}
                            </div>
                        </div>

                        {!fax.isRead && (
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: 'var(--primary)',
                                marginTop: '6px'
                            }} />
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
