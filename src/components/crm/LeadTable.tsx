'use client';

import React, { useEffect, useState } from 'react';
import { getContacts } from '@/lib/actions';
import { exportLeadsAction } from '@/lib/actions/crm';
import { useSip } from '@/lib/contexts/SipContext';

export default function LeadTable() {
    const { makeCall } = useSip();
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        async function loadContacts() {
            try {
                const data = await getContacts();
                setContacts(data);
            } catch (error) {
                console.error('Failed to load contacts:', error);
            } finally {
                setLoading(false);
            }
        }
        loadContacts();
    }, []);

    const handleExport = async () => {
        setExporting(true);
        try {
            const result = await exportLeadsAction();
            if (result.error) {
                alert(result.error);
                return;
            }
            if (result.data) {
                const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export leads');
        } finally {
            setExporting(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading contacts...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="btn-primary"
                    style={{
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        opacity: exporting ? 0.7 : 1,
                        cursor: exporting ? 'not-allowed' : 'pointer'
                    }}
                >
                    {exporting ? 'Exporting...' : 'Export CSV'}
                </button>
            </div>
            <div className="glass" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Name</th>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Company</th>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</th>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</th>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Deals</th>
                            <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(contact => (
                            <tr key={contact.id} className="glass-hover" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {contact.firstName} {contact.lastName}
                                        <button
                                            onClick={() => makeCall(contact.phone || '')}
                                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.6, fontSize: '1rem' }}
                                            title="Click to Call"
                                        >
                                            📞
                                        </button>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{contact.company || 'N/A'}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{contact.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        background: contact.status === 'HOT' ? 'rgba(239, 68, 68, 0.1)' : contact.status === 'LEAD' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                        color: contact.status === 'HOT' ? 'var(--error)' : contact.status === 'LEAD' ? 'var(--warning)' : 'var(--success)',
                                        border: `1px solid ${contact.status === 'HOT' ? 'var(--error)' : contact.status === 'LEAD' ? 'var(--warning)' : 'var(--success)'}33`
                                    }}>
                                        {contact.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: '600' }}>{contact.deals?.length || 0}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem' }}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
