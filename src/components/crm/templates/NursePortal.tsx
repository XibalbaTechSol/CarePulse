'use client';

import React from 'react';
import { ClipboardList, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react';

export default function NursePortal() {
    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Nurse Portal: My Care Visits</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="glass p-6" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>John Doe</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Initial Assessment Due</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Priority</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <MapPin size={14} /> 123 Maple St, Springfield
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                        <Clock size={14} /> Today, 02:00 PM
                    </div>
                    <button className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <ClipboardList size={16} /> Start Assessment
                    </button>
                </div>

                <div className="glass p-6">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Jane Roe</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Routine Visit / ADL Tracking</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Scheduled</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <MapPin size={14} /> 456 Oak Ave, Shelbyville
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                        <Clock size={14} /> Today, 04:30 PM
                    </div>
                    <button className="btn-ghost" style={{ width: '100%', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={16} /> Mark Visit Completed
                    </button>
                </div>
            </div>

            <div className="glass" style={{ marginTop: '2.5rem', padding: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <AlertCircle size={20} className="text-warning" /> Pending Documents (3)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <span>Richard Miles - Recertification Assessment</span>
                        <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>Overdue 3 days</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <span>Sarah Connor - Care Plan Signature Required</span>
                        <span style={{ color: 'var(--warning)', fontSize: '0.8rem' }}>Due Tomorrow</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
