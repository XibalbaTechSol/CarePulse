'use client';

import React, { useEffect, useState } from 'react';
import { getFaxes } from '@/lib/actions';
import { FileText, Download, Trash2, Clock, RefreshCw, Eye } from 'lucide-react';
import FileViewer from '../FileViewer';

interface Fax {
    id: string;
    recipient: string;
    direction: string;
    status: string;
    createdAt: Date;
}

export default function FaxInbox() {
    const [faxes, setFaxes] = useState<Fax[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Viewer State
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewFileUrl, setViewFileUrl] = useState<string | null>(null);
    const [viewFileName, setViewFileName] = useState<string | undefined>(undefined);

    const loadFaxes = async () => {
        try {
            const data = await getFaxes();
            setFaxes(data);
        } catch (error) {
            console.error('Failed to load faxes:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadFaxes();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        // Call syncFaxStatus first to update statuses from provider
        // We need to dyn import or pass it as prop if we want to keep this client component clean, 
        // but for now we'll assumes it's available via actions. 
        // Note: We need to import syncFaxStatus from actions
        try {
            const { syncFaxStatus } = await import('@/lib/actions');
            await syncFaxStatus();
        } catch (e) {
            console.error("Sync failed", e);
        }
        await loadFaxes();
    };

    if (loading) return <div className="glass" style={{ padding: '2rem' }}>Loading faxes...</div>;

    return (
        <div className="glass" style={{ padding: '0' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Fax History</h2>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="glass-hover"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        title="Refresh Status"
                    >
                        <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                    </button>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{faxes.length} Total</span>
            </div>

            {faxes.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                    <p>No faxes found in your history.</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date</th>
                                <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Recipient</th>
                                <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</th>
                                <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faxes.map((fax) => (
                                <tr key={fax.id} className="glass-hover" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Clock size={14} className="text-muted" />
                                            {new Date(fax.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{fax.recipient}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            background: fax.status === 'DELIVERED' ? 'rgba(34,197,94,0.1)' :
                                                fax.status === 'FAILED' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)',
                                            color: fax.status === 'DELIVERED' ? 'var(--success)' :
                                                fax.status === 'FAILED' ? 'var(--error)' : 'var(--accent)'
                                        }}>
                                            {fax.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="glass-hover"
                                                style={{ padding: '4px', borderRadius: '4px', border: 'none', background: 'transparent' }}
                                                onClick={() => {
                                                    // Mock viewing logic - in real app, fetch signed URL
                                                    // For demo purposes, we will just open a placeholder PDF or similar
                                                    // In production, we would get this URL from the fax object
                                                    setViewFileUrl('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'); // Mock PDF
                                                    setViewFileName(`Fax-${fax.id}.pdf`);
                                                    setViewerOpen(true);
                                                }}
                                                title="View Fax"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button className="glass-hover" style={{ padding: '4px', borderRadius: '4px', border: 'none', background: 'transparent' }}>
                                                <Download size={16} />
                                            </button>
                                            <button className="glass-hover" style={{ padding: '4px', borderRadius: '4px', border: 'none', background: 'transparent', color: 'var(--error)' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <FileViewer
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                fileUrl={viewFileUrl}
                fileName={viewFileName}
                fileType="application/pdf"
            />
        </div>
    );
}
