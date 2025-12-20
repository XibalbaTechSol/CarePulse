'use client';

import React from 'react';
import FaxComposer from '@/components/fax/FaxComposer';
import FaxInbox from '@/components/fax/FaxInbox';

export default function FaxDashboard() {
    return (
        <div className="fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Digital Fax</h1>
                <p style={{ color: 'var(--text-muted)' }}>Securely send and receive faxes through the SRFax and Nextiva compatible network.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
                <div>
                    <FaxComposer />
                </div>
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div className="glass" style={{ padding: '1.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Remaining Pages</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Unlimited</div>
                        </div>
                        <div className="glass" style={{ padding: '1.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fax Number</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)' }}>+1 (555) 123-NEXT</div>
                        </div>
                    </div>
                    <FaxInbox />
                </div>
            </div>
        </div>
    );
}
