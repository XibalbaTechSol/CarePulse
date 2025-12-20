'use client';

import React from 'react';
import { Factory, Truck, Box, AlertTriangle } from 'lucide-react';

export default function ManufacturingDashboard() {
    return (
        <div className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass p-6 text-card-foreground">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Production Output</span>
                        <Factory size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>98.2%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Goal: 95%</div>
                </div>
                <div className="glass p-6 text-card-foreground">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Active Shipments</span>
                        <Truck size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>154</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>12 delayed</div>
                </div>
                <div className="glass p-6 text-card-foreground">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Inventory Value</span>
                        <Box size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$4.2M</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Low stock items: 5</div>
                </div>
                <div className="glass p-6 text-card-foreground">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Equipment Alerts</span>
                        <AlertTriangle size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>3</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Maintenance required</div>
                </div>
            </div>

            <div className="glass" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>Active Production Orders</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Order ID</th>
                            <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Product</th>
                            <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Quantity</th>
                            <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { id: 'PO-2024-001', product: 'Widget X-100', quantity: '5000', status: 'In Progress' },
                            { id: 'PO-2024-002', product: 'Gadget Y-20', quantity: '1200', status: 'In Progress' },
                            { id: 'PO-2024-003', product: 'Component Z', quantity: '10000', status: 'Scheduled' },
                            { id: 'PO-2024-004', product: 'Widget X-200', quantity: '3000', status: 'Quality Check' },
                        ].map((order, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '0.75rem' }}>{order.id}</td>
                                <td style={{ padding: '0.75rem' }}>{order.product}</td>
                                <td style={{ padding: '0.75rem' }}>{order.quantity}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent)' }}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
