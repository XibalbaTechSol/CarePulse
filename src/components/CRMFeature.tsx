import Link from 'next/link';

export default function CRMFeature() {
    return (
        <section id="crm" style={{
            padding: '100px 2rem',
            background: 'linear-gradient(to bottom, transparent, rgba(37, 99, 235, 0.05), transparent)',
        }}>
            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '4rem',
                alignItems: 'center'
            }}>
                <div className="fade-in">
                    <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: 'var(--primary-glow)',
                        color: 'var(--accent)',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        border: '1px solid var(--glass-border)'
                    }}>
                        SALES CLOUD
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        marginBottom: '1.5rem',
                        lineHeight: '1.2'
                    }}>
                        Customer Relationship <br />
                        <span style={{ color: 'var(--primary)' }}>Management</span>
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        marginBottom: '2rem'
                    }}>
                        Stop losing leads in spreadsheets. Our integrated CRM helps you track every interaction, manage your pipeline, and close deals faster with data-driven insights.
                    </p>
                    <ul style={{
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        marginBottom: '2.5rem'
                    }}>
                        {[
                            'Lead Scoring & Prioritization',
                            'Automated Sales Pipelines',
                            'Real-time Performance Analytics'
                        ].map((item, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ color: 'var(--success)' }}>✓</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <Link href="/dashboard/crm">
                        <button className="btn-primary">Learn about CRM</button>
                    </Link>
                </div>

                <div className="fade-in" style={{ position: 'relative' }}>
                    {/* Mock UI */}
                    <div className="glass" style={{
                        padding: '1.5rem',
                        minHeight: '300px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        position: 'relative',
                        zIndex: 1,
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                            <div style={{ fontWeight: 'bold' }}>Sales Pipeline</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>This Month</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { label: 'Prospecting', val: 75, color: 'var(--primary)' },
                                { label: 'Proposal', val: 45, color: 'var(--accent)' },
                                { label: 'Negotiation', val: 30, color: 'var(--success)' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <span>{item.label}</span>
                                        <span>{item.val}%</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${item.val}%`, height: '100%', background: item.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="glass" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Revenue</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>$42.5k</div>
                            </div>
                            <div className="glass" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Active Deals</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>18</div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative glow */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '120%',
                        height: '120%',
                        background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
                        zIndex: 0,
                        opacity: 0.5
                    }} />
                </div>
            </div>
        </section>
    );
}
