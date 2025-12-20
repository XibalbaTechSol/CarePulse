'use client';

import React from 'react';

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="btn-primary no-print"
            style={{
                padding: '0.75rem 2rem',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '2rem'
            }}
        >
            Print Audit Packet (PDF)
        </button>
    );
}
