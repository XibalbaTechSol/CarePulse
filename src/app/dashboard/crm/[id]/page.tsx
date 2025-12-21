'use client';

'use client';

import React, { useEffect, useState } from 'react';
import { getClient, createCarePlanTask, ensureCarePlan } from '@/lib/actions/crm';
import {
    User,
    FileText,
    ClipboardList,
    Plus,
    MapPin,
    Phone,
    Mail
} from 'lucide-react';

export default function ClientProfilePage({ params }: { params: { id: string } }) {
    const [client, setClient] = useState<any>(null);
    const [carePlan, setCarePlan] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, [params.id]);

    async function loadData() {
        try {
            const data: any = await getClient(params.id);
            if (!data) return; // Handle not found later
            setClient(data);

            // Find active care plan or create default
            let activePlan = data.carePlans.find((cp: any) => cp.status === 'ACTIVE');
            if (!activePlan) {
                const newPlan = await ensureCarePlan(data.id);
                if (newPlan) activePlan = newPlan;
            }
            setCarePlan(activePlan);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="p-8 text-text-secondary">Loading profile...</div>;
    if (!client) return <div className="p-8 text-text-secondary">Client not found</div>;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'careplan', label: 'Care Plan', icon: ClipboardList },
        { id: 'documents', label: 'Documents', icon: FileText },
    ];

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-full bg-primary-subtle flex items-center justify-center text-3xl font-bold text-primary shrink-0 ring-4 ring-surface">
                    {client.firstName[0]}{client.lastName[0]}
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-text-primary">{client.firstName} {client.lastName}</h1>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-text-secondary">
                        <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            {client.address}, {client.city}, {client.state}
                        </div>
                        <div className="flex items-center gap-1">
                            <Phone size={16} />
                            {client.phone}
                        </div>
                        <div className="flex items-center gap-1">
                            <Mail size={16} />
                            {client.email || 'No email'}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-surface-highlight text-text-primary border border-border font-medium text-sm">
                        {client.status}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <div className="flex gap-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors font-medium text-sm ${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card p-6">
                            <h3 className="font-semibold text-lg mb-4 text-text-primary">Client Details</h3>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2">
                                    <span className="text-text-secondary text-sm">Date of Birth</span>
                                    <span className="font-medium text-text-primary">{client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <span className="text-text-secondary text-sm">Medicaid ID</span>
                                    <span className="font-medium text-text-primary">{client.medicaidId || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <span className="text-text-secondary text-sm">Organization</span>
                                    <span className="font-medium text-text-primary">Main Office</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'careplan' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-text-primary">Active Care Plan</h3>
                            <button
                                onClick={() => setIsTaskModalOpen(true)}
                                className="btn-primary"
                            >
                                <Plus size={16} />
                                Add Task
                            </button>
                        </div>

                        <div className="card">
                            <table className="w-full text-left">
                                <thead className="bg-surface-highlight border-b border-border">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-text-primary uppercase">Task Name</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-text-primary uppercase">Category</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-text-primary uppercase">Frequency</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {carePlan?.tasks?.map((task: any) => (
                                        <tr key={task.id} className="hover:bg-surface-highlight transition-colors">
                                            <td className="px-6 py-4 font-medium text-text-primary">{task.taskName}</td>
                                            <td className="px-6 py-4 text-sm text-text-secondary">
                                                <span className="px-2 py-1 rounded bg-surface-highlight border border-border text-xs font-medium text-text-primary">
                                                    {task.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-secondary">{task.frequency}</td>
                                        </tr>
                                    ))}
                                    {(!carePlan?.tasks || carePlan.tasks.length === 0) && (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-text-tertiary">
                                                No tasks in care plan. Add one to get started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="card p-12 text-center text-text-tertiary border-dashed">
                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No documents uploaded yet.</p>
                        <button className="mt-4 text-primary hover:text-primary-hover font-medium hover:underline">Upload Document</button>
                    </div>
                )}
            </div>

            {/* Add Task Modal */}
            {isTaskModalOpen && carePlan && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="card w-full max-w-md bg-surface shadow-xl">
                        <div className="p-6 border-b border-border">
                            <h3 className="font-semibold text-xl text-text-primary">Add Care Plan Task</h3>
                        </div>
                        <div className="p-6">
                            <form action={async (formData) => {
                                await createCarePlanTask(carePlan.id, formData);
                                setIsTaskModalOpen(false);
                                loadData(); // Reload to see new task
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-text-secondary">Task Name</label>
                                        <input name="taskName" required className="input" placeholder="e.g. Check Blood Pressure" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-text-secondary">Category</label>
                                        <select name="category" className="input">
                                            <option value="ADL">ADL (Activities of Daily Living)</option>
                                            <option value="IADL">IADL (Instrumental ADL)</option>
                                            <option value="CLINICAL">Clinical / Nursing</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-text-secondary">Frequency</label>
                                        <input name="frequency" className="input" placeholder="e.g. Every Visit, Weekly" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-8">
                                    <button type="button" onClick={() => setIsTaskModalOpen(false)} className="btn-outline border-transparent hover:bg-surface-highlight">Cancel</button>
                                    <button type="submit" className="btn-primary">Add Task</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
