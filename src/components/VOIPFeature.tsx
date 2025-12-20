import Link from 'next/link';

export default function VOIPFeature() {
    return (
        <section id="voip" style={{
            padding: '100px 2rem',
            background: 'linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.05), transparent)',
        }}>
            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '4rem',
                alignItems: 'center'
            }}>
                <div className="fade-in" style={{ order: 2 }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: 'var(--accent-glow)',
                        color: 'var(--accent)',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        border: '1px solid var(--glass-border)'
                    }}>
                        COMMUNICATIONS
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        marginBottom: '1.5rem',
                        lineHeight: '1.2'
                    }}>
                        Business VoIP <br />
                        <span style={{ color: 'var(--accent)' }}>Redefined</span>
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        marginBottom: '2rem'
                    }}>
                        Experience crystal-clear HD voice and video calls from anywhere. Our cloud-based phone system integrates seamlessly with your favorite business apps, complete with AI-powered meeting summaries.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {[
                            { title: 'Global Coverage', desc: 'Enterprise voice in 100+ countries' },
                            { title: 'AI Transcription', desc: 'Never miss a detail with live notes' }
                        ].map((item, i) => (
                            <div key={i}>
                                <h4 style={{ marginBottom: '0.25rem', color: 'var(--text-main)' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <Link href="/dashboard/phone">
                        <button className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--accent), #3b82f6)' }}>
                            Explore VoIP Features
                        </button>
                    </Link>
                </div>

                <div className="fade-in" style={{ position: 'relative', order: 1 }}>
                    {/* Mock UI - Meeting Interface */}
                    <div className="glass" style={{
                        padding: '1.5rem',
                        minHeight: '320px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>JD</div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Weekly Strategy Sync</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>● Live • 12:45</div>
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="glass" style={{ background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👤</div>
                            <div className="glass" style={{ background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👥</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', paddingTop: '1rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎤</div>
                            <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📹</div>
                            <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📞</div>
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
                        background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
                        zIndex: 0,
                        opacity: 0.4
                    }} />
                </div>
            </div>
        </section>
    );
}
