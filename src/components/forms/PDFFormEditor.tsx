'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, PDFTextField } from 'pdf-lib';
import { X, Save, ZoomIn, ZoomOut, User, Check, Loader2, Send, CloudUpload, Printer } from 'lucide-react';
import { getContactFormData, uploadFilledPDF } from '@/lib/actions/pdf';
import { useRouter } from 'next/navigation';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFFormEditorProps {
    templateName: string; // Filename like "CMS-485.pdf"
    contacts: { id: string; firstName: string; lastName: string }[];
    onClose: () => void;
}

export default function PDFFormEditor({ templateName, contacts, onClose }: PDFFormEditorProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState(1.2);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    
    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, targetName: string, targetElement: HTMLInputElement | null } | null>(null);
    const [selectedContactId, setSelectedContactId] = useState<string>('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Load PDF file
    const fileUrl = `/templates/${templateName}`;

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    // Handle global clicks to close context menu
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    // Right-click handler for inputs
    const handleContextMenu = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
            e.preventDefault();
            const input = target as HTMLInputElement;
            setContextMenu({
                x: e.pageX,
                y: e.pageY,
                targetName: input.name,
                targetElement: input
            });
        }
    };

    // Autofill Logic
    const handleAutofillField = async (fieldPath: string) => {
        if (!selectedContactId || !contextMenu?.targetElement) {
            alert("Please select a client in the sidebar first.");
            return;
        }
        
        setLoading(true);
        try {
            const data = await getContactFormData(selectedContactId);
            
            // Resolve path (e.g., "contact.name")
            const [obj, prop] = fieldPath.split('.');
            // @ts-ignore
            const value = data[obj]?.[prop];

            if (value) {
                // Update DOM
                contextMenu.targetElement.value = String(value);
                // Dispatch input event for React/PDF.js internal listeners
                const event = new Event('input', { bubbles: true });
                contextMenu.targetElement.dispatchEvent(event);
                const changeEvent = new Event('change', { bubbles: true });
                contextMenu.targetElement.dispatchEvent(changeEvent);
            }
        } catch (e) {
            console.error(e);
            alert("Error fetching client data");
        } finally {
            setLoading(false);
            setContextMenu(null);
        }
    };

    const handleAutofillAll = async () => {
        if (!selectedContactId) return;
        setLoading(true);
        try {
            const data = await getContactFormData(selectedContactId);
            // Flatten data for easier matching
            const flatData: Record<string, string> = {};
            const traverse = (obj: any, prefix = '') => {
                for (const key in obj) {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        traverse(obj[key], `${prefix}${key}.`);
                    } else {
                        flatData[`${prefix}${key}`.toLowerCase()] = String(obj[key]);
                    }
                }
            };
            traverse(data);

            // Iterate all inputs in the container
            const inputs = containerRef.current?.querySelectorAll('input, textarea, select');
            inputs?.forEach((input: any) => {
                const name = input.name.toLowerCase();
                // Heuristic matching
                let match = '';
                // 1. Direct match (e.g. "contact.name")
                // 2. Fuzzy match
                for (const key in flatData) {
                    if (name.includes(key) || key.includes(name)) {
                         match = flatData[key];
                         break;
                    }
                    if (name.includes('patient') && key.includes('contact.name')) match = flatData[key];
                    if (name.includes('dob') && key.includes('contact.dob')) match = flatData[key];
                    if (name.includes('address') && key.includes('contact.complete_address')) match = flatData[key];
                }

                if (match) {
                    input.value = match;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

        } catch (e) {
            console.error(e);
            alert("Autofill failed");
        } finally {
            setLoading(false);
        }
    };

    const generateFilledPDF = async () => {
        const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();

        const inputs = containerRef.current?.querySelectorAll('input, textarea, select');
        inputs?.forEach((input: any) => {
            try {
                const field = form.getField(input.name);
                if (field instanceof PDFTextField) {
                    field.setText(input.value);
                }
            } catch (err) { }
        });

        return await pdfDoc.save();
    };

    const handleDownload = async () => {
        setSaving(true);
        try {
            const pdfBytes = await generateFilledPDF();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `filled_${templateName}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error(e);
            alert('Failed to save PDF');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveToDrive = async () => {
        setSaving(true);
        try {
            const pdfBytes = await generateFilledPDF();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const formData = new FormData();
            formData.append('file', blob, `filled_${templateName}`);
            formData.append('contactId', selectedContactId);

            const res = await uploadFilledPDF(formData);
            if (res.success) {
                alert('Saved to Drive (Documents)!');
            }
        } catch (e) {
            console.error(e);
            alert('Failed to upload');
        } finally {
            setSaving(false);
        }
    };

    const handleFax = async () => {
        setSaving(true);
        try {
            const pdfBytes = await generateFilledPDF();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const formData = new FormData();
            formData.append('file', blob, `fax_${templateName}`);
            formData.append('contactId', selectedContactId);

            const res = await uploadFilledPDF(formData);
            if (res.success) {
                // Redirect to fax page with document selected? 
                // For now, just go to fax dashboard
                router.push('/dashboard/fax');
            }
        } catch (e) {
            console.error(e);
            alert('Failed to prepare fax');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col h-screen w-screen overflow-hidden animate-in fade-in duration-200">
            {/* Styles for Blue Inputs */}
            <style jsx global>{`
                .react-pdf__Page__annotations input,
                .react-pdf__Page__annotations textarea,
                .react-pdf__Page__annotations select {
                    background-color: rgba(0, 100, 255, 0.1) !important;
                    border: 1px solid rgba(0, 100, 255, 0.3) !important;
                    color: black !important;
                    cursor: text;
                }
                .react-pdf__Page__annotations input:focus,
                .react-pdf__Page__annotations textarea:focus {
                    background-color: rgba(0, 100, 255, 0.2) !important;
                    border: 1px solid #3b82f6 !important;
                    outline: none;
                }
            `}</style>

            {/* Header */}
            <div className="h-16 glass border-b border-white/10 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-white">{templateName}</h2>
                    <div className="flex items-center bg-white/10 rounded-lg p-1">
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:bg-white/10 rounded"><ZoomOut size={16} /></button>
                        <span className="px-2 text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(3, s + 0.1))} className="p-2 hover:bg-white/10 rounded"><ZoomIn size={16} /></button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select 
                        value={selectedContactId} 
                        onChange={(e) => setSelectedContactId(e.target.value)}
                        className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary w-64"
                    >
                        <option value="">-- Select Client for Autofill --</option>
                        {contacts.map(c => (
                            <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                        ))}
                    </select>
                    
                    <button 
                        onClick={handleAutofillAll}
                        disabled={!selectedContactId || loading}
                        className="btn-secondary flex items-center gap-2 text-sm px-3 py-2"
                        title="Try to autofill all fields"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <User size={16} />}
                        Autofill
                    </button>
                    
                    <div className="h-8 w-px bg-white/20 mx-2" />

                    <button 
                        onClick={handleSaveToDrive}
                        disabled={saving}
                        className="glass hover:bg-white/10 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
                        title="Save to Drive (Documents)"
                    >
                        <CloudUpload size={16} /> Save
                    </button>

                    <button 
                        onClick={handleFax}
                        disabled={saving}
                        className="glass hover:bg-white/10 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
                        title="Export to Fax"
                    >
                        <Send size={16} /> Fax
                    </button>

                    <button 
                        onClick={handleDownload}
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 text-sm px-3 py-2"
                        title="Download as PDF"
                    >
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Download
                    </button>
                    
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div 
                ref={containerRef}
                className="flex-1 overflow-auto bg-[#333] flex justify-center p-8 relative"
                onContextMenu={handleContextMenu}
            >
                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex flex-col items-center justify-center mt-20 text-white/50">
                            <Loader2 className="animate-spin mb-4" size={48} />
                            <p>Loading PDF Form...</p>
                        </div>
                    }
                    error={
                        <div className="text-red-400 mt-20">Failed to load PDF. Please check if file exists.</div>
                    }
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <div key={`page_${index + 1}`} className="mb-8 shadow-2xl">
                            <Page 
                                pageNumber={index + 1} 
                                scale={scale} 
                                renderAnnotationLayer={true}
                                renderTextLayer={false}
                                className="bg-white"
                            />
                        </div>
                    ))}
                </Document>

                {/* Context Menu */}
                {contextMenu && (
                    <div 
                        className="absolute glass border border-white/20 rounded-lg shadow-2xl py-2 w-64 z-50 animate-in fade-in zoom-in-95 duration-100"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                    >
                        <div className="px-3 py-2 border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                            Insert Client Info
                        </div>
                        {selectedContactId ? (
                            <>
                                <button onClick={() => handleAutofillField('contact.name')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm">Full Name</button>
                                <button onClick={() => handleAutofillField('contact.firstName')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm">First Name</button>
                                <button onClick={() => handleAutofillField('contact.lastName')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm">Last Name</button>
                                <button onClick={() => handleAutofillField('contact.dob')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm">Date of Birth</button>
                                <button onClick={() => handleAutofillField('contact.complete_address')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm">Full Address</button>
                                <button onClick={() => handleAutofillField('contact.phone')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm">Phone Number</button>
                                <div className="border-t border-white/10 my-1" />
                                <button onClick={() => handleAutofillField('auth.startDate')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm">Auth Start Date</button>
                                <button onClick={() => handleAutofillField('auth.endDate')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm">Auth End Date</button>
                            </>
                        ) : (
                            <div className="px-4 py-3 text-sm text-yellow-500 italic">
                                Select a client in the toolbar to enable autofill options.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
