'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Download, X } from 'lucide-react';
import { getPDFTemplates, fillPDFTemplate } from '@/lib/actions/pdf';
import { useRouter } from 'next/navigation';

export default function PDFFillerDialog({ contacts }: { contacts: { id: string; firstName: string; lastName: string }[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [templates, setTemplates] = useState<string[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [selectedContact, setSelectedContact] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState('');
    const router = useRouter();

    useEffect(() => {
        getPDFTemplates().then(setTemplates);
    }, []);

    const handleFill = async () => {
        if (!selectedTemplate || !selectedContact) return;
        setLoading(true);
        try {
            const result = await fillPDFTemplate(selectedTemplate, selectedContact);
            if (result.success) {
                setGeneratedUrl(result.filePath);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate PDF');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} /> Fill PDF Form
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '2rem'
        }}>
            <div className="glass" style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Fill PDF Form</h2>
                    <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select Template</label>
                        <select
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '8px', color: '#fff' }}
                        >
                            <option value="">Select a form...</option>
                            {templates.map(t => (
                                <option key={t} value={t} style={{ color: 'black' }}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select Client</label>
                        <select
                            value={selectedContact}
                            onChange={(e) => setSelectedContact(e.target.value)}
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '8px', color: '#fff' }}
                        >
                            <option value="">Select a client...</option>
                            {contacts.map(c => (
                                <option key={c.id} value={c.id} style={{ color: 'black' }}>{c.firstName} {c.lastName}</option>
                            ))}
                        </select>
                    </div>

                    {generatedUrl && (
                        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>PDF Generated!</span>
                            <a href={generatedUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none' }}>
                                <Download size={16} /> Download
                            </a>
                        </div>
                    )}

                    <button
                        onClick={handleFill}
                        disabled={loading || !selectedTemplate || !selectedContact}
                        className="btn-primary"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        Generate & Save to Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
