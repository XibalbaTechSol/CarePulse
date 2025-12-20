'use client';

import React, { useState } from 'react';
import EmailDashboard from '@/components/email/EmailDashboard';
import EmailConfigForm from '@/components/email/EmailConfigForm';
import { Settings, LayoutDashboard } from 'lucide-react';

export default function EmailPage() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');
    const userId = 'user_demo'; // Mock user ID
    return (
        <div className="fade-in">
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Email Business Suite</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Professional communication for your entire organization.</p>
                </div>

                <div className="glass" style={{ display: 'flex', padding: '4px', gap: '4px' }}>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'dashboard' ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <LayoutDashboard size={16} /> Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: activeTab === 'settings' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'settings' ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Settings size={16} /> Configuration
                    </button>
                </div>
            </div>

            {activeTab === 'dashboard' ? (
                <EmailDashboard />
            ) : (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <EmailConfigForm userId={userId} />
                </div>
            )}
        </div>
    );
}
