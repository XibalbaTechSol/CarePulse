'use client';

import React, { useState } from 'react';
import { useSip } from '@/lib/contexts/SipContext';
import CallWindow from '@/components/voip/CallWindow';
import SipConfigForm from '@/components/voip/SipConfigForm';
import PhoneSidebar from '@/components/voip/PhoneSidebar';
import CallsView from '@/components/voip/CallsView';
import MessagesView from '@/components/voip/MessagesView';
import VoicemailView from '@/components/voip/VoicemailView';
import { Search } from 'lucide-react';
import AddContactModal from '@/components/crm/AddContactModal';

function SipStatusBadge() {
    const { state } = useSip();

    let statusColor = 'var(--text-muted)';
    let statusText = 'Disconnected';

    switch (state.status) {
        case 'CONNECTED': statusColor = 'var(--success)'; statusText = 'Active'; break;
        case 'REGISTERING': statusColor = 'var(--warning)'; statusText = 'Connecting...'; break;
        case 'ERROR': statusColor = 'var(--error)'; statusText = 'Error'; break;
        case 'DISCONNECTED': statusColor = 'var(--text-muted)'; statusText = 'Inactive'; break;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ color: statusColor, fontSize: '1.2rem', lineHeight: 1 }}>●</span>
            <span>{statusText}</span>
        </div>
    );
}

export default function PhoneDashboard() {
    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('calls');
    const userId = 'user_1';


    const renderActiveView = () => {
        switch (activeTab) {
            case 'calls':
                return <CallsView />;
            case 'messages':
                return <MessagesView />;
            case 'voicemail':
                return <VoicemailView />;
            case 'settings':
                return (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '300', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Settings</h2>
                            <SipConfigForm userId={userId} />
                        </div>
                    </div>
                );
            case 'starred':
                return (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '300', marginBottom: '1rem' }}>Starred</h2>
                        <p>No starred items</p>
                    </div>
                );
            default:
                return <CallsView />;
        }
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 80px)', margin: '-1rem', background: 'var(--bg-main)' }}>
            {/* Left Sidebar (Slim) */}
            <PhoneSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header/Search Bar Area */}
                <div style={{
                    padding: '0.75rem 2rem',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.6rem 1.5rem',
                        borderRadius: '30px',
                        flex: 1,
                        maxWidth: '720px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}>
                        <Search size={20} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Search Google Voice"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-main)',
                                outline: 'none',
                                width: '100%',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <SipStatusBadge />
                        <button className="glass-hover" style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '24px',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}>
                            Upgrade
                        </button>
                    </div>
                </div>

                {renderActiveView()}

            </div>

            <CallWindow />
            <AddContactModal
                isOpen={isAddContactOpen}
                onClose={() => setIsAddContactOpen(false)}
            />
        </div>
    );
}
