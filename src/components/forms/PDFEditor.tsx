'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, Download, Loader2, User, FileText, CheckCircle } from 'lucide-react';
import { fillPDFTemplate } from '@/lib/actions/pdf';
import { draftFaxFromDocument } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface PDFEditorProps {
    templateName: string;
    contacts: { id: string; firstName: string; lastName: string }[];
    onClose: () => void;
}

export default function PDFEditor({ templateName, contacts, onClose }: PDFEditorProps) {
    const [selectedContact, setSelectedContact] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [faxing, setFaxing] = useState(false);
    const router = useRouter();

    // Initial load - clean state
    useEffect(() => {
        setGeneratedUrl(''); 
    }, [templateName]);

    const handleAutofill = async () => {
        if (!selectedContact) return;
        setLoading(true);
        try {
            const result = await fillPDFTemplate(templateName, selectedContact);
            if (result.success) {
                setGeneratedUrl(result.filePath);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate PDF');
        } finally {
            setLoading(false);
        }
    };

    const handleFaxExport = async () => {
        if (!generatedUrl || !selectedContact) return;
        setFaxing(true);
        try {
            const res = await draftFaxFromDocument(generatedUrl, selectedContact);
            if (res.success) {
                router.push('/dashboard/fax');
            }
        } catch (e) {
            alert('Failed to export to fax');
        } finally {
            setFaxing(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
            zIndex: 3000, display: 'flex', flexDirection: 'column'
        }}>
            {/* Header */}
            <div className="glass" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FileText className="text-primary" />
                    <div>
                        <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{templateName}</h2>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PDF Editor & Filler</span>
                    </div>
                </div>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
            </div>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', overflow: 'hidden' }}>
                {/* Sidebar Controls */}
                <div className="glass" style={{ padding: '2rem', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    <div>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Context Data</h3>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <User size={16} /> Select Client
                            </label>
                            <select
                                value={selectedContact}
                                onChange={(e) => setSelectedContact(e.target.value)}
                                style={{ width: '100%', background: 'black', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '6px', color: 'white' }}
                            >
                                <option value="">-- Choose Client --</option>
                                {contacts.map(c => (
                                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleAutofill}
                        disabled={loading || !selectedContact}
                        className="btn-primary"
                        style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: !selectedContact ? 0.5 : 1 }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                        Apply Client Data
                    </button>

                    <div style={{ height: '1px', background: 'var(--glass-border)' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</h3>
                        
                        <button
                            onClick={handleFaxExport}
                            disabled={!generatedUrl || faxing}
                            className="glass glass-hover"
                            style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: !generatedUrl ? 'not-allowed' : 'pointer', opacity: !generatedUrl ? 0.5 : 1 }}
                        >
                            <Send size={18} className="text-accent" />
                            Send to Fax
                        </button>

                        <a 
                            href={generatedUrl || '#'} 
                            download={generatedUrl ? undefined : undefined} // Only download if url exists
                            className="glass glass-hover"
                            style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--glass-border)', borderRadius: '8px', textDecoration: 'none', color: 'white', cursor: !generatedUrl ? 'not-allowed' : 'pointer', opacity: !generatedUrl ? 0.5 : 1 }}
                            onClick={(e) => !generatedUrl && e.preventDefault()}
                        >
                            <Download size={18} className="text-success" />
                            Download PDF
                        </a>
                    </div>

                    <div style={{ marginTop: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Auto-generated files are stored in the Documents module.
                    </div>
                </div>

                {/* Preview Area */}
                <div style={{ background: '#333', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {loading && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Loader2 className="animate-spin" size={48} style={{ marginBottom: '1rem' }} />
                            <div>Generating PDF with Client Data...</div>
                        </div>
                    )}
                    
                    {generatedUrl ? (
                        <iframe 
                            src={`${generatedUrl}#toolbar=0&navpanes=0`} 
                            style={{ width: '100%', height: '100%', border: 'none' }} 
                            title="Preview"
                        />
                    ) : (
                        <div style={{ textAlign: 'center', opacity: 0.5 }}>
                            <FileText size={64} style={{ marginBottom: '1rem' }} />
                            <p>Select a client and click "Apply Data" to preview.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
