'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, MapPin, Building, Calendar, Edit, Star, MoreHorizontal, Tag as TagIcon, Plus, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { getTags, createTag, addTagToContact, removeTagFromContact } from '@/lib/actions/tags';
import { crmAI, LeadScore } from '@/lib/ai/services/crm';

interface Tag {
    id: string;
    name: string;
    color: string;
}

interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    company?: string;
    status: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    avatar?: string;
    tags?: Tag[];
}

interface ContactProfileProps {
    contact: Contact | null;
    onClose: () => void;
}

export default function ContactProfile({ contact: initialContact, onClose }: ContactProfileProps) {
    const [contact, setContact] = useState<Contact | null>(initialContact);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState<LeadScore | null>(null);
    const [followUpDraft, setFollowUpDraft] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        setContact(initialContact);
    }, [initialContact]);

    useEffect(() => {
        async function fetchTags() {
            const tags = (await getTags()) as Tag[];
            setAvailableTags(tags);
        }
        if (isTagMenuOpen) {
            fetchTags();
        }
    }, [isTagMenuOpen]);

    if (!contact) return null;

    const initials = `${contact.firstName?.[0] || ''}${contact.lastName?.[0] || ''}`.toUpperCase();

    const handleAddTag = async (tag: Tag) => {
        setLoading(true);
        const res = await addTagToContact(contact.id, tag.id);
        if (res.success) {
            setContact(prev => prev ? ({
                ...prev,
                tags: [...(prev.tags || []), tag]
            }) : null);
            setIsTagMenuOpen(false);
        }
        setLoading(false);
    };

    const handleCreateTag = async () => {
        if (!newTagName) return;
        setLoading(true);
        const res = await createTag(newTagName);
        if (res.success && res.tag) {
            await handleAddTag(res.tag as Tag);
            setAvailableTags(prev => [...prev, res.tag as Tag]);
        }
        setNewTagName('');
        setLoading(false);
    };

    const handleRemoveTag = async (tagId: string) => {
        const res = await removeTagFromContact(contact.id, tagId);
        if (res.success) {
            setContact(prev => prev ? ({
                ...prev,
                tags: prev.tags?.filter(t => t.id !== tagId)
            }) : null);
        }
    };

    const handleAnalyzeLead = async () => {
        if (!contact) return;
        setIsAiLoading(true);
        try {
            const insight = await crmAI.analyzeLead({
                firstName: contact.firstName,
                lastName: contact.lastName,
                status: contact.status,
                interactions: [
                    { type: 'form', content: 'Inquired about home care services', date: '2025-12-20', direction: 'incoming' }
                ]
            });
            setAiInsight(insight);
        } catch (error) {
            console.error('AI analysis failed:', error);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleGenerateFollowUp = async () => {
        if (!contact) return;
        setIsAiLoading(true);
        try {
            const draft = await crmAI.generateFollowUp({
                firstName: contact.firstName,
                lastName: contact.lastName,
                status: contact.status,
                interactions: [
                    { type: 'form', content: 'Inquired about home care services', date: '2025-12-20', direction: 'incoming' }
                ]
            });
            setFollowUpDraft(draft);
        } catch (error) {
            console.error('Follow-up generation failed:', error);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-surface border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-text-primary">Contact Profile</h2>
                <div className="flex items-center gap-2">
                    <button className="text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-full hover:bg-surface-highlight">
                        <MoreHorizontal size={20} />
                    </button>
                    <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-full hover:bg-surface-highlight">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Profile Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Hero Section */}
                <div className="p-6 flex flex-col items-center border-b border-border bg-gradient-to-b from-surface-highlight/30 to-transparent">
                    <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-surface">
                            {initials}
                        </div>
                        <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-surface ${contact.status === 'LEAD' ? 'bg-warning' : 'bg-success'}`}></div>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary text-center">{contact.firstName} {contact.lastName}</h3>
                    <p className="text-text-secondary text-sm font-medium mb-4">{contact.company || 'No Company'}</p>

                    <div className="flex gap-3 w-full justify-center">
                        <button className="flex-1 max-w-[120px] btn-primary py-2 text-sm flex items-center justify-center gap-2">
                            <Phone size={16} />
                            Call
                        </button>
                        <button className="flex-1 max-w-[120px] btn-outline py-2 text-sm flex items-center justify-center gap-2">
                            <Mail size={16} />
                            Email
                        </button>
                    </div>

                    {/* AI Insights Quick View */}
                    <div className="mt-6 w-full px-4">
                        <div className="bg-nord10/5 border border-nord10/10 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-nord10">
                                    <Sparkles size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">AI Lead Analysis</span>
                                </div>
                                {!aiInsight && (
                                    <button
                                        onClick={handleAnalyzeLead}
                                        disabled={isAiLoading}
                                        className="text-[10px] text-nord10 hover:underline font-medium"
                                    >
                                        {isAiLoading ? 'Analyzing...' : 'Run Analysis'}
                                    </button>
                                )}
                            </div>

                            {aiInsight ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-text-secondary">Lead Score</span>
                                        <span className={`text-sm font-bold ${aiInsight.score > 80 ? 'text-nord14' : aiInsight.score > 50 ? 'text-nord13' : 'text-nord11'}`}>
                                            {aiInsight.score}%
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-text-secondary leading-relaxed italic">
                                        "{aiInsight.rationale}"
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {aiInsight.hotButtons.map((btn, idx) => (
                                            <span key={idx} className="bg-nord10/10 text-nord10 text-[9px] px-1.5 py-0.5 rounded-sm border border-nord10/10">
                                                {btn}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[10px] text-text-tertiary">Run AI analysis to see lead scoring and hot buttons.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-6 space-y-6">
                    {/* Tags */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Tags</h4>
                            <div className="relative">
                                <button
                                    onClick={() => setIsTagMenuOpen(!isTagMenuOpen)}
                                    className="text-primary hover:bg-surface-highlight p-1 rounded transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                                {isTagMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border rounded-lg shadow-xl z-10 p-2">
                                        <div className="mb-2 pb-2 border-b border-border">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="New tag..."
                                                    className="input text-sm flex-1"
                                                    value={newTagName}
                                                    onChange={(e) => setNewTagName(e.target.value)}
                                                />
                                                <button onClick={handleCreateTag} disabled={loading || !newTagName} className="btn-primary p-2">
                                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-48 overflow-y-auto space-y-1">
                                            {availableTags
                                                .filter(t => !contact.tags?.some(ct => ct.id === t.id))
                                                .map(tag => (
                                                    <button
                                                        key={tag.id}
                                                        onClick={() => handleAddTag(tag)}
                                                        className="w-full text-left px-3 py-2 text-sm rounded hover:bg-surface-highlight flex items-center gap-2"
                                                    >
                                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                                                        {tag.name}
                                                    </button>
                                                ))}
                                            {availableTags.filter(t => !contact.tags?.some(ct => ct.id === t.id)).length === 0 && (
                                                <div className="text-xs text-text-tertiary text-center py-2">No other tags available</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {contact.tags && contact.tags.length > 0 ? (
                                contact.tags.map(tag => (
                                    <span key={tag.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-border" style={{ backgroundColor: `${tag.color}15`, color: tag.color, borderColor: `${tag.color}30` }}>
                                        {tag.name}
                                        <button onClick={() => handleRemoveTag(tag.id)} className="hover:text-error transition-colors">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))
                            ) : (
                                <span className="text-text-tertiary text-sm italic">No tags</span>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">Contact Information</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 text-text-tertiary"><Phone size={18} /></div>
                                <div>
                                    <p className="text-sm font-medium text-text-primary">{contact.phone || 'N/A'}</p>
                                    <p className="text-xs text-text-tertiary">Mobile</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 text-text-tertiary"><Mail size={18} /></div>
                                <div>
                                    <p className="text-sm font-medium text-text-primary">{contact.email || 'N/A'}</p>
                                    <p className="text-xs text-text-tertiary">Email</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 text-text-tertiary"><MapPin size={18} /></div>
                                <div>
                                    <p className="text-sm font-medium text-text-primary">
                                        {[contact.address, contact.city, contact.state, contact.zip].filter(Boolean).join(', ') || 'N/A'}
                                    </p>
                                    <p className="text-xs text-text-tertiary">Address</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div>
                        <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">Metadata</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 text-text-tertiary"><Building size={18} /></div>
                                <div>
                                    <p className="text-sm font-medium text-text-primary">{contact.status}</p>
                                    <p className="text-xs text-text-tertiary">Status</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-surface-highlight/30">
                <button className="w-full btn-ghost text-primary flex items-center justify-center gap-2">
                    <Edit size={16} />
                    Edit Contact
                </button>
            </div>
        </div>
    );
}
