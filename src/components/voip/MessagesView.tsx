'use client';

import React, { useState, useEffect } from 'react';
import { Send, Image, Smile, MoreVertical, Phone, Video, Search, SmilePlus, Meh, Frown } from 'lucide-react';
import { getContacts } from '@/lib/actions/crm';
import ContactProfile from '@/components/crm/ContactProfile';

// Mock data helpers
const PREVIEWS = ['Hey, are we still on?', 'Please send the report.', 'Call me when you can.', 'Thanks!', 'See you tomorrow.'];
const TIMESTAMPS = ['10:42 AM', 'Yesterday', 'Tue', 'Mon', 'Last week'];

export default function MessagesView() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeConvId, setActiveConvId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<any | null>(null);

    useEffect(() => {
        async function fetchContacts() {
            setLoading(true);
            try {
                const data = await getContacts(searchQuery);
                // Augment contacts to look like conversations
                const augmented = data.map((c: any) => ({
                    ...c,
                    preview: PREVIEWS[Math.floor(Math.random() * PREVIEWS.length)],
                    time: TIMESTAMPS[Math.floor(Math.random() * TIMESTAMPS.length)],
                    unread: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
                    avatarColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                    sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)]
                }));
                setConversations(augmented);
            } catch (error) {
                console.error("Failed to fetch contacts", error);
            } finally {
                setLoading(false);
            }
        }

        const timer = setTimeout(() => {
            fetchContacts();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const activeConversation = conversations.find(c => c.id === activeConvId);

    return (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
            {/* List Pane */}
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
                            placeholder="Search messages..."
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
                        <span style={{ fontSize: '1.5rem', lineHeight: '0' }}>+</span> New message
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {loading ? (
                        <div className="p-4 text-center text-text-tertiary">Loading...</div>
                    ) : conversations.length === 0 ? (
                        <div className="p-4 text-center text-text-tertiary">No messages found</div>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => setActiveConvId(conv.id)}
                                className="glass-hover"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.75rem 1.5rem',
                                    cursor: 'pointer',
                                    gap: '1rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                                    background: activeConvId === conv.id ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent',
                                    borderLeft: activeConvId === conv.id ? '3px solid var(--primary)' : '3px solid transparent'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: conv.avatarColor,
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    flexShrink: 0,
                                    position: 'relative'
                                }}>
                                    {(conv.firstName?.[0] || '') + (conv.lastName?.[0] || '')}
                                    {conv.unread > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: -2,
                                            right: -2,
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            background: 'var(--primary)',
                                            border: '2px solid var(--bg-main)'
                                        }} />
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <span style={{
                                            fontWeight: conv.unread > 0 ? '700' : '500',
                                            fontSize: '0.95rem',
                                            color: 'var(--text-main)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {conv.firstName} {conv.lastName}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: conv.unread > 0 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: conv.unread > 0 ? '600' : '400' }}>{conv.time}</span>
                                    </div>
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: conv.unread > 0 ? 'var(--text-main)' : 'var(--text-muted)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        fontWeight: conv.unread > 0 ? '600' : '400',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem'
                                    }}>
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: conv.sentiment === 'positive' ? 'var(--success)' : conv.sentiment === 'neutral' ? 'var(--warning)' : 'var(--error)',
                                            flexShrink: 0
                                        }} title={`Sentiment: ${conv.sentiment}`} />
                                        {conv.preview}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {activeConversation ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.005)' }}>
                    {/* Chat Header */}
                    <div style={{
                        padding: '1rem 2rem',
                        borderBottom: '1px solid var(--glass-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                            onClick={() => setSelectedContact(activeConversation)}
                        >
                            <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                {activeConversation.firstName} {activeConversation.lastName}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{activeConversation.phone}</div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                background: activeConversation.sentiment === 'positive' ? 'rgba(var(--success-rgb), 0.1)' : activeConversation.sentiment === 'neutral' ? 'rgba(var(--warning-rgb), 0.1)' : 'rgba(var(--error-rgb), 0.1)',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                color: activeConversation.sentiment === 'positive' ? 'var(--success)' : activeConversation.sentiment === 'neutral' ? 'var(--warning)' : 'var(--error)',
                                textTransform: 'uppercase'
                            }}>
                                {activeConversation.sentiment === 'positive' ? <SmilePlus size={12} /> : activeConversation.sentiment === 'neutral' ? <Meh size={12} /> : <Frown size={12} />}
                                {activeConversation.sentiment}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="glass-hover" style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><Phone size={20} /></button>
                            <button className="glass-hover" style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><Video size={20} /></button>
                            <button className="glass-hover" style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreVertical size={20} /></button>
                        </div>
                    </div>

                    {/* Messages (Mocked for now) */}
                    <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ alignSelf: 'flex-start', maxWidth: '70%', background: 'rgba(255,255,255,0.1)', padding: '0.8rem 1.2rem', borderRadius: '18px', borderBottomLeftRadius: '4px' }}>
                            {activeConversation.preview}
                        </div>
                        <div style={{ alignSelf: 'flex-end', maxWidth: '70%', background: 'var(--primary)', color: 'white', padding: '0.8rem 1.2rem', borderRadius: '18px', borderBottomRightRadius: '4px' }}>
                            Okay, sure.
                        </div>
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--glass-border)' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '0.75rem 1rem',
                            borderRadius: '24px',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Image size={20} /></button>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'var(--text-main)',
                                    fontSize: '1rem'
                                }}
                            />
                            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Smile size={20} /></button>
                            <button style={{
                                background: messageInput ? 'var(--primary)' : 'transparent',
                                border: 'none',
                                color: messageInput ? 'white' : 'var(--text-muted)',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    Select a conversation to start chatting
                </div>
            )}

            {/* Contact Profile Slide-over */}
            {selectedContact && (
                <ContactProfile contact={selectedContact} onClose={() => setSelectedContact(null)} />
            )}
        </div>
    );
}
