'use client';

import React from 'react';
import CrmKanban from '@/components/crm/CrmKanban';

export default function CRMDashboard() {
    return (
        <div style={{ height: 'calc(100vh - 100px)' }}>
            <CrmKanban />
        </div>
    );
}
