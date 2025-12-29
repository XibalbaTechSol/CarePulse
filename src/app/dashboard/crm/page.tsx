'use client';

import React from 'react';
import NordCrmKanban from '@/components/crm/NordCrmKanban';

export default function CRMDashboard() {
    return (
        <div style={{ height: 'calc(100vh - 60px)' }}> {/* Adjusted height for new header */}
            <NordCrmKanban />
        </div>
    );
}
