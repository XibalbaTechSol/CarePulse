'use client';

import React, { useEffect, useState } from 'react';
import { getUser, uploadEmployeeDocument } from '@/lib/actions/admin';
import {
    User,
    FileText,
    Shield,
    Mail,
    Phone,
    Upload,
    CheckCircle
} from 'lucide-react';

export default function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        try {
            const data = await getUser(id);
            setEmployee(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(type: string) {
        setUploading(true);
        const formData = new FormData();
        formData.append('type', type);
        await uploadEmployeeDocument(id, formData);
        await loadData();
        setUploading(false);
    }

    if (loading) return <div className="p-8">Loading profile...</div>;
    if (!employee) return <div className="p-8">Employee not found</div>;

    const w2Docs = employee.documents.filter((d: any) => d.name.startsWith('W2'));
    const i9Docs = employee.documents.filter((d: any) => d.name.startsWith('I9'));

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                    {employee.name?.[0] || '?'}
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{employee.name}</h1>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <Mail size={16} />
                            {employee.email}
                        </div>
                        <div className="flex items-center gap-1">
                            <Shield size={16} />
                            {employee.role}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employment Documents */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="text-blue-500" size={20} />
                        Employment Documents
                    </h3>

                    <div className="space-y-6">
                        {/* W2 Section */}
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#111a22] border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">W-2 Form</h4>
                                    <p className="text-xs text-text-muted">Wage and Tax Statement</p>
                                </div>
                                {w2Docs.length > 0 ? (
                                    <span className="text-emerald-500 flex items-center gap-1 text-xs font-bold">
                                        <CheckCircle size={14} /> Uploaded
                                    </span>
                                ) : (
                                    <span className="text-amber-500 text-xs font-bold">Pending</span>
                                )}
                            </div>

                            {w2Docs.length > 0 && (
                                <div className="mb-3">
                                    {w2Docs.map((doc: any) => (
                                        <div key={doc.id} className="text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                                            <FileText size={14} /> {doc.name}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => handleUpload('W2')}
                                disabled={uploading}
                                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <Upload size={16} />
                                {uploading ? 'Uploading...' : 'Upload W-2'}
                            </button>
                        </div>

                        {/* I9 Section */}
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#111a22] border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">I-9 Form</h4>
                                    <p className="text-xs text-text-muted">Employment Eligibility Verification</p>
                                </div>
                                {i9Docs.length > 0 ? (
                                    <span className="text-emerald-500 flex items-center gap-1 text-xs font-bold">
                                        <CheckCircle size={14} /> Uploaded
                                    </span>
                                ) : (
                                    <span className="text-amber-500 text-xs font-bold">Pending</span>
                                )}
                            </div>

                            {i9Docs.length > 0 && (
                                <div className="mb-3">
                                    {i9Docs.map((doc: any) => (
                                        <div key={doc.id} className="text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                                            <FileText size={14} /> {doc.name}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => handleUpload('I9')}
                                disabled={uploading}
                                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <Upload size={16} />
                                {uploading ? 'Uploading...' : 'Upload I-9'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Other Details Placeholder */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Certifications</h3>
                    <div className="text-center text-gray-500 py-8">
                        <Shield size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Certifications management coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
