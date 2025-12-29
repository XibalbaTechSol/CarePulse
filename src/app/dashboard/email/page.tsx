'use client';

import React, { useState } from 'react';
import EmailDashboard from '@/components/email/EmailDashboard';
import EmailConfigForm from '@/components/email/EmailConfigForm';
import AddContactModal from '@/components/crm/AddContactModal';
import { Settings, LayoutDashboard, UserPlus } from 'lucide-react';

export default function EmailPage() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');
    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const userId = 'user_demo'; // Mock user ID
    return (
        <div className="fade-in">
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Email Business Suite</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Professional communication for your entire organization.</p>
                </div>

                <div className="flex gap-4 items-start">
                    <button
                        onClick={() => setIsAddContactOpen(true)}
                        className="glass"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                            background: 'var(--primary)', color: 'white', fontWeight: 'bold'
                        }}
                    >
                        <UserPlus size={18} /> Add Contact
                    </button>
                    <div className="glass" style={{ display: 'flex', padding: '4px', gap: '4px' }}>
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                background: activeTab === 'dashboard' ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                color: activeTab === 'dashboard' ? 'var(--primary)' : 'var(--text-muted)',
                                transition: 'all 0.2s ease', fontWeight: activeTab === 'dashboard' ? '600' : '400'
                            }}
                        >
                            <LayoutDashboard size={16} /> Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                background: activeTab === 'settings' ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)',
                                transition: 'all 0.2s ease', fontWeight: activeTab === 'settings' ? '600' : '400'
                            }}
                        >
                            <Settings size={16} /> Configuration
                        </button>
                    </div>
                </div>
            </div>

            {activeTab === 'dashboard' ? (
                <EmailDashboard />
            ) : (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <EmailConfigForm userId={userId} />
                </div>
            )}

            <AddContactModal
                isOpen={isAddContactOpen}
                onClose={() => setIsAddContactOpen(false)}
            />
        </div>
    );
}
