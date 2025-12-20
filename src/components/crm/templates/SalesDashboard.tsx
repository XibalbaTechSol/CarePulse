import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, Activity, Table as TableIcon, Kanban, BarChart2 } from 'lucide-react';
import PipelineBoard from '../PipelineBoard';
import GanttView from '../GanttView';

const DEALS = [
    { id: '1', title: 'Enterprise License', company: 'Acme Corp', stage: 'Negotiation', value: '$12,000', owner: 'Alice', startDate: '2023-11-01', endDate: '2023-12-15' },
    { id: '2', title: 'Support Contract', company: 'Globex', stage: 'Qualification', value: '$5,500', owner: 'Bob', startDate: '2023-11-10', endDate: '2023-11-30' },
    { id: '3', title: 'Product Launch', company: 'Soylent Corp', stage: 'Proposal', value: '$8,200', owner: 'Alice', startDate: '2023-11-05', endDate: '2023-12-01' },
    { id: '4', title: 'SaaS Subscription', company: 'Initech', stage: 'Prospecting', value: '$2,100', owner: 'Charlie', startDate: '2023-11-20', endDate: '2023-12-20' },
    { id: '5', title: 'Global Rollout', company: 'Massive Dynamic', stage: 'Negotiation', value: '$45,000', owner: 'Sarah', startDate: '2023-10-15', endDate: '2024-01-10' },
];

export default function SalesDashboard() {
    const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'gantt'>('table');

    return (
        <div className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass p-6 text-card-foreground">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Total Revenue</span>
                        <DollarSign size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$72,800.00</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+20.1% from last month</div>
                </div>
                <div className="glass p-6 text-card-foreground">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Active Leads</span>
                        <Users size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>+124</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+12% from last month</div>
                </div>
                <div className="glass p-6 text-card-foreground">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Active Deals</span>
                        <TrendingUp size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{DEALS.length}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Currently in pipeline</div>
                </div>
                <div className="glass p-6 text-card-foreground">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Win Rate</span>
                        <Activity size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>24%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+4% from last month</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Opportunities</h3>

                <div className="glass" style={{ display: 'flex', gap: '4px', padding: '4px' }}>
                    <button
                        onClick={() => setViewMode('table')}
                        style={{ padding: '8px', borderRadius: '6px', background: viewMode === 'table' ? 'var(--primary)' : 'transparent', color: viewMode === 'table' ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
                        title="Table View"
                    >
                        <TableIcon size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('kanban')}
                        style={{ padding: '8px', borderRadius: '6px', background: viewMode === 'kanban' ? 'var(--primary)' : 'transparent', color: viewMode === 'kanban' ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
                        title="Kanban Board"
                    >
                        <Kanban size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('gantt')}
                        style={{ padding: '8px', borderRadius: '6px', background: viewMode === 'gantt' ? 'var(--primary)' : 'transparent', color: viewMode === 'gantt' ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
                        title="Gantt Chart"
                    >
                        <BarChart2 size={18} style={{ transform: 'rotate(90deg)' }} />
                    </button>
                </div>
            </div>

            {viewMode === 'table' && (
                <div className="glass" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Company</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Opportunity</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Stage</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Value</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Owner</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Timeline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DEALS.map((opp) => (
                                <tr key={opp.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '0.75rem' }}>{opp.company}</td>
                                    <td style={{ padding: '0.75rem' }}>{opp.title}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent)' }}>
                                            {opp.stage}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>{opp.value}</td>
                                    <td style={{ padding: '0.75rem' }}>{opp.owner}</td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{opp.startDate} → {opp.endDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {viewMode === 'kanban' && <PipelineBoard deals={DEALS} />}

            {viewMode === 'gantt' && <GanttView deals={DEALS} />}

        </div>
    );
}
