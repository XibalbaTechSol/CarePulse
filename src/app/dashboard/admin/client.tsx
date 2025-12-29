'use client';

import React, { useState } from 'react';
import { createUserAction } from '@/lib/actions/admin';
import Link from 'next/link';
import { UserPlus, Search, ArrowRight, Activity, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmployeesClient({ initialUsers }: { initialUsers: { id: string; name: string; email: string; role: string }[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const router = useRouter();

    const filteredUsers = initialUsers.filter(user => {
        const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Employees</h1>
                    <p className="text-text-secondary text-sm mt-1">Manage your agency staff, nurses, and caregivers.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary"
                >
                    <UserPlus size={18} />
                    <span>Add Employee</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="card">
                        {/* ... table content remains same ... */}
                        <div className="p-4 border-b border-border flex gap-4 items-center bg-surface-highlight/30">
                            <div className="relative max-w-sm w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    className="input pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className="input max-w-[150px]"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="ALL">All Roles</option>
                                <option value="ADMIN">Admin</option>
                                <option value="NURSE">Nurse</option>
                                <option value="CAREGIVER">Caregiver</option>
                                <option value="OFFICE">Office Staff</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-surface-highlight border-b border-border">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-text-primary uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-text-primary uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-text-primary uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-text-primary uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-text-primary uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-text-tertiary text-sm italic">
                                                No employees match your search criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map(user => (
                                            <tr key={user.id} className="hover:bg-surface-highlight transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-surface">
                                                            {user.name?.[0] || '?'}
                                                        </div>
                                                        <Link href={`/dashboard/admin/users/${user.id}`} className="text-sm font-medium text-text-primary hover:text-primary transition-colors">
                                                            {user.name || 'N/A'}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${user.role === 'ADMIN' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                                                        user.role === 'NURSE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                            user.role === 'CAREGIVER' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                'bg-gray-50 text-gray-700 border-gray-200'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="size-2 rounded-full bg-success"></div>
                                                        <span className="text-xs font-medium text-text-secondary">Active</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <Link href={`/dashboard/admin/users/${user.id}`} className="p-2 text-text-tertiary hover:text-primary hover:bg-primary/5 rounded-full inline-block transition-colors">
                                                        <ArrowRight size={16} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="card p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity size={18} className="text-primary" />
                            <h2 className="text-sm font-semibold text-text-primary">System Activity</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { action: 'New user created', time: '5m ago', user: 'Admin' },
                                { action: 'Role updated: Jane D.', time: '1h ago', user: 'Admin' },
                                { action: 'Inventory alert resolved', time: '2h ago', user: 'System' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-1.5 h-full bg-border rounded-full" />
                                    <div>
                                        <p className="text-xs font-medium text-text-primary">{item.action}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-text-tertiary flex items-center gap-1"><Clock size={10} /> {item.time}</span>
                                            <span className="text-[10px] text-text-tertiary font-bold px-1.5 py-0.5 bg-surface-highlight rounded uppercase tracking-tighter">{item.user}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="card w-full max-w-md bg-surface shadow-xl">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-xl font-semibold text-text-primary">Add New Employee</h2>
                        </div>
                        <div className="p-6">
                            <form action={async (formData) => {
                                await createUserAction(formData);
                                setIsModalOpen(false);
                                router.refresh();
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-text-secondary">Full Name</label>
                                        <input name="name" type="text" className="input" required placeholder="e.g. Jane Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-text-secondary">Email</label>
                                        <input name="email" type="email" className="input" required placeholder="jane@company.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-text-secondary">Role</label>
                                        <select name="role" className="input">
                                            <option value="CAREGIVER">Caregiver</option>
                                            <option value="NURSE">Nurse</option>
                                            <option value="OFFICE">Office Staff</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-8">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline border-transparent hover:bg-surface-highlight">Cancel</button>
                                    <button type="submit" className="btn-primary">Create Employee</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
