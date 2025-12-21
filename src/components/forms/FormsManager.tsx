'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import FileBrowser from './FileBrowser';

const PDFFormEditor = dynamic(() => import('./PDFFormEditor'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-white/50">Loading Editor...</div>
});

interface FormsManagerProps {
    templates: string[];
    contacts: { id: string; firstName: string; lastName: string }[];
}

export default function FormsManager({ templates, contacts }: FormsManagerProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
            {!selectedTemplate ? (
                <FileBrowser 
                    templates={templates}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onSelect={setSelectedTemplate}
                />
            ) : (
                <PDFFormEditor 
                    templateName={selectedTemplate}
                    contacts={contacts}
                    onClose={() => setSelectedTemplate(null)}
                />
            )}
        </div>
    );
}
