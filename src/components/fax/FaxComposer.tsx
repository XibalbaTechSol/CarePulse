'use client';

import React, { useState } from 'react';
import { sendFax } from '@/lib/actions';
import { Eye, FileText as FileIcon } from 'lucide-react';
import FileViewer from '../FileViewer';

export default function FaxComposer() {
    const [loading, setLoading] = useState(false);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!faxData.recipient) return alert('Recipient is required');

        setLoading(true);
        try {
            let fileContent = '';
            let fileName = '';

            if (faxData.file) {
                fileName = faxData.file.name;
                // Convert file to base64
                const reader = new FileReader();
                fileContent = await new Promise((resolve) => {
                    reader.onload = (e) => {
                        const result = e.target?.result as string;
                        // Remove data URL prefix (e.g., "data:application/pdf;base64,")
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
                alert('Fax sent successfully!');
                setFaxData({ ...faxData, recipient: '', file: null });
                setPreviewUrl(null);
                setUseCoverSheet(false);
                setCoverSheet({ to: '', from: 'John Doe', subject: '', comments: '' });
                window.location.reload();
            } else {
                alert('Failed to send fax: ' + (result as any).error); // Type cast if needed depending on return type
            }
        } catch (error) {
            console.error(error);
            alert('Failed to send fax');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Send New Fax</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Recipient Number</label>
                    <input
                        type="text"
                        placeholder="+1 (555) 000-0000"
                        value={faxData.recipient}
                        onChange={(e) => setFaxData({ ...faxData, recipient: e.target.value })}
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
                    />
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
                    position: 'relative'
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
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
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
                                background: 'transparent',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                margin: '1rem auto 0'
                            }}
                        >
                            <Eye size={16} /> Preview Document
                        </button>
                    )}
                </div>

                <div className="glass" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: useCoverSheet ? '1rem' : '0' }}>
                        <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileIcon size={18} /> Add Cover Sheet
                        </h3>
                        {/* Toggle Switch */}
                        <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
                            <input
                                type="checkbox"
                                checked={useCoverSheet}
                                onChange={(e) => setUseCoverSheet(e.target.checked)}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: useCoverSheet ? 'var(--accent)' : '#ccc', borderRadius: '34px', transition: '.4s'
                            }}></span>
                            <span style={{
                                position: 'absolute', content: '""', height: '16px', width: '16px', left: '2px', bottom: '2px',
                                backgroundColor: 'white', borderRadius: '50%', transition: '.4s',
                                transform: useCoverSheet ? 'translateX(20px)' : 'translateX(0)'
                            }}></span>
                        </label>
                    </div>

                    {useCoverSheet && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>To</label>
                                    <input
                                        type="text"
                                        placeholder="Recipient Name"
                                        value={coverSheet.to}
                                        onChange={(e) => setCoverSheet({ ...coverSheet, to: e.target.value })}
                                        className="input-glass"
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', marginTop: '0.25rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From</label>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={coverSheet.from}
                                        onChange={(e) => setCoverSheet({ ...coverSheet, from: e.target.value })}
                                        className="input-glass"
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', marginTop: '0.25rem' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subject</label>
                                <input
                                    type="text"
                                    placeholder="Fax Subject"
                                    value={coverSheet.subject}
                                    onChange={(e) => setCoverSheet({ ...coverSheet, subject: e.target.value })}
                                    className="input-glass"
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', marginTop: '0.25rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Comments</label>
                                <textarea
                                    placeholder="Message/Comments..."
                                    rows={4}
                                    value={coverSheet.comments}
                                    onChange={(e) => setCoverSheet({ ...coverSheet, comments: e.target.value })}
                                    className="input-glass"
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', marginTop: '0.25rem', resize: 'vertical' }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '1rem', opacity: loading ? 0.7 : 1 }}
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Queue Fax for Delivery'}
                </button>
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
