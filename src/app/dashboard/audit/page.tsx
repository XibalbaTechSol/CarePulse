import React from 'react';
import Link from 'next/link';
import { getClientsForAudit } from '@/lib/actions/audit';

export default async function AuditVaultPage() {
    const clients = await getClientsForAudit();

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>T1019 Audit Vault</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Generate &quot;Single Client Audit Packets&quot; for Wisconsin Medicaid audits.
                </p>
            </div>

            <div className="glass" style={{ overflow: 'x-auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Client Name</th>
                            <th style={{ padding: '1rem' }}>Visits</th>
                            <th style={{ padding: '1rem' }}>Auths</th>
                            <th style={{ padding: '1rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>{client.firstName} {client.lastName}</td>
                                <td style={{ padding: '1rem' }}>{client._count.clientVisits}</td>
                                <td style={{ padding: '1rem' }}>{client._count.authorizations}</td>
                                <td style={{ padding: '1rem' }}>
                                    <Link href={`/dashboard/audit/${client.id}`} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                                        Open Audit Vault
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {clients.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No active clients found. Ensure clients are marked as CUSTOMER in the CRM.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Audit Tips */}
            <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px dashed var(--glass-border)', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>🛡️ Wisconsin Audit Tips</h3>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    <li>Ensure all T1019 timesheets have caregiver and client signatures.</li>
                    <li>Verify that GPS coordinates match the client&apos;s home address within 500 feet.</li>
                    <li>Cross-reference visit starts with Authorization start dates.</li>
                </ul>
            </div>
        </div>
    );
}
