'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Grid, List, Search } from 'lucide-react';
import { getPDFTemplates } from '@/lib/actions/pdf';
import PDFEditor from './PDFEditor';

interface TemplateGalleryProps {
    contacts: { id: string; firstName: string; lastName: string }[];
}

export default function TemplateGallery({ contacts }: TemplateGalleryProps) {
    const [templates, setTemplates] = useState<string[]>([]);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [search, setSearch] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    useEffect(() => {
        getPDFTemplates().then(data => {
            console.log('Templates found:', data);
            setTemplates(data);
        });
    }, []);

    const filteredTemplates = templates.filter(t => t.toLowerCase().includes(search.toLowerCase()));

    if (selectedTemplate) {
        return (
            <PDFEditor 
                templateName={selectedTemplate} 
                contacts={contacts} 
                onClose={() => setSelectedTemplate(null)} 
            />
        );
    }

    return (
        <div className="glass" style={{ padding: '1.5rem', minHeight: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Template Gallery</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', gap: '0.5rem' }}>
                        <Search size={16} />
                        <input 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder="Search templates..." 
                            style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
                        />
                    </div>
                    <div className="glass" style={{ display: 'flex', gap: '0.25rem', padding: '0.25rem' }}>
                        <button onClick={() => setView('grid')} style={{ padding: '0.25rem', background: view === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '4px', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <Grid size={16} />
                        </button>
                        <button onClick={() => setView('list')} style={{ padding: '0.25rem', background: view === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '4px', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {filteredTemplates.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                    <p>No PDF templates found in public/templates.</p>
                </div>
            ) : view === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {filteredTemplates.map(t => (
                        <div 
                            key={t} 
                            onClick={() => setSelectedTemplate(t)}
                            className="glass glass-hover" 
                            style={{ cursor: 'pointer', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}
                        >
                            <FileText size={48} className="text-primary" style={{ opacity: 0.8 }} />
                            <div style={{ fontSize: '0.9rem', fontWeight: '500', wordBreak: 'break-word' }}>{t}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {filteredTemplates.map(t => (
                        <div 
                            key={t} 
                            onClick={() => setSelectedTemplate(t)}
                            className="glass glass-hover"
                            style={{ cursor: 'pointer', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
                        >
                            <FileText size={20} className="text-primary" />
                            <span>{t}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}