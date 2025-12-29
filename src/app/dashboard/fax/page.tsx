'use client';

import React, { useState } from 'react';
import FaxComposer from '@/components/fax/FaxComposer';
import FaxInbox from '@/components/fax/FaxInbox';
import AddContactModal from '@/components/crm/AddContactModal';
import { FileText, Send, Clock, Settings, RefreshCw, Plus, Users, UserPlus } from 'lucide-react';

export default function FaxDashboard() {
    const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'queued'>('inbox');
    const [selectedFaxId, setSelectedFaxId] = useState<string | null>(null);
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const { syncFaxStatus } = await import('@/lib/actions');
            await syncFaxStatus();
        } catch (e) {
            console.error("Sync failed", e);
        }
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const tabs = [
        { id: 'inbox', label: 'Inbox', icon: <FileText size={16} /> },
        { id: 'sent', label: 'Sent', icon: <Send size={16} /> },
        { id: 'queued', label: 'Queued', icon: <Clock size={16} /> },
    ];

    return (
        <div className="fade-in" style={{
            display: 'flex',
            height: 'calc(100vh - 120px)',
            margin: '-1rem',
            overflow: 'hidden'
        }}>
            {/* Left Pane: Inbox List */}
            <div style={{
                width: '350px',
                borderRight: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255,255,255,0.01)'
            }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Digital Fax</h1>
                    <button
                        onClick={() => setIsComposerOpen(true)}
                        className="btn-primary"
                        style={{ padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="New Fax"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', padding: '0.5rem', gap: '0.25rem', borderBottom: '1px solid var(--glass-border)' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as 'inbox' | 'sent' | 'queued');
                                setIsComposerOpen(false);
                            }}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                padding: '8px',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                background: activeTab === tab.id && !isComposerOpen ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                color: activeTab === tab.id && !isComposerOpen ? 'var(--primary)' : 'var(--text-muted)',
                                fontSize: '0.8rem',
                                fontWeight: activeTab === tab.id && !isComposerOpen ? '600' : '400',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <FaxInbox
                        filter={activeTab}
                        selectedId={selectedFaxId}
                        onSelect={(id) => {
                            setSelectedFaxId(id);
                            setIsComposerOpen(false);
                        }}
                    />
                </div>
            </div>

            {/* Middle Pane: Composer or Details */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--glass-background)' }}>
                {isComposerOpen ? (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Compose New Fax</h2>
                                <button onClick={() => setIsComposerOpen(false)} className="glass-hover" style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>Close</button>
                            </div>
                            <FaxComposer onCancel={() => setIsComposerOpen(false)} />
                        </div>
                    </div>
                ) : selectedFaxId ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <FileText size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                        <p>Fax details for {selectedFaxId} would be here.</p>
                        {/* More detailed component would go here */}
                    </div>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <FileText size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                        <p>Select a fax to view details or start a new composition.</p>
                    </div>
                )}
            </div>

            {/* Right Pane: Quick Actions & Status */}
            <div style={{ width: '300px', borderLeft: '1px solid var(--glass-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', background: 'rgba(255,255,255,0.01)', position: 'relative', zIndex: 10 }}>
                <div>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Status</h3>
                    <div className="glass" style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.05)', border: '1px solid rgba(var(--primary-rgb), 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fax Number</div>
                            <button onClick={handleRefresh} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--primary)' }} disabled={isRefreshing}>
                                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                            </button>
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '1rem' }}>+1 (555) 123-NEXT</div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginBottom: '0.5rem' }}>
                            <div style={{ width: '35%', height: '100%', background: 'var(--primary)', borderRadius: '2px' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Usage this month</span>
                            <span style={{ color: 'var(--text-main)' }}>350 / ∞ pages</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button onClick={() => setIsAddContactOpen(true)} className="glass-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', textAlign: 'left', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <UserPlus size={16} /> Add New Contact
                        </button>
                        <button className="glass-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', textAlign: 'left', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <Users size={16} /> Address Book
                        </button>
                        <button className="glass-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', textAlign: 'left', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <FileText size={16} /> Cover Sheet Templates
                        </button>
                        <button className="glass-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', textAlign: 'left', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <Settings size={16} /> Fax Settings
                        </button>
                    </div>
                </div>
            </div>
            <AddContactModal
                isOpen={isAddContactOpen}
                onClose={() => setIsAddContactOpen(false)}
            />
        </div>
    );
}
