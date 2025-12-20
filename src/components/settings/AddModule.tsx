'use client';

import React, { useState } from 'react';
import { Upload, Github, FolderPlus } from 'lucide-react';

export default function AddModule() {
    const [isOpen, setIsOpen] = useState(false);
    const [method, setMethod] = useState<'zip' | 'github' | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInstall = async () => {
        if (!inputValue) return;
        setLoading(true);
        // Simulate installation
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert(`Successfully installed module from ${method === 'zip' ? 'Zip' : 'GitHub'}!`);
        setLoading(false);
        setIsOpen(false);
        setMethod(null);
        setInputValue('');
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <FolderPlus size={18} /> Add Module
            </button>
        );
    }

    return (
        <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--accent)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Install New Module</h3>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setMethod('zip')}
                    className="glass-hover"
                    style={{
                        padding: '1rem', flex: 1, border: method === 'zip' ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                        background: method === 'zip' ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                        borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <Upload size={24} />
                    <span>Upload Zip</span>
                </button>
                <button
                    onClick={() => setMethod('github')}
                    className="glass-hover"
                    style={{
                        padding: '1rem', flex: 1, border: method === 'github' ? '1px solid var(--accent)' : '1px solid var(--glass-border)',
                        background: method === 'github' ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                        borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                    }}
                >
                    <Github size={24} />
                    <span>From GitHub</span>
                </button>
            </div>

            {method && (
                <div className="fade-in">
                    <div style={{ marginBottom: '1rem' }}>
                        {method === 'zip' ? (
                            <input
                                type="file"
                                accept=".zip"
                                onChange={(e) => setInputValue(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem' }}
                            />
                        ) : (
                            <input
                                type="text"
                                placeholder="https://github.com/username/repo"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="input-glass"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                            />
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ padding: '0.5rem 1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInstall}
                            className="btn-primary"
                            disabled={loading || !inputValue}
                        >
                            {loading ? 'Installing...' : 'Install Module'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
