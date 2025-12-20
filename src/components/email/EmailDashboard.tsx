'use client';

import React, { useState, useEffect } from 'react';
import { getRealEmailsAction } from '@/lib/actions/email';

interface Email {
    id: string;
    sender: string;
    email: string;
    subject: string;
    date: string;
    preview: string;
    isStarred: boolean;
    isUnread: boolean;
}

export default function EmailDashboard() {
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [activeFolder, setActiveFolder] = useState('Inbox');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEmails() {
            setLoading(true);
            const result = await getRealEmailsAction('user_demo'); // In real app, get from auth
            if (result.error) {
                setError(result.error);
            } else if (result.data) {
                setEmails(result.data);
                if (result.data.length > 0) setSelectedEmail(result.data[0]);
            }
            setLoading(false);
        }
        fetchEmails();
    }, []);

    if (loading) return (
        <div style={{ height: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Fetching real emails via IMAP...
        </div>
    );

    if (error) {
        return (
            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '200px 350px 1fr', height: 'calc(100vh - 200px)', gap: '1px', background: 'var(--glass-border)', borderRadius: '12px', overflow: 'hidden' }}>
                <div className="glass" style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 0 }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Error state</div>
                </div>
                <div className="glass" style={{ background: 'rgba(0,0,0,0.1)', borderRadius: 0, padding: '2rem' }} data-testid="email-list">
                    <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>
                    <button className="btn-primary" onClick={() => window.location.reload()}>Retry</button>
                </div>
                <div className="glass" style={{ background: 'rgba(0,0,0,0.05)', borderRadius: 0, padding: '2rem' }} data-testid="email-message-view">
                    <div style={{ color: 'var(--text-muted)' }}>Configure your account in settings to view emails.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '200px 350px 1fr', height: 'calc(100vh - 200px)', gap: '1px', background: 'var(--glass-border)', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Folders Sidebar */}
            <div className="glass" style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 0 }}>
                <button className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>Compose</button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {['Inbox', 'Sent', 'Drafts', 'Trash'].map(folder => (
                        <button
                            key={folder}
                            onClick={() => setActiveFolder(folder)}
                            style={{
                                textAlign: 'left',
                                padding: '0.5rem 0.75rem',
                                background: activeFolder === folder ? 'rgba(255,255,255,0.05)' : 'transparent',
                                border: 'none',
                                color: activeFolder === folder ? 'var(--primary)' : 'var(--text-muted)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            {folder}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inbox List */}
            <div className="glass" style={{ background: 'rgba(0,0,0,0.1)', borderRadius: 0, overflowY: 'auto' }} data-testid="email-list">
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', fontSize: '0.85rem', fontWeight: 'bold' }}>{activeFolder}</div>
                {emails.map((email: Email) => (
                    <div
                        key={email.id}
                        data-testid={`email-item-${email.id}`}
                        onClick={() => setSelectedEmail(email)}
                        className="glass-hover"
                        style={{
                            padding: '1rem',
                            borderBottom: '1px solid var(--glass-border)',
                            cursor: 'pointer',
                            background: selectedEmail?.id === email.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                            borderLeft: !email.isUnread ? 'none' : '3px solid var(--primary)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: !email.isUnread ? 'normal' : 'bold' }}>{email.sender}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: !email.isUnread ? 'normal' : 'bold', marginBottom: '0.25rem' }}>{email.subject}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email.preview}</div>
                    </div>
                ))}
            </div>

            {/* Message View */}
            <div className="glass" style={{ background: 'rgba(0,0,0,0.05)', borderRadius: 0, padding: '2rem' }} data-testid="email-message-view">
                {selectedEmail ? (
                    <div className="fade-in">
                        <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{selectedEmail.subject}</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{selectedEmail.sender[0]}</div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{selectedEmail.sender}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>to: {selectedEmail.email}</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(selectedEmail.date).toLocaleString()}</div>
                            </div>
                        </div>
                        <div style={{ lineHeight: '1.6', color: 'var(--text-main)', fontSize: '0.95rem', minHeight: '200px' }}>
                            {selectedEmail.preview || "No content preview available. Please open the full message."}
                        </div>

                        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                            <textarea
                                className="glass"
                                style={{ width: '100%', padding: '1rem', minHeight: '100px', marginBottom: '1rem' }}
                                placeholder="Type your reply..."
                            />
                            <button className="btn-primary">Send Reply</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Select an email to read</div>
                )}
            </div>
        </div>
    );
}
