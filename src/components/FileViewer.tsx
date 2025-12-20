'use client';

import React from 'react';
import { X } from 'lucide-react';

interface FileViewerProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string | null;
    fileName?: string;
    fileType?: string; // 'application/pdf' or 'image/...'
}

export default function FileViewer({ isOpen, onClose, fileUrl, fileName, fileType }: FileViewerProps) {
    if (!isOpen || !fileUrl) return null;

    const isPdf = fileType?.includes('pdf') || fileName?.toLowerCase().endsWith('.pdf') || fileUrl.includes('application/pdf');

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div className="glass" style={{
                width: '90%',
                height: '90%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                padding: '1rem',
                borderRadius: '12px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--glass-border)',
                    paddingBottom: '0.5rem'
                }}>
                    <h3 style={{ margin: 0 }}>{fileName || 'Document Viewer'}</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-main)',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={{ flex: 1, background: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
                    {isPdf ? (
                        <iframe
                            src={fileUrl}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            title="PDF Viewer"
                        />
                    ) : (
                        <img
                            src={fileUrl}
                            alt={fileName || 'Document'}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
