'use client';

import React, { useState, useMemo } from 'react';
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
import { crmModule } from '@/lib/modules/definitions/crm';
import { Button, Input, Card, Badge, Alert } from '@/components/nord';

// --- Types ---

interface KanbanCard {
    id: string;
    name: string;
    detail: string;
    initials: string;
    initialsColor: string; // Should map to Nord colors
    type: string;
    typeColor?: string;
    metaIcon?: React.ElementType;
    metaText?: string;
    metaColor?: string;
    columnId: string;
}

interface Column {
    id: string;
    title: string;
    color: string; // Nord theme color
}

// --- Initial Data (Mocking sourced from module config) ---

// Ideally this comes from the module registry configuration for the current organization
const MODULE_CONFIG = crmModule.defaultConfig || {};
const STAGES = MODULE_CONFIG.intakeStages as string[] || ['Referral', 'Assessment', 'Authorization', 'Active'];

const initialColumns: Column[] = STAGES.map((stage, index) => ({
    id: stage.toLowerCase().replace(/\s+/g, '-'),
    title: stage,
    // Cycle through Nord Frost colors for column indicators
    color: ['bg-nord7', 'bg-nord8', 'bg-nord9', 'bg-nord10'][index % 4]
}));

const initialCards: KanbanCard[] = [
    // Column 1
    { id: '1', name: 'Martha Stewart', detail: 'Needs 24/7 care, referred by St. Mary\'s Hospital.', initials: 'MJ', initialsColor: 'bg-nord11', type: 'Referral', metaIcon: Clock, metaText: '2h ago', columnId: initialColumns[0].id },
    { id: '2', name: 'George Miller', detail: 'Family requesting info on memory care services.', initials: '+', initialsColor: 'bg-nord12', type: 'Web Inquiry', metaIcon: AlertCircle, metaText: 'High', metaColor: 'text-nord11', columnId: initialColumns[0].id },

    // Column 2
    { id: '4', name: 'Robert De Niro', detail: 'Spoke with daughter, scheduling home visit.', initials: 'KL', initialsColor: 'bg-nord13', type: 'Call Scheduled', metaIcon: Calendar, metaText: 'Thu, 2pm', columnId: initialColumns[1].id },

    // Column 3
    { id: '6', name: 'Samuel L. Jackson', detail: 'RN Assessment scheduled. Need to verify med list.', initials: 'BT', initialsColor: 'bg-nord14', type: 'Nurse Assigned', metaIcon: FileText, metaText: 'Forms Pending', columnId: initialColumns[2].id },

    // Column 4
    { id: '8', name: 'John Travolta', detail: 'Start of care: Nov 20th. Caregiver matched.', initials: 'SR', initialsColor: 'bg-nord15', type: 'Ready to Start', metaIcon: CheckCircle, metaText: 'Matched', metaColor: 'text-nord14', columnId: initialColumns[3].id },
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
                className="bg-nord1/50 p-4 rounded-lg border-2 border-dashed border-nord8/40 h-[150px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group touch-none"
        >
            <Card hover className="cursor-grab active:cursor-grabbing border-l-4" style={{ borderLeftColor: 'var(--nord8)' }}> {/* Simplified border color logic for now */}
                <div className="p-3">
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="info" className="text-[10px] py-0.5">{card.type}</Badge>
                        <button className="text-nord3 hover:text-nord1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                    <h4 className="text-nord1 dark:text-nord6 font-medium mb-1">{card.name}</h4>
                    <p className="text-nord3 dark:text-nord4 text-xs mb-3 line-clamp-2">{card.detail}</p>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-nord4 dark:border-nord2">
                        <div className="flex -space-x-2">
                            <div className={`size-6 rounded-full ${card.initialsColor} flex items-center justify-center text-nord6 text-[10px] ring-2 ring-nord6 dark:ring-nord1`}>{card.initials}</div>
                        </div>
                        {card.metaText && (
                            <div className={`flex items-center gap-1 text-xs ${card.metaColor || 'text-nord3 dark:text-nord4'}`}>
                                {card.metaIcon && <card.metaIcon size={14} />}
                                <span>{card.metaText}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
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
        <div className="w-80 flex flex-col h-full bg-nord6 dark:bg-nord1 rounded-xl border border-nord4 dark:border-nord2 flex-shrink-0 shadow-sm">
            {/* Column Header */}
            <div className="p-4 border-b border-nord4 dark:border-nord2 flex justify-between items-center sticky top-0 bg-nord6 dark:bg-nord1 rounded-t-xl z-10 glass">
                <div className="flex items-center gap-2">
                    <div className={`size-3 rounded-full ${column.color}`}></div>
                    <h3 className="text-nord0 dark:text-nord6 font-semibold text-sm uppercase tracking-wide">{column.title}</h3>
                    <Badge variant="primary" className="ml-1 text-xs">{cards.length}</Badge>
                </div>
                <button className="text-nord3 hover:text-nord0 dark:text-nord4 dark:hover:text-nord6"><Plus size={18} /></button>
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

export default function NordCrmKanban() {
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [items, setItems] = useState<KanbanCard[]>(initialCards);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showActivityLog, setShowActivityLog] = useState(false);

    // Filtered Items
    const filteredItems = useMemo(() => {
        return items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [items, searchQuery]);

    // Modal State - New Item
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemDetail, setNewItemDetail] = useState('');

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

        if (isActiveACard && isOverACard) {
            setItems((items) => {
                const activeIndex = items.findIndex((t) => t.id === activeId);
                const overIndex = items.findIndex((t) => t.id === overId);
                return arrayMove(items, activeIndex, overIndex);
            });
        }
    }

    // --- Actions ---

    function handleDeleteSelected() {
        setItems(items.filter(item => !selectedIds.has(item.id)));
        setSelectedIds(new Set());
    }

    function handleAddNewItem() {
        if (!newItemName) return;

        const newItem: KanbanCard = {
            id: Math.random().toString(36).substring(7),
            name: newItemName,
            detail: newItemDetail || 'New item detail',
            initials: newItemName.substring(0, 2).toUpperCase(),
            initialsColor: 'bg-nord14',
            type: 'New Lead',
            metaIcon: Clock,
            metaText: 'Just now',
            columnId: initialColumns[0].id,
        };

        setItems([...items, newItem]);
        setNewItemName('');
        setNewItemDetail('');
        setIsModalOpen(false);
    }

    function toggleSelect(id: string) {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
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
            <div className="flex h-full overflow-hidden bg-nord6 dark:bg-nord0 transition-colors duration-300">
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Toolbar */}
                    <div className="flex flex-col gap-6 p-4 md:px-8 md:pt-8 md:pb-4 border-b border-nord4 dark:border-nord2 z-10 shrink-0 bg-nord6 dark:bg-nord0">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-nord0 dark:text-nord6">Intake Workflow</h1>
                                <p className="text-nord3 dark:text-nord4 text-base font-normal">Manage client intake pipeline : {viewMode === 'kanban' ? 'Kanban View' : 'List View'}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setShowActivityLog(!showActivityLog)}>
                                    <Clock size={16} className="mr-2" /> Activity
                                </Button>
                                <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
                                    <Plus size={16} className="mr-2" /> New Intake
                                </Button>
                            </div>
                        </div>

                        {/* Search & View Toggle */}
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-4 w-full max-w-xl">
                                <div className="relative flex-1">
                                    <Input
                                        placeholder="Search intakes by name, type or detail..."
                                        className="pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Search size={16} className="text-nord3 dark:text-nord4" />
                                    </div>
                                </div>
                                {selectedIds.size > 0 && (
                                    <div className="flex items-center gap-2 animate-in slide-in-from-left-2">
                                        <Badge variant="primary">{selectedIds.size} Selected</Badge>
                                        <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>Clear</Button>
                                        <Button variant="error" size="sm" onClick={handleDeleteSelected}>Delete</Button>
                                    </div>
                                )}
                            </div>
                            <div className="flex border border-nord4 dark:border-nord2 rounded-lg overflow-hidden shrink-0 bg-nord6 dark:bg-nord1">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-nord4 dark:bg-nord2 text-nord0 dark:text-nord6' : 'text-nord3 dark:text-nord4 hover:bg-nord4 dark:hover:bg-nord2'}`}
                                >
                                    <List size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('kanban')}
                                    className={`p-2 transition-colors ${viewMode === 'kanban' ? 'bg-nord4 dark:bg-nord2 text-nord0 dark:text-nord6' : 'text-nord3 dark:text-nord4 hover:bg-nord4 dark:hover:bg-nord2'}`}
                                >
                                    <Kanban size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 md:px-8 pb-8 custom-scrollbar bg-nord6 dark:bg-nord0">
                        {viewMode === 'kanban' ? (
                            <div className="flex h-full gap-6 min-w-max pb-4">
                                {columns.map(col => (
                                    <KanbanColumn
                                        key={col.id}
                                        column={col}
                                        cards={filteredItems.filter(c => c.columnId === col.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <table className="w-full text-left text-sm text-nord3 dark:text-nord4">
                                    <thead className="bg-nord5 dark:bg-nord1 border-b border-nord4 dark:border-nord2 text-xs uppercase font-semibold text-nord3 dark:text-nord4">
                                        <tr>
                                            <th className="px-6 py-4 w-10">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedIds(new Set(filteredItems.map(i => i.id)));
                                                        else setSelectedIds(new Set());
                                                    }}
                                                />
                                            </th>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Detail</th>
                                            <th className="px-6 py-4">Stage</th>
                                            <th className="px-6 py-4">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-nord4 dark:divide-nord2">
                                        {filteredItems.map(item => (
                                            <tr key={item.id} className={`hover:bg-nord5 dark:hover:bg-nord1 transition-colors ${selectedIds.has(item.id) ? 'bg-nord8/10' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(item.id)}
                                                        onChange={() => toggleSelect(item.id)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 font-medium text-nord0 dark:text-nord6">{item.name}</td>
                                                <td className="px-6 py-4">{item.detail}</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="primary">{columns.find(c => c.id === item.columnId)?.title}</Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="info">{item.type}</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Activity Log Sidebar */}
                {showActivityLog && (
                    <div className="w-80 border-l border-nord4 dark:border-nord2 bg-nord5 dark:bg-nord1 p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-nord0 dark:text-nord6">Activity Log</h2>
                            <button onClick={() => setShowActivityLog(false)}><X size={20} /></button>
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="relative pl-6 border-l-2 border-nord4 dark:border-nord2 pb-6">
                                    <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-nord8 border-2 border-nord6 dark:border-nord1"></div>
                                    <p className="text-xs text-nord3 dark:text-nord4 mb-1">Today, 10:45 AM</p>
                                    <p className="text-sm font-medium text-nord0 dark:text-nord6">Martha Stewart</p>
                                    <p className="text-xs text-nord3 dark:text-nord4">Moved from Referral to Assessment</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                        <div className="bg-nord1 dark:bg-nord0 p-4 rounded-lg border border-nord8 shadow-xl w-80 cursor-grabbing">
                            <h4 className="text-nord6 font-medium">{activeCard.name}</h4>
                        </div>
                    ) : null}
                </DragOverlay>

                {/* New Item Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <Card className="w-full max-w-md shadow-2xl">
                            <div className="p-6 border-b border-nord4 dark:border-nord2 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-nord0 dark:text-nord6">New Intake</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-nord3 hover:text-nord0 dark:hover:text-nord6 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <Input
                                    label="Name"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    autoFocus
                                />
                                <div>
                                    <label className="block text-sm font-medium text-nord3 dark:text-nord4 mb-1">Details</label>
                                    <textarea
                                        value={newItemDetail}
                                        onChange={(e) => setNewItemDetail(e.target.value)}
                                        className="input h-24 resize-none w-full border border-nord4 dark:border-nord2 rounded-md bg-transparent p-2"
                                        placeholder="Enter details..."
                                    />
                                </div>
                            </div>

                            <div className="p-6 pt-2 flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button variant="primary" onClick={handleAddNewItem} disabled={!newItemName}>Create Intake</Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </DndContext>
    );
}


