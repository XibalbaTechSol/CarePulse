'use client';

import React from 'react';
import ChatInterface from '@/components/ai/ChatInterface';

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
