'use client';

import React, { useState } from 'react';
import {
    Folder,
    FileText,
    Image as ImageIcon,
    MoreVertical,
    Plus,
    Search,
    Star,
    Clock,
    Trash2,
    HardDrive,
    Users,
    LayoutGrid,
    List,
    ChevronRight
} from 'lucide-react';

const MOCK_FILES = [
    { id: '1', name: 'Annual Report 2024.pdf', type: 'PDF', size: '2.4 MB', updated: '2 hours ago', starred: true },
    { id: '2', name: 'Product Designs', type: 'FOLDER', size: '-', updated: 'Yesterday', starred: false },
    { id: '3', name: 'Q4 Revenue.xlsx', type: 'EXCEL', size: '450 KB', updated: 'Dec 15', starred: false },
    { id: '4', name: 'Main Hero Image.png', type: 'IMG', size: '5.6 MB', updated: 'Dec 12', starred: true },
    { id: '5', name: 'Customer List', type: 'FOLDER', size: '-', updated: 'Nov 20', starred: false },
];

export default function FileExplorer() {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [currentFolder, setCurrentFolder] = useState<string[]>(['My Drive']);

    const getIcon = (type: string) => {
        switch (type) {
            case 'FOLDER': return <Folder className="text-blue-400" fill="currentColor" size={24} />;
            case 'PDF': return <FileText className="text-red-400" size={24} />;
            case 'IMG': return <ImageIcon className="text-purple-400" size={24} />;
            default: return <FileText className="text-gray-400" size={24} />;
        }
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: '1rem' }}>
            {/* Sidebar */}
            <div className="glass" style={{ width: '240px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button className="btn-primary" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px' }}>
                    <Plus size={20} /> New
                </button>

                {[
                    { icon: HardDrive, label: 'My Drive', active: true },
                    { icon: Clock, label: 'Recent', active: false },
                    { icon: Star, label: 'Starred', active: false },
                    { icon: Trash2, label: 'Trash', active: false },
                ].map(item => (
                    <div key={item.label} className="glass-hover" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        background: item.active ? 'rgba(255,255,255,0.05)' : 'transparent',
                        color: item.active ? 'var(--primary)' : 'var(--text-muted)',
                        cursor: 'pointer'
                    }}>
                        <item.icon size={18} />
                        <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                    </div>
                ))}

                <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Storage</div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '0.5rem' }}>
                        <div style={{ width: '45%', height: '100%', background: 'var(--primary)', borderRadius: '2px' }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>4.5 GB of 10 GB used</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                        {currentFolder.map((folder, i) => (
                            <React.Fragment key={folder}>
                                {i > 0 && <ChevronRight size={16} className="text-muted" />}
                                <span style={{ cursor: 'pointer', fontWeight: i === currentFolder.length - 1 ? '600' : '400' }}>{folder}</span>
                            </React.Fragment>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
                        <button
                            onClick={() => setView('grid')}
                            style={{ background: view === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', padding: '4px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            style={{ background: view === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', padding: '4px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="glass" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
                    <Search size={18} className="text-muted" />
                    <input type="text" placeholder="Search in Drive" style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none' }} />
                </div>

                {/* Explorer */}
                {view === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', overflowY: 'auto' }}>
                        {MOCK_FILES.map(item => (
                            <div key={item.id} className="glass glass-hover" style={{ padding: '1rem', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    {getIcon(item.type)}
                                    <MoreVertical size={16} className="text-muted" />
                                </div>
                                <div style={{ fontWeight: '500', fontSize: '0.9rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.updated}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ padding: '0.75rem' }}>Name</th>
                                    <th style={{ padding: '0.75rem' }}>Owner</th>
                                    <th style={{ padding: '0.75rem' }}>Last modified</th>
                                    <th style={{ padding: '0.75rem' }}>File size</th>
                                    <th style={{ padding: '0.75rem' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_FILES.map(item => (
                                    <tr key={item.id} className="glass-hover" style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                                        <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            {getIcon(item.type)}
                                            {item.name}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>Me</td>
                                        <td style={{ padding: '0.75rem' }}>{item.updated}</td>
                                        <td style={{ padding: '0.75rem' }}>{item.size}</td>
                                        <td style={{ padding: '0.75rem' }}><MoreVertical size={16} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
