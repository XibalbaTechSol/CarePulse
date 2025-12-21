import React from 'react';
import { getOrganizationUsers } from '@/lib/actions/admin';
import EmployeesClient from './client';

export default async function EmployeesPage() {
    const users = await getOrganizationUsers();

    return <EmployeesClient initialUsers={users} />;
}
