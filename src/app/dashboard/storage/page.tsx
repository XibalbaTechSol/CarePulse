'use client';

import React from 'react';
import FileExplorer from '@/components/storage/FileExplorer';

export default function StoragePage() {
    return (
        <div className="fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>File Storage</h1>
                <p style={{ color: 'var(--text-muted)' }}>Securely store and share company documents.</p>
            </div>
            <FileExplorer />
        </div>
    );
}
