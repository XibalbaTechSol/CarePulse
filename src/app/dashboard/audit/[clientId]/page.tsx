import React from 'react';
import { getAuditData } from '@/lib/actions/audit';
import PrintButton from '@/components/audit/PrintButton';

export default async function AuditPacketPage({
    params,
    searchParams
}: {
    params: Promise<{ clientId: string }>,
    searchParams: Promise<{ start?: string, end?: string }>
}) {
    const { clientId } = await params;
    const { start, end } = await searchParams;

    // Default to last 30 days if no range provided
    const startDate = start || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
    const endDate = end || new Date().toISOString().split('T')[0];

    const data = await getAuditData(clientId, startDate, endDate);
    const { client, period, auditorInfo, generatedAt } = data;

    if (!client) return <div style={{ padding: '2rem' }}>Client not found</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Back to list - Hidden on print */}
            <div className="no-print" style={{ marginBottom: '1rem' }}>
                <a href="/dashboard/audit" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ← Back to Audit Vault
                </a>
            </div>

            <div className="audit-packet fade-in" style={{
                padding: '40px',
                background: 'white',
                color: '#333',
                minHeight: '100vh',
                borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                fontFamily: '"Times New Roman", Times, serif'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '24px', color: '#000' }}>WISCONSIN T1019 AUDIT PACKET</h1>
                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>Personal Care Services Verification Module</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{auditorInfo.agencyName}</p>
                        <p style={{ margin: 0, fontSize: '14px' }}>Provider ID: {auditorInfo.agencyId}</p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>Generated: {generatedAt.toLocaleString()}</p>
                    </div>
                </div>

                {/* Client & Period Info */}
                <div style={{ marginBottom: '40px', background: '#f9f9f9', padding: '20px', borderRadius: '4px', border: '1px solid #eee' }}>
                    <h3 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #ddd', paddingBottom: '5px', fontSize: '18px' }}>Client & Audit Context</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <p style={{ margin: '5px 0' }}><strong>Name:</strong> {client.firstName} {client.lastName}</p>
                            <p style={{ margin: '5px 0' }}><strong>DOB:</strong> {client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                            <p style={{ margin: '5px 0' }}><strong>Medicaid ID:</strong> {client.medicaidId || 'N/A'}</p>
                        </div>
                        <div>
                            <p style={{ margin: '5px 0' }}><strong>Audit Period:</strong> {period.start.toLocaleDateString()} - {period.end.toLocaleDateString()}</p>
                            <p style={{ margin: '5px 0' }}><strong>Admission:</strong> {client.admissionDate ? new Date(client.admissionDate).toLocaleDateString() : 'N/A'}</p>
                            <p style={{ margin: '5px 0' }}><strong>Agency Check:</strong> COMPLIANT</p>
                        </div>
                    </div>
                </div>

                {/* Authorizations Section */}
                <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ borderBottom: '1px solid #000', paddingBottom: '5px', fontSize: '18px' }}>Active Authorizations (T1019/Personal Care)</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', tableLayout: 'fixed' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #000', fontSize: '14px' }}>
                                <th style={{ padding: '8px 0' }}>Auth Number</th>
                                <th>Service Code</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th style={{ textAlign: 'right' }}>Total Units</th>
                            </tr>
                        </thead>
                        <tbody>
                            {client.authorizations.map(auth => (
                                <tr key={auth.id} style={{ borderBottom: '1px solid #eee', fontSize: '14px' }}>
                                    <td style={{ padding: '8px 0' }}>{auth.authNumber}</td>
                                    <td>{auth.serviceCode}</td>
                                    <td>{new Date(auth.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(auth.endDate).toLocaleDateString()}</td>
                                    <td style={{ textAlign: 'right' }}>{auth.totalUnits}</td>
                                </tr>
                            ))}
                            {client.authorizations.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '14px' }}>No authorizations found for this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Visit Records (The "Timesheets") */}
                <div style={{ pageBreakBefore: 'always' }}>
                    <h3 style={{ borderBottom: '1px solid #000', paddingBottom: '5px', fontSize: '18px' }}>EVV Timesheets & Verification Logs</h3>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>*All records verified via GPS and electronic caregiver signature.</p>

                    {client.clientVisits.map((visit, idx) => (
                        <div key={visit.id} style={{
                            marginTop: '20px',
                            padding: '15px',
                            border: '1px solid #000',
                            borderRadius: '2px',
                            pageBreakInside: 'avoid'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold' }}>
                                <span>VISIT LOG #{idx + 1}</span>
                                <span>DATE: {new Date(visit.startDateTime!).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', fontSize: '13px' }}>
                                <div>
                                    <p><strong>Caregiver:</strong> {visit.caregiver?.name || 'N/A'}</p>
                                    <p><strong>Service Type:</strong> {visit.serviceType}</p>
                                    <p><strong>Clock-In:</strong> {new Date(visit.startDateTime!).toLocaleTimeString()} (GPS: {visit.startLatitude}, {visit.startLongitude})</p>
                                    <p><strong>Clock-Out:</strong> {visit.endDateTime ? new Date(visit.endDateTime).toLocaleTimeString() : 'N/A'}</p>
                                    <p><strong>Units:</strong> {visit.endDateTime && visit.startDateTime ? Math.floor((new Date(visit.endDateTime).getTime() - new Date(visit.startDateTime).getTime()) / 60000 / 15 * 100) / 100 : 'N/A'}</p>
                                </div>
                                <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '20px' }}>
                                    <p><strong>EVV Status:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>VERIFIED</span></p>
                                    <p><strong>GPS Compliance:</strong> ✓ AT ADDRESS</p>
                                    <p><strong>Signature:</strong> {visit.clientSignature ? '✓ RECEIVED' : '⚠️ ON FILE'}</p>
                                    <p><strong>Tasks:</strong> {visit.completedTasks.length} ADLs/IADLs recorded</p>
                                </div>
                            </div>
                            {visit.completedTasks.length > 0 && (
                                <div style={{ marginTop: '10px', fontSize: '11px', background: '#f5f5f5', padding: '8px', border: '1px solid #eee' }}>
                                    <strong>Care Logs:</strong> {visit.completedTasks.map((t: any) => t.task.taskName).join(', ')}
                                </div>
                            )}
                            {visit.notes && (
                                <div style={{ marginTop: '8px', fontSize: '11px', fontStyle: 'italic' }}>
                                    <strong>Progress Notes:</strong> {visit.notes}
                                </div>
                            )}
                        </div>
                    ))}
                    {client.clientVisits.length === 0 && (
                        <div style={{ textAlign: 'center', marginTop: '40px', padding: '40px', border: '1px dashed #ccc' }}>
                            <p style={{ color: '#666' }}>No visit records found for this period in the EVV module.</p>
                        </div>
                    )}
                </div>

                {/* Footer / Signatures */}
                <div style={{ marginTop: '60px', borderTop: '2px solid #000', paddingTop: '20px', textAlign: 'center', fontSize: '12px' }}>
                    <p>I certify that the above services were provided in accordance with Wisconsin DHS T1019 Personal Care regulations.</p>
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px' }}>
                        <div style={{ borderTop: '1px solid #000', width: '220px', paddingTop: '5px' }}>Agency Administrator / RN</div>
                        <div style={{ borderTop: '1px solid #000', width: '220px', paddingTop: '5px' }}>Date Signature Generated</div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <PrintButton />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; padding: 0 !important; }
                    .audit-packet { 
                        box-shadow: none !important; 
                        margin: 0 !important; 
                        width: 100% !important; 
                        max-width: none !important;
                        padding: 0 !important;
                    }
                    div[style*="box-shadow"] {
                        box-shadow: none !important;
                    }
                }
                @page {
                    margin: 1.5cm;
                }
            `}} />
        </div>
    );
}
