'use client';

import React, { useState, useEffect } from 'react';
import { sendFax, getContacts } from '@/lib/actions';
import { Eye, FileText as FileIcon, Users, Check } from 'lucide-react';
import FileViewer from '../FileViewer';

interface FaxComposerProps {
    onCancel?: () => void;
}

interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
}

export default function FaxComposer({ onCancel }: FaxComposerProps) {
    const [loading, setLoading] = useState(false);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showContactPicker, setShowContactPicker] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);

    // Fax Data State
    const [faxData, setFaxData] = useState({
        recipient: '',
        sender: 'John Doe',
        priority: 'NORMAL',
        file: null as File | null
    });

    // Cover Sheet State
    const [useCoverSheet, setUseCoverSheet] = useState(false);
    const [coverSheet, setCoverSheet] = useState({
        to: '',
        from: 'John Doe',
        subject: '',
        comments: ''
    });

    useEffect(() => {
        async function loadContacts() {
            const data = await getContacts();
            setContacts(data as Contact[]);
        }
        loadContacts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!faxData.recipient) return alert('Recipient is required');

        setLoading(true);
        try {
            let fileContent = '';
            let fileName = '';

            if (faxData.file) {
                fileName = faxData.file.name;
                const reader = new FileReader();
                fileContent = await new Promise((resolve) => {
                    reader.onload = (e) => {
                        const result = e.target?.result as string;
                        const base64 = result.split(',')[1];
                        resolve(base64);
                    };
                    reader.readAsDataURL(faxData.file as File);
                });
            }

            const result = await sendFax({
                recipient: faxData.recipient,
                sender: faxData.sender,
                priority: faxData.priority,
                fileContent,
                fileName,
                coverSheet: useCoverSheet ? coverSheet : undefined
            });

            if (result.success) {
                alert('Fax sent successfully!');
                setFaxData({ ...faxData, recipient: '', file: null });
                setPreviewUrl(null);
                setUseCoverSheet(false);
                setCoverSheet({ to: '', from: 'John Doe', subject: '', comments: '' });
                if (onCancel) onCancel();
            } else {
                alert('Failed to send fax: ' + (result as { error?: string }).error);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to send fax');
        } finally {
            setLoading(false);
        }
    };

    const selectContact = (contact: Contact) => {
        if (contact.phone) {
            setFaxData({ ...faxData, recipient: contact.phone });
            setCoverSheet({ ...coverSheet, to: `${contact.firstName} ${contact.lastName}` });
        }
        setShowContactPicker(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Recipient Number</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="+1 (555) 000-0000"
                                    value={faxData.recipient}
                                    onChange={(e) => setFaxData({ ...faxData, recipient: e.target.value })}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'var(--text-main)',
                                        outline: 'none'
                                    }}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowContactPicker(!showContactPicker)}
                                    className="glass-hover"
                                    style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                                >
                                    <Users size={18} />
                                </button>
                            </div>

                            {showContactPicker && (
                                <div className="glass" style={{ marginTop: '0.5rem', maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.5rem' }}>
                                    {contacts.length === 0 ? (
                                        <div style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>No contacts found.</div>
                                    ) : (
                                        contacts.filter(c => c.phone).map(contact => (
                                            <div
                                                key={contact.id}
                                                onClick={() => selectContact(contact)}
                                                className="glass-hover"
                                                style={{ padding: '0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}
                                            >
                                                <span>{contact.firstName} {contact.lastName}</span>
                                                <span style={{ color: 'var(--text-muted)' }}>{contact.phone}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Priority</label>
                            <select
                                value={faxData.priority}
                                onChange={(e) => setFaxData({ ...faxData, priority: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-main)',
                                    outline: 'none'
                                }}
                                disabled={loading}
                            >
                                <option value="NORMAL">Normal</option>
                                <option value="HIGH">High Priority</option>
                            </select>
                        </div>

                        <div style={{
                            border: '2px dashed var(--glass-border)',
                            borderRadius: '12px',
                            padding: '2rem',
                            textAlign: 'center',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            position: 'relative',
                            background: faxData.file ? 'rgba(var(--primary-rgb), 0.05)' : 'transparent'
                        }}>
                            <input
                                type="file"
                                accept=".pdf,.tif,.tiff"
                                onChange={(e) => setFaxData({ ...faxData, file: e.target.files ? e.target.files[0] : null })}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                                disabled={loading}
                            />
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                            <div style={{ fontSize: '0.9rem', color: faxData.file ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: faxData.file ? '600' : '400' }}>
                                {faxData.file ? faxData.file.name : 'Click to upload or drag & drop PDF/TIFF'}
                            </div>
                            {faxData.file && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (faxData.file) {
                                            const url = URL.createObjectURL(faxData.file);
                                            setPreviewUrl(url);
                                            setViewerOpen(true);
                                        }
                                    }}
                                    className="glass-hover"
                                    style={{
                                        marginTop: '1rem',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'var(--text-main)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        margin: '1rem auto 0'
                                    }}
                                >
                                    <Eye size={16} /> Preview
                                </button>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass" style={{ padding: '1.5rem', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: useCoverSheet ? '1.5rem' : '0' }}>
                                <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <FileIcon size={18} /> Include Cover Sheet
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setUseCoverSheet(!useCoverSheet)}
                                    style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        border: '1px solid var(--glass-border)',
                                        background: useCoverSheet ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                        color: useCoverSheet ? 'white' : 'var(--text-muted)',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    {useCoverSheet ? <Check size={14} /> : null}
                                    {useCoverSheet ? 'Added' : 'Add'}
                                </button>
                            </div>

                            {useCoverSheet && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>To</label>
                                            <input
                                                type="text"
                                                placeholder="Recipient Name"
                                                value={coverSheet.to}
                                                onChange={(e) => setCoverSheet({ ...coverSheet, to: e.target.value })}
                                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.9rem' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>From</label>
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                value={coverSheet.from}
                                                onChange={(e) => setCoverSheet({ ...coverSheet, from: e.target.value })}
                                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.9rem' }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Subject</label>
                                        <input
                                            type="text"
                                            placeholder="Fax Subject"
                                            value={coverSheet.subject}
                                            onChange={(e) => setCoverSheet({ ...coverSheet, subject: e.target.value })}
                                            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.9rem' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Comments</label>
                                        <textarea
                                            placeholder="Write your message here..."
                                            rows={5}
                                            value={coverSheet.comments}
                                            onChange={(e) => setCoverSheet({ ...coverSheet, comments: e.target.value })}
                                            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '0.9rem', resize: 'none' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{
                                padding: '1rem',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                opacity: loading ? 0.7 : 1,
                                height: 'fit-content',
                                marginTop: 'auto'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Queue Fax for Delivery'}
                        </button>
                    </div>
                </div>
            </form>

            <FileViewer
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                fileUrl={previewUrl}
                fileName={faxData.file?.name}
                fileType={faxData.file?.type}
            />
        </div>
    );
}
