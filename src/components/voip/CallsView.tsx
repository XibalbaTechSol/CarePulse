'use client';

import React, { useState, useEffect } from 'react';
import Dialer from './Dialer';
import { getContacts } from '@/lib/actions/crm';
import ContactProfile from '@/components/crm/ContactProfile';
import { Search } from 'lucide-react';

// Mock call types
const CALL_TYPES = ['INBOUND', 'OUTBOUND', 'MISSED'];
const TIMESTAMPS = ['Just now', '5m ago', '1h ago', 'Yesterday', 'Fri', 'Thu'];

export default function CallsView() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContact, setSelectedContact] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContacts() {
            setLoading(true);
            try {
                const data = await getContacts(searchQuery);
                // Augment with mock call data
                const augmented = data.map((c: any) => ({
                    ...c,
                    callType: CALL_TYPES[Math.floor(Math.random() * CALL_TYPES.length)],
                    callTime: TIMESTAMPS[Math.floor(Math.random() * TIMESTAMPS.length)],
                    avatarColor: '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color
                }));
                setContacts(augmented);
            } catch (error) {
                console.error("Failed to fetch contacts", error);
            } finally {
                setLoading(false);
            }
        }

        // Debounce search
        const timer = setTimeout(() => {
            fetchContacts();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
            {/* Middle List Pane */}
            <div style={{
                width: '320px',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.01)'
            }}>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search size={16} className="text-text-tertiary" />
                        </div>
                        <input
                            type="text"
                            className="input pl-10 w-full"
                            placeholder="Search calls..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

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

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {loading ? (
                        <div className="p-4 text-center text-text-tertiary">Loading...</div>
                    ) : contacts.length === 0 ? (
                        <div className="p-4 text-center text-text-tertiary">No calls found</div>
                    ) : (
                        contacts.map(contact => (
                            <div
                                key={contact.id}
                                className="glass-hover"
                                onClick={() => setSelectedContact(contact)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.75rem 1.5rem',
                                    cursor: 'pointer',
                                    gap: '1rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.03)'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: contact.avatarColor || 'var(--primary-soft)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    flexShrink: 0
                                }}>
                                    {(contact.firstName?.[0] || '') + (contact.lastName?.[0] || '')}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <span style={{ fontWeight: '500', fontSize: '0.95rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {contact.firstName} {contact.lastName}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{contact.callTime}</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', gap: '4px' }}>
                                        <span className={contact.callType === 'MISSED' ? 'text-error' : ''}>{contact.callType}</span>
                                        <span>•</span>
                                        <span>{contact.phone || 'No number'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Panel: Dialpad */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ opacity: 0.5 }}>Select a contact to view details</div>
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

            {/* Contact Profile Slide-over */}
            {selectedContact && (
                <ContactProfile contact={selectedContact} onClose={() => setSelectedContact(null)} />
            )}
        </div>
    );
}
