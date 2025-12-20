'use client';

import React from 'react';
import { createClient } from '@/lib/actions/crm';
import { useRouter } from 'next/navigation';

export default function AddClientPage() {
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const result = await createClient(formData);
        if (result.success) {
            router.push('/dashboard/crm');
        } else {
            alert(result.error);
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Client</h1>
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                            <input name="firstName" required className="w-full p-2 rounded-lg border dark:bg-[#111a22] dark:border-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                            <input name="lastName" required className="w-full p-2 rounded-lg border dark:bg-[#111a22] dark:border-gray-700 dark:text-white" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input name="email" type="email" className="w-full p-2 rounded-lg border dark:bg-[#111a22] dark:border-gray-700 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                        <input name="phone" className="w-full p-2 rounded-lg border dark:bg-[#111a22] dark:border-gray-700 dark:text-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                            <input name="dateOfBirth" type="date" className="w-full p-2 rounded-lg border dark:bg-[#111a22] dark:border-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Medicaid ID</label>
                            <input name="medicaidId" className="w-full p-2 rounded-lg border dark:bg-[#111a22] dark:border-gray-700 dark:text-white" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                        <input name="address" className="w-full p-2 rounded-lg border dark:bg-[#111a22] dark:border-gray-700 dark:text-white" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                            <input name="city" className="w-full p-2 rounded-lg border dark:bg-[#111a22] dark:border-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                            <input name="state" className="w-full p-2 rounded-lg border dark:bg-[#111a22] dark:border-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zip</label>
                            <input name="zip" className="w-full p-2 rounded-lg border dark:bg-[#111a22] dark:border-gray-700 dark:text-white" />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => router.back()} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Create Client
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
