'use client';

import React, { useState } from 'react';
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

// --- Types ---

interface KanbanCard {
    id: string;
    name: string;
    detail: string;
    initials: string;
    initialsColor: string;
    type: string;
    typeColor: string;
    metaIcon?: React.ElementType;
    metaText?: string;
    metaColor?: string;
    columnId: string;
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

const initialCards: KanbanCard[] = [
    // Column 1: New Lead
    { id: '1', name: 'Martha Stewart', detail: 'Needs 24/7 care, referred by St. Mary\'s Hospital. Requires wheelchair access.', initials: 'MJ', initialsColor: 'bg-indigo-600', type: 'Referral', typeColor: 'text-primary bg-primary-subtle border-primary/20', metaIcon: Clock, metaText: '2h ago', columnId: 'new-lead' },
    { id: '2', name: 'George Miller', detail: 'Family requesting info on memory care services.', initials: '+', initialsColor: 'bg-surface-highlight border-border text-text-secondary', type: 'Web Inquiry', typeColor: 'text-purple-600 bg-purple-100 border-purple-200', metaIcon: AlertCircle, metaText: 'High', metaColor: 'text-error', columnId: 'new-lead' },
    { id: '3', name: 'Alice Wonderland', detail: 'Discharge planned for next Tuesday. Needs assessment.', initials: 'SR', initialsColor: 'bg-teal-600', type: 'Referral', typeColor: 'text-primary bg-primary-subtle border-primary/20', metaIcon: Clock, metaText: '1d ago', columnId: 'new-lead' },

    // Column 2: Contacted
    { id: '4', name: 'Robert De Niro', detail: 'Spoke with daughter, scheduling home visit for Thursday.', initials: 'KL', initialsColor: 'bg-pink-600', type: 'Call Scheduled', typeColor: 'text-warning bg-warning/10 border-warning/20', metaIcon: Calendar, metaText: 'Thu, 2pm', columnId: 'contacted' },
    { id: '5', name: 'Helen Mirren', detail: 'Evaluating insurance coverage. Sent brochure.', initials: 'JD', initialsColor: 'bg-primary', type: 'In Discussion', typeColor: 'text-warning bg-warning/10 border-warning/20', metaIcon: Clock, metaText: '3h ago', columnId: 'contacted' },

    // Column 3: Assessment
    { id: '6', name: 'Samuel L. Jackson', detail: 'RN Assessment scheduled. Need to verify med list.', initials: 'BT', initialsColor: 'bg-purple-600', type: 'Nurse Assigned', typeColor: 'text-indigo-600 bg-indigo-100 border-indigo-200', metaIcon: FileText, metaText: 'Forms Pending', columnId: 'assessment' },
    { id: '7', name: 'Uma Thurman', detail: 'Assessment complete. Waiting for care plan signature.', initials: 'SJ', initialsColor: 'bg-success', type: 'Review', typeColor: 'text-indigo-600 bg-indigo-100 border-indigo-200', metaIcon: AlertCircle, metaText: 'Sig Required', metaColor: 'text-warning', columnId: 'assessment' },

    // Column 4: Approved
    { id: '8', name: 'John Travolta', detail: 'Start of care: Nov 20th. Caregiver matched.', initials: 'SR', initialsColor: 'bg-teal-600', type: 'Ready to Start', typeColor: 'text-success bg-success/10 border-success/20', metaIcon: CheckCircle, metaText: 'Matched', metaColor: 'text-success', columnId: 'approved' },
];

// --- Components ---

function SortableItem({ card }: { card: KanbanCard }) {
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
            className="card p-4 hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing group touch-none"
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`${card.typeColor} text-[10px] px-2 py-0.5 rounded font-medium border`}>{card.type}</span>
                <button className="text-text-tertiary hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={16} />
                </button>
            </div>
            <h4 className="text-text-primary font-medium mb-1">{card.name}</h4>
            <p className="text-text-secondary text-xs mb-3 line-clamp-2">{card.detail}</p>
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                <div className="flex -space-x-2">
                    <div className={`size-6 rounded-full ${card.initialsColor} flex items-center justify-center text-white text-[10px] ring-2 ring-surface`}>{card.initials}</div>
                </div>
                {card.metaText && (
                    <div className={`flex items-center gap-1 text-xs ${card.metaColor || 'text-text-tertiary'}`}>
                        {card.metaIcon && <card.metaIcon size={14} />}
                        <span>{card.metaText}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function KanbanColumn({ column, cards }: { column: Column; cards: KanbanCard[] }) {
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
                        <SortableItem key={card.id} card={card} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}

// --- Main Component ---

export default function CrmKanban() {
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [items, setItems] = useState<KanbanCard[]>(initialCards);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

    // Modal State - New Item
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemDetail, setNewItemDetail] = useState('');

    // Modal State - New Stage
    const [isStageModalOpen, setIsStageModalOpen] = useState(false);
    const [newStageName, setNewStageName] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 5px movement to start drag
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

        if (activeId === overId) return;

        const isActiveACard = active.data.current?.type === 'Card';
        const isOverACard = over.data.current?.type === 'Card';
        const isOverAColumn = over.data.current?.type === 'Column';

        if (isActiveACard && isOverACard) {
            setItems((items) => {
                const activeIndex = items.findIndex((t) => t.id === activeId);
                const overIndex = items.findIndex((t) => t.id === overId);
                return arrayMove(items, activeIndex, overIndex);
            });
        }

        if (isActiveACard && isOverAColumn) {
            setItems((items) => {
                const activeIndex = items.findIndex((t) => t.id === activeId);
                return items;
            });
        }
    }

    // --- Actions ---

    function handleAddNewItem() {
        if (!newItemName) return;

        const newItem: KanbanCard = {
            id: Math.random().toString(36).substring(7),
            name: newItemName,
            detail: newItemDetail || 'New item detail',
            initials: newItemName.substring(0, 2).toUpperCase(),
            initialsColor: 'bg-primary',
            type: 'New Lead',
            typeColor: 'text-primary bg-primary-subtle border-primary/20',
            metaIcon: Clock,
            metaText: 'Just now',
            columnId: 'new-lead',
        };

        setItems([...items, newItem]);
        setNewItemName('');
        setNewItemDetail('');
        setIsModalOpen(false);
    }

    function handleAddStage() {
        if (!newStageName) return;

        const newColumn: Column = {
            id: newStageName.toLowerCase().replace(/\\s+/g, '-'),
            title: newStageName,
            color: 'bg-text-secondary',
        };

        setColumns([...columns, newColumn]);
        setNewStageName('');
        setIsStageModalOpen(false);
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
            <div className="flex flex-col h-full overflow-hidden bg-background transition-colors duration-300">
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
                                />
                            ))}

                            {/* Add Column Button */}
                            <div className="w-80 flex flex-col h-full flex-shrink-0 pt-2">
                                <button
                                    onClick={() => setIsStageModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border text-text-secondary hover:bg-surface-highlight hover:text-text-primary hover:border-text-secondary transition-colors w-full justify-center"
                                >
                                    <Plus size={20} />
                                    <span className="font-medium">Add Stage</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="card">
                            <table className="w-full text-left text-sm text-text-secondary">
                                <thead className="bg-surface-highlight border-b border-border text-xs uppercase font-semibold text-text-tertiary">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Detail</th>
                                        <th className="px-6 py-4">Stage</th>
                                        <th className="px-6 py-4">Type</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {items.map(item => (
                                        <tr key={item.id} className="hover:bg-surface-highlight transition-colors">
                                            <td className="px-6 py-4 font-medium text-text-primary">{item.name}</td>
                                            <td className="px-6 py-4">{item.detail}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-highlight text-text-primary border border-border`}>
                                                    {columns.find(c => c.id === item.columnId)?.title}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`${item.typeColor} text-[10px] px-2 py-0.5 rounded font-medium border`}>{item.type}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                                    <input
                                        type="text"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        className="input"
                                        placeholder="e.g. John Doe"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Details</label>
                                    <textarea
                                        value={newItemDetail}
                                        onChange={(e) => setNewItemDetail(e.target.value)}
                                        className="input h-24 resize-none"
                                        placeholder="Enter details..."
                                    />
                                </div>
                            </div>

                            <div className="p-6 pt-2 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-outline border-transparent hover:bg-surface-highlight"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddNewItem}
                                    disabled={!newItemName}
                                    className="btn-primary"
                                >
                                    Create Lead
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* New Stage Modal */}
                {isStageModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="card w-full max-w-sm shadow-2xl">
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h2 className="text-xl font-bold text-text-primary">Add New Stage</h2>
                                <button onClick={() => setIsStageModalOpen(false)} className="text-text-tertiary hover:text-text-primary transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Stage Name</label>
                                    <input
                                        type="text"
                                        value={newStageName}
                                        onChange={(e) => setNewStageName(e.target.value)}
                                        className="input"
                                        placeholder="e.g. Follow Up"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="p-6 pt-2 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsStageModalOpen(false)}
                                    className="btn-outline border-transparent hover:bg-surface-highlight"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddStage}
                                    disabled={!newStageName}
                                    className="btn-primary"
                                >
                                    Add Stage
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DndContext>
    );
}
