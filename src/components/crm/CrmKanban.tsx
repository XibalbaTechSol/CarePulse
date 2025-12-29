'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    List,
    Kanban,
    Plus,
    MoreHorizontal,
    Clock,
    AlertCircle,
    CheckCircle,
    Calendar,
    FileText,
    Settings,
    UserPlus,
    X,
} from 'lucide-react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getLeadsForKanban, updateContactStatus, createContact } from '@/lib/actions/crm';
import ContactProfile from './ContactProfile';

// --- Types ---

interface KanbanCard {
    id: string;
    name: string;
    detail: string;
    initials: string;
    initialsColor: string;
    type: string; // Used for primary tag or status
    typeColor: string;
    columnId: string;
    tags?: any[];
    rawContact?: any;
    aiScore?: number;
    aiUrgency?: 'low' | 'medium' | 'high' | 'critical';
}

interface Column {
    id: string;
    title: string;
    color: string;
}

// --- Initial Data ---

const initialColumns: Column[] = [
    { id: 'new-lead', title: 'New Lead', color: 'bg-primary' },
    { id: 'contacted', title: 'Contacted', color: 'bg-warning' },
    { id: 'assessment', title: 'Assessment', color: 'bg-indigo-500' },
    { id: 'approved', title: 'Approved', color: 'bg-success' },
];

// --- Components ---

function SortableItem({ card, onClick }: { card: KanbanCard, onClick: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: 'Card',
            card,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-surface p-4 rounded-lg border border-primary/50 opacity-40 h-[150px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className="card p-4 hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing group touch-none"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-wrap gap-1">
                    {card.tags && card.tags.length > 0 ? (
                        card.tags.slice(0, 3).map((tag: any) => (
                            <span key={tag.id} className="text-[10px] px-2 py-0.5 rounded font-medium border" style={{ backgroundColor: `${tag.color}15`, color: tag.color, borderColor: `${tag.color}30` }}>
                                {tag.name}
                            </span>
                        ))
                    ) : (
                        <span className={`${card.typeColor} text-[10px] px-2 py-0.5 rounded font-medium border`}>{card.type}</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {card.aiScore && (
                        <div className={`flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${card.aiScore > 80 ? 'bg-nord14/10 text-nord14 border-nord14/20' :
                            card.aiScore > 50 ? 'bg-nord13/10 text-nord13 border-nord13/20' :
                                'bg-nord11/10 text-nord11 border-nord11/20'
                            }`}>
                            <span>{card.aiScore}%</span>
                        </div>
                    )}
                    <button className="text-text-tertiary hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>
            <h4 className="text-text-primary font-medium mb-1">{card.name}</h4>
            <p className="text-text-secondary text-xs mb-3 line-clamp-2">{card.detail}</p>
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                <div className="flex -space-x-2">
                    <div className={`size-6 rounded-full ${card.initialsColor} flex items-center justify-center text-white text-[10px] ring-2 ring-surface`}>{card.initials}</div>
                </div>
                <div className="text-xs text-text-tertiary">
                    Just now
                </div>
            </div>
        </div>
    );
}

function KanbanColumn({ column, cards, onCardClick }: { column: Column; cards: KanbanCard[], onCardClick: (card: KanbanCard) => void }) {
    const { setNodeRef } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
    });

    return (
        <div className="w-80 flex flex-col h-full bg-surface-highlight rounded-xl border border-border flex-shrink-0">
            {/* Column Header */}
            <div className="p-4 border-b border-border flex justify-between items-center sticky top-0 bg-surface-highlight rounded-t-xl z-10">
                <div className="flex items-center gap-2">
                    <div className={`size-2.5 rounded-full ${column.color}`}></div>
                    <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wide">{column.title}</h3>
                    <span className="text-text-secondary text-xs font-medium">{cards.length}</span>
                </div>
                <button className="text-text-tertiary hover:text-text-primary"><Plus size={18} /></button>
            </div>

            {/* Cards Container */}
            <div ref={setNodeRef} className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar min-h-[100px]">
                <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {cards.map(card => (
                        <SortableItem key={card.id} card={card} onClick={() => onCardClick(card)} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}

// --- Main Component ---

export default function CrmKanban() {
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [items, setItems] = useState<KanbanCard[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

    // Modal State - New Item
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemDetail, setNewItemDetail] = useState('');

    // Contact Profile
    const [selectedContact, setSelectedContact] = useState<any | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Fetch Leads
    useEffect(() => {
        async function loadLeads() {
            const leads = await getLeadsForKanban();
            // Map leads to Kanban Cards
            const mappedItems: KanbanCard[] = leads.map((lead: any) => ({
                id: lead.id,
                name: `${lead.firstName} ${lead.lastName}`,
                detail: lead.company || lead.phone || 'No details',
                initials: (lead.firstName?.[0] || '') + (lead.lastName?.[0] || ''),
                initialsColor: 'bg-primary',
                type: 'Lead',
                typeColor: 'text-primary bg-primary-subtle border-primary/20',
                metaText: 'Just now',
                columnId: lead.status === 'LEAD' ? 'new-lead' : (lead.status === 'CUSTOMER' ? 'approved' : (initialColumns.some(c => c.id === lead.status) ? lead.status : 'new-lead')), // Default to new-lead if status doesn't match
                tags: lead.tags,
                rawContact: lead,
                aiScore: Math.floor(Math.random() * 60) + 40, // Mock score for now
                aiUrgency: 'medium'
            }));
            setItems(mappedItems);
        }
        loadLeads();
    }, [selectedContact]); // Reload when contact profile closes (might have tag updates)

    // --- Drag Handlers ---

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        setActiveId(active.id as string);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveACard = active.data.current?.type === 'Card';
        const isOverACard = over.data.current?.type === 'Card';
        const isOverAColumn = over.data.current?.type === 'Column';

        if (!isActiveACard) return;

        // Dropping a Card over another Card
        if (isActiveACard && isOverACard) {
            setItems((items) => {
                const activeIndex = items.findIndex((t) => t.id === activeId);
                const overIndex = items.findIndex((t) => t.id === overId);

                if (items[activeIndex].columnId !== items[overIndex].columnId) {
                    const newItems = [...items];
                    newItems[activeIndex].columnId = items[overIndex].columnId;
                    // Optimistic update of status logic would be here, but we wait for DragEnd
                    return arrayMove(newItems, activeIndex, overIndex - 1);
                }

                return arrayMove(items, activeIndex, overIndex);
            });
        }

        // Dropping a Card over a Column
        if (isActiveACard && isOverAColumn) {
            setItems((items) => {
                const activeIndex = items.findIndex((t) => t.id === activeId);
                const activeCard = items[activeIndex];
                if (activeCard.columnId !== overId) {
                    const newItems = [...items];
                    newItems[activeIndex].columnId = overId as string;
                    return arrayMove(newItems, activeIndex, activeIndex);
                }
                return items;
            });
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveId(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const isActiveACard = active.data.current?.type === 'Card';
        const isOverACard = over.data.current?.type === 'Card';
        const isOverAColumn = over.data.current?.type === 'Column';

        // Determine the target column ID
        let targetColumnId: string | null = null;
        if (isOverAColumn) {
            targetColumnId = overId as string;
        } else if (isOverACard) {
            const overIndex = items.findIndex((t) => t.id === overId);
            targetColumnId = items[overIndex].columnId;
        }

        if (targetColumnId) {
            // Persist status change
            updateContactStatus(activeId as string, targetColumnId);
        }

        // Local state update
        if (activeId !== overId) {
            if (isActiveACard && isOverACard) {
                setItems((items) => {
                    const activeIndex = items.findIndex((t) => t.id === activeId);
                    const overIndex = items.findIndex((t) => t.id === overId);
                    return arrayMove(items, activeIndex, overIndex);
                });
            }
        }
    }

    // --- Actions ---

    async function handleAddNewItem() {
        if (!newItemName) return;

        const parts = newItemName.split(' ');
        const firstName = parts[0];
        const lastName = parts.slice(1).join(' ') || '';

        const res = await createContact({
            firstName,
            lastName,
            company: newItemDetail
        });

        if (res.success && res.contact) {
            const newItem: KanbanCard = {
                id: (res.contact as any).id,
                name: newItemName,
                detail: newItemDetail || 'No details',
                initials: newItemName.substring(0, 2).toUpperCase(),
                initialsColor: 'bg-primary',
                type: 'Lead',
                typeColor: 'text-primary bg-primary-subtle border-primary/20',
                columnId: 'new-lead',
                tags: [],
                rawContact: res.contact
            };
            setItems([...items, newItem]);
        }

        setNewItemName('');
        setNewItemDetail('');
        setIsModalOpen(false);
    }

    const activeCard = activeId ? items.find(c => c.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-full overflow-hidden bg-background transition-colors duration-300 relative">
                {/* Toolbar */}
                <div className="flex flex-col gap-6 p-4 md:px-8 md:pt-8 md:pb-4 border-b border-border z-10 shrink-0">
                    {/* Breadcrumb */}
                    <nav className="flex text-sm">
                        <span className="text-text-secondary hover:text-text-primary cursor-pointer transition-colors">Home</span>
                        <span className="mx-2 text-text-tertiary">/</span>
                        <span className="text-text-secondary hover:text-text-primary cursor-pointer transition-colors">CRM</span>
                        <span className="mx-2 text-text-tertiary">/</span>
                        <span className="text-text-primary font-medium">Workflows</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">Workflow Management</h1>
                            <p className="text-text-secondary text-base font-normal">Track intakes, authorizations, and onboarding in real-time.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn-outline">
                                <Settings size={20} />
                                <span className="text-sm font-semibold">Customize Board</span>
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary"
                            >
                                <Plus size={20} />
                                <span className="text-sm font-semibold">New Item</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div>
                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center border-b border-border">
                            <li className="me-2">
                                <button className="inline-flex items-center gap-2 p-4 border-b-2 border-primary text-primary rounded-t-lg active">
                                    <UserPlus size={20} />
                                    New Client Intake
                                    <span className="bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold px-2 py-0.5 rounded-full ml-1">{items.length}</span>
                                </button>
                            </li>
                            <li className="me-2">
                                <button className="inline-flex items-center gap-2 p-4 border-b-2 border-transparent text-text-secondary hover:text-text-primary hover:border-border rounded-t-lg transition-colors">
                                    <CheckCircle size={20} />
                                    Prior Authorizations
                                    <span className="bg-surface-highlight text-text-secondary border border-border text-xs font-semibold px-2 py-0.5 rounded-full ml-1">8</span>
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Search & View Toggle */}
                    <div className="flex items-center justify-between py-2">
                        <div className="relative w-full max-w-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search size={16} className="text-text-tertiary" />
                            </div>
                            <input
                                className="input pl-10"
                                placeholder="Search cards..."
                                type="text"
                            />
                        </div>
                        <div className="flex border border-border rounded-lg overflow-hidden shrink-0 bg-surface">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-surface-highlight text-primary' : 'text-text-secondary hover:bg-surface-highlight'}`}
                            >
                                <List size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={`p-2 transition-colors ${viewMode === 'kanban' ? 'bg-surface-highlight text-primary' : 'text-text-secondary hover:bg-surface-highlight'}`}
                            >
                                <Kanban size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 md:px-8 pb-8 custom-scrollbar bg-background">
                    {viewMode === 'kanban' ? (
                        <div className="flex h-full gap-6 min-w-max pb-4">
                            {columns.map(col => (
                                <KanbanColumn
                                    key={col.id}
                                    column={col}
                                    cards={items.filter(c => c.columnId === col.id)}
                                    onCardClick={(card) => setSelectedContact(card.rawContact)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="card">
                            {/* List View logic ... */}
                            <div className="p-4 text-center">List View</div>
                        </div>
                    )}
                </div>

                {/* Drag Overlay */}
                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.5',
                            },
                        },
                    }),
                }}>
                    {activeCard ? (
                        <div className="bg-surface p-4 rounded-lg border border-primary shadow-xl w-80 cursor-grabbing">
                            <h4 className="text-text-primary font-medium">{activeCard.name}</h4>
                        </div>
                    ) : null}
                </DragOverlay>

                {/* New Item Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="card w-full max-w-md shadow-2xl">
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h2 className="text-xl font-bold text-text-primary">Create New Lead</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-text-tertiary hover:text-text-primary transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                                    <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="input" placeholder="e.g. John Doe" autoFocus />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Company / Details</label>
                                    <textarea value={newItemDetail} onChange={(e) => setNewItemDetail(e.target.value)} className="input h-24 resize-none" placeholder="Enter details..." />
                                </div>
                            </div>
                            <div className="p-6 pt-2 flex justify-end gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="btn-outline border-transparent hover:bg-surface-highlight">Cancel</button>
                                <button onClick={handleAddNewItem} disabled={!newItemName} className="btn-primary">Create Lead</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Profile Slide-over */}
                {selectedContact && (
                    <ContactProfile contact={selectedContact} onClose={() => setSelectedContact(null)} />
                )}
            </div>
        </DndContext>
    );
}
