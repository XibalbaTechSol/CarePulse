
'use client';

import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, CheckCircle2, TrendingUp, Info } from 'lucide-react';

interface Insight {
    type: 'risk' | 'status' | 'recommendation';
    message: string;
    level: 'high' | 'medium' | 'low';
}

interface PatientAiOverviewProps {
    contactId: string;
    patientName: string;
}

export default function PatientAiOverview({ contactId, patientName }: PatientAiOverviewProps) {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking AI Insight Generation
        // In reality, this would fetch patient history and use clinicalReasoning AI service
        setTimeout(() => {
            setInsights([
                {
                    type: 'risk',
                    message: "High risk of fall detected based on recent mobility decline in care logs.",
                    level: 'high'
                },
                {
                    type: 'status',
                    message: "Blood pressure trends show stabilization over the last 14 days.",
                    level: 'low'
                },
                {
                    type: 'recommendation',
                    message: "Consider adjusting physical therapy frequency to support balance recovery.",
                    level: 'medium'
                }
            ]);
            setLoading(false);
        }, 1200);
    }, [contactId]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'risk': return <AlertCircle size={18} color="#ef4444" />;
            case 'status': return <CheckCircle2 size={18} color="#22c55e" />;
            case 'recommendation': return <TrendingUp size={18} color="var(--primary)" />;
            default: return <Info size={18} />;
        }
    };

    return (
        <div className="glass" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <div style={{ padding: '8px', background: 'rgba(var(--primary-rgb), 0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
                    <Brain size={20} />
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>AI Patient Insights</h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Continuous clinical analysis for {patientName}</p>
                </div>
            </div>

            {loading ? (
                <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="animate-pulse" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Analyzing clinical history...</div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {insights.map((insight, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '1rem',
                            background: insight.level === 'high' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.02)',
                            borderRadius: '10px',
                            border: `1px solid ${insight.level === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'var(--glass-border)'}`
                        }}>
                            <div style={{ marginTop: '2px' }}>{getIcon(insight.type)}</div>
                            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5', color: insight.level === 'high' ? '#fca5a5' : 'var(--text-main)' }}>
                                {insight.message}
                            </p>
                        </div>
                    ))}

                    <button style={{
                        marginTop: '0.5rem',
                        padding: '8px',
                        background: 'transparent',
                        border: '1px dashed var(--glass-border)',
                        color: 'var(--text-muted)',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                    }}>
                        View Full Clinical Reasoning Report
                    </button>
                </div>
            )}
        </div>
    );
}
