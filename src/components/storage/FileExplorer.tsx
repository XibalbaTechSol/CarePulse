'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Folder,
    FileText,
    Image as ImageIcon,
    Plus,
    Search,
    Star,
    Clock,
    Trash2,
    HardDrive,
    LayoutGrid,
    List,
    ChevronRight,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import {
    getDocuments,
    createFolder,
    deleteDocument,
    ensureEntityFolders,
    toggleStar,
    uploadFile
} from '@/lib/actions/storage';
import { format } from 'date-fns';

interface Doc {
    id: string;
    name: string;
    type: string;
    size: number;
    isFolder: boolean;
    isStarred: boolean;
    parentId: string | null;
    updatedAt: string;
}

export default function FileExplorer() {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [docs, setDocs] = useState<Doc[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [currentPath, setCurrentPath] = useState<{ id: string | null, name: string }[]>([{ id: null, name: 'My Drive' }]);
    const [starredOnly, setStarredOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const currentFolder = currentPath[currentPath.length - 1];

    const loadDocs = useCallback(async () => {
        setLoading(true);
        try {
            await ensureEntityFolders(); // Ensure hierarchy on load
            const data = await getDocuments(currentFolder.id, starredOnly);
            setDocs(data);
        } catch (error) {
            console.error('Failed to load documents:', error);
        } finally {
            setLoading(false);
        }
    }, [currentFolder.id, starredOnly]);

    useEffect(() => {
        loadDocs();
    }, [loadDocs]);

    const handleCreateFolder = async () => {
        if (newFolderName.trim()) {
            await createFolder(newFolderName, currentFolder.id);
            setIsCreatingFolder(false);
            setNewFolderName('');
            loadDocs();
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('parentId', String(currentFolder.id));

            await uploadFile(formData);
            loadDocs();
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this?')) {
            await deleteDocument(id);
            loadDocs();
        }
    };

    const handleToggleStar = async (id: string, current: boolean) => {
        await toggleStar(id, !current);
        loadDocs();
    };

    const navigateTo = (id: string | null, name: string) => {
        if (id === null) {
            setCurrentPath([{ id: null, name: 'My Drive' }]);
        } else {
            // Check if already in path to prevent loops (simple version)
            const idx = currentPath.findIndex(p => p.id === id);
            if (idx !== -1) {
                setCurrentPath(currentPath.slice(0, idx + 1));
            } else {
                setCurrentPath([...currentPath, { id, name }]);
            }
        }
    };

    const getIcon = (type: string, isFolder: boolean) => {
        if (isFolder) return <Folder className="text-blue-400" fill="currentColor" size={24} />;
        const upperType = type.toUpperCase();
        if (upperType.includes('PDF')) return <FileText className="text-red-400" size={24} />;
        if (upperType.includes('IMAGE') || upperType.includes('PNG') || upperType.includes('JPG')) return <ImageIcon className="text-purple-400" size={24} />;
        return <FileText className="text-gray-400" size={24} />;
    };

    const filteredDocs = docs.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: '1rem' }}>
            {/* Sidebar */}
            <div className="glass" style={{ width: '240px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    style={{ display: 'none' }}
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="btn-primary"
                    style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px', width: '100%' }}
                >
                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                    {isUploading ? 'Uploading...' : 'Upload File'}
                </button>

                {isCreatingFolder ? (
                    <div className="space-y-2 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <input
                            type="text"
                            className="input w-full text-sm"
                            placeholder="Folder name..."
                            autoFocus
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleCreateFolder} className="btn-primary flex-1 text-xs py-1.5">Create</button>
                            <button onClick={() => setIsCreatingFolder(false)} className="btn-ghost flex-1 text-xs py-1.5 border border-border">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsCreatingFolder(true)}
                        className="glass-hover"
                        style={{
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '10px',
                            width: '100%',
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-primary)',
                            background: 'rgba(255,255,255,0.02)'
                        }}
                    >
                        <Folder size={18} /> New Folder
                    </button>
                )}

                {[
                    { icon: HardDrive, label: 'My Drive', active: !starredOnly, onClick: () => { setStarredOnly(false); setCurrentPath([{ id: null, name: 'My Drive' }]); } },
                    { icon: Star, label: 'Starred', active: starredOnly, onClick: () => setStarredOnly(true) },
                    { icon: Clock, label: 'Recent', active: false, onClick: () => { } },
                    { icon: Trash2, label: 'Trash', active: false, onClick: () => { } },
                ].map(item => (
                    <div key={item.label}
                        onClick={item.onClick}
                        className="glass-hover"
                        style={{
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
                        <div style={{ width: '12%', height: '100%', background: 'var(--primary)', borderRadius: '2px' }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>1.2 GB of 10 GB used</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                        {currentPath.length > 1 && (
                            <button
                                onClick={() => setCurrentPath(currentPath.slice(0, -1))}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                            >
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        {currentPath.map((folder, i) => (
                            <React.Fragment key={folder.id || 'root'}>
                                {i > 0 && <ChevronRight size={16} className="text-muted" />}
                                <span
                                    onClick={() => navigateTo(folder.id, folder.name)}
                                    style={{ cursor: 'pointer', fontWeight: i === currentPath.length - 1 ? '600' : '400' }}
                                >
                                    {folder.name}
                                </span>
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
                    <input
                        type="text"
                        placeholder="Search in Drive"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none' }}
                    />
                </div>

                {/* Explorer */}
                {loading ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : filteredDocs.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <Folder size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No files or folders found</p>
                    </div>
                ) : view === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', overflowY: 'auto', paddingRight: '8px' }}>
                        {filteredDocs.map(item => (
                            <div
                                key={item.id}
                                className="glass glass-hover"
                                style={{ padding: '1rem', position: 'relative', cursor: item.isFolder ? 'pointer' : 'default' }}
                                onClick={() => item.isFolder && navigateTo(item.id, item.name)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    {getIcon(item.type, item.isFolder)}
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleToggleStar(item.id, item.isStarred); }}
                                            style={{ background: 'none', border: 'none', color: item.isStarred ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer' }}
                                        >
                                            <Star size={16} fill={item.isStarred ? 'currentColor' : 'none'} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ fontWeight: '500', fontSize: '0.9rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {format(new Date(item.updatedAt), 'MMM d, yyyy')}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ padding: '0.75rem' }}>Name</th>
                                    <th style={{ padding: '0.75rem' }}>Last modified</th>
                                    <th style={{ padding: '0.75rem' }}>File size</th>
                                    <th style={{ padding: '0.75rem' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocs.map(item => (
                                    <tr
                                        key={item.id}
                                        className="glass-hover"
                                        style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem', cursor: item.isFolder ? 'pointer' : 'default' }}
                                        onClick={() => item.isFolder && navigateTo(item.id, item.name)}
                                    >
                                        <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            {getIcon(item.type, item.isFolder)}
                                            {item.name}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            {format(new Date(item.updatedAt), 'MMM d, h:mm a')}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>{item.isFolder ? '-' : (item.size / 1024).toFixed(1) + ' KB'}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                                <Star
                                                    size={16}
                                                    className={item.isStarred ? 'text-primary' : 'text-muted'}
                                                    fill={item.isStarred ? 'currentColor' : 'none'}
                                                    onClick={(e) => { e.stopPropagation(); handleToggleStar(item.id, item.isStarred); }}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <Trash2
                                                    size={16}
                                                    className="text-muted"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                                />
                                            </div>
                                        </td>
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
