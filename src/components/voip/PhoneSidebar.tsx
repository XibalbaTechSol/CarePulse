'use client';

import React from 'react';
import { Phone, MessageSquare, Voicemail, Settings, Star } from 'lucide-react';

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
    return (
        <button
            onClick={onClick}
            title={label}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                border: 'none',
                background: active ? 'rgba(var(--primary-rgb), 0.15)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
                margin: '0 auto',
            }}
            className="sidebar-item-hover"
        >
            <span style={{ display: 'flex', alignItems: 'center' }}>
                {React.cloneElement(icon as React.ReactElement<any>, { size: 24, strokeWidth: active ? 2.5 : 2 })}
            </span>
        </button>
    );
}

interface PhoneSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function PhoneSidebar({ activeTab, setActiveTab }: PhoneSidebarProps) {
    const items = [
        { id: 'calls', label: 'Calls', icon: <Phone /> },
        { id: 'messages', label: 'Messages', icon: <MessageSquare /> },
        { id: 'voicemail', label: 'Voicemail', icon: <Voicemail /> },
        { id: 'starred', label: 'Starred', icon: <Star /> },
    ];

    return (
        <div style={{
            width: '72px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.5rem 0',
            borderRight: '1px solid var(--glass-border)',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.02)',
        }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.3)'
                }}>
                    <Phone size={22} fill="white" />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                {items.map(item => (
                    <SidebarItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        active={activeTab === item.id}
                        onClick={() => setActiveTab(item.id)}
                    />
                ))}
            </div>

            <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <SidebarItem
                    icon={<Settings />}
                    label="Settings"
                    active={activeTab === 'settings'}
                    onClick={() => setActiveTab('settings')}
                />
            </div>
        </div>
    );
}
