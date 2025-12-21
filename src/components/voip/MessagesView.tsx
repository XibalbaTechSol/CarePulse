'use client';

import React, { useState } from 'react';
import { Send, Image, Smile, MoreVertical, Phone, Video } from 'lucide-react';

export default function MessagesView() {
    const [activeConversation, setActiveConversation] = useState<number | null>(1);
    const [messageInput, setMessageInput] = useState('');

    const conversations = [
        { id: 1, name: 'Alyssa G', number: '+1 (262) 412-3861', time: '10:42 AM', preview: 'See you then!', avatar: 'A', color: '#795548', unread: 0 },
        { id: 2, name: 'LilMike', number: '+1 (612) 562-7746', time: 'Yesterday', preview: 'Shit got that gas money', avatar: 'L', color: '#3f51b5', unread: 1 },
        { id: 3, name: 'Unknown', number: '(555) 123-4567', time: 'Tue', preview: 'Who is this?', avatar: '#', color: '#607d8b', unread: 0 },
    ];

    const messages = [
        { id: 1, sender: 'them', text: 'Hey, are we still on for today?', time: '10:30 AM' },
        { id: 2, sender: 'me', text: 'Yeah, definitely. 2pm right?', time: '10:32 AM' },
        { id: 3, sender: 'them', text: 'Perfect. See you then!', time: '10:42 AM' },
    ];

    return (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* List Pane */}
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
                        <span style={{ fontSize: '1.5rem', lineHeight: '0' }}>+</span> New message
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => setActiveConversation(conv.id)}
                            className="glass-hover"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.75rem 1.5rem',
                                cursor: 'pointer',
                                gap: '1rem',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                                background: activeConversation === conv.id ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent',
                                borderLeft: activeConversation === conv.id ? '3px solid var(--primary)' : '3px solid transparent'
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: conv.color,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                flexShrink: 0,
                                position: 'relative'
                            }}>
                                {conv.avatar}
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
                                        color: conv.unread > 0 ? 'var(--text-main)' : 'var(--text-main)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {conv.name}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: conv.unread > 0 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: conv.unread > 0 ? '600' : '400' }}>{conv.time}</span>
                                </div>
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: conv.unread > 0 ? 'var(--text-main)' : 'var(--text-muted)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: conv.unread > 0 ? '600' : '400'
                                }}>
                                    {conv.preview}
                                </div>
                            </div>
                        </div>
                    ))}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-main)' }}>Alyssa G</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>+1 (262) 412-3861</div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="glass-hover" style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><Phone size={20} /></button>
                            <button className="glass-hover" style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><Video size={20} /></button>
                            <button className="glass-hover" style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreVertical size={20} /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map(msg => (
                            <div key={msg.id} style={{
                                alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                                maxWidth: '70%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    padding: '0.8rem 1.2rem',
                                    borderRadius: '18px',
                                    background: msg.sender === 'me' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                    color: msg.sender === 'me' ? 'white' : 'var(--text-main)',
                                    fontSize: '0.95rem',
                                    borderBottomRightRadius: msg.sender === 'me' ? '4px' : '18px',
                                    borderBottomLeftRadius: msg.sender === 'me' ? '18px' : '4px'
                                }}>
                                    {msg.text}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', padding: '0 0.5rem' }}>{msg.time}</span>
                            </div>
                        ))}
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
        </div>
    );
}
