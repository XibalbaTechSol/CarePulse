'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ChatInterface = dynamic(() => import('@/components/ai/ChatInterface'), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center text-white/50">Initializing AI...</div>
});

export default function AIDashboard() {
    return (
        <div className="fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>AI Assistant</h1>
                <p style={{ color: 'var(--text-muted)' }}>Your intelligent companion for business insights and automation.</p>
            </div>

            <ChatInterface />
        </div>
    );
}
