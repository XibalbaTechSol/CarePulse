import React from 'react';
import { getPDFTemplates } from '@/lib/actions/pdf';
import { sql } from '@/lib/db-sql';
import FormsManager from '@/components/forms/FormsManager';

export default async function FormsDashboard() {
    const templates = await getPDFTemplates();
    const contacts = sql.all<any>(`SELECT id, firstName, lastName FROM Contact ORDER BY lastName ASC`);

    return (
        <div className="fade-in h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Forms & Authorization Center</h1>
                <p className="text-gray-400">
                    Manage and fill PDF forms. Right-click fields to autofill client data.
                </p>
            </div>
            
            <FormsManager templates={templates} contacts={contacts} />
        </div>
    );
}