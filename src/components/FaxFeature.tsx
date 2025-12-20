import Link from 'next/link';

export default function FaxFeature() {
    return (
        <section id="fax" style={{
            padding: '100px 2rem',
            background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.05), transparent)',
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
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: 'var(--primary)',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        border: '1px solid var(--glass-border)'
                    }}>
                        RELIABLE FAX
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        marginBottom: '1.5rem',
                        lineHeight: '1.2'
                    }}>
                        Modern <br />
                        <span style={{ color: 'var(--primary)' }}>Digital Faxing</span>
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        marginBottom: '2rem'
                    }}>
                        Goodbye, legacy machines. Send and receive faxes electronically with enterprise-grade security. Fully compatible with SRFax and Nextiva API ecosystems for seamless integration into your existing workflows.
                    </p>
                    {[
                        { title: 'API Driven', desc: 'Direct integration with SRFax and Nextiva SDKs' },
                        { title: 'Secure & Compliant', desc: 'HIPAA and SOC2 ready cloud storage' },
                        { title: 'Universal Access', desc: 'Manage faxes from any device or email' }
                    ].map((item, i) => (
                        <div key={i} style={{ marginBottom: '1.25rem' }}>
                            <h4 style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>{item.title}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.desc}</p>
                        </div>
                    ))}
                    <Link href="/dashboard/fax">
                        <button className="btn-primary" style={{ marginTop: '1rem' }}>Get Started with Fax</button>
                    </Link>
                </div>

                <div className="fade-in" style={{ position: 'relative' }}>
                    {/* Mock UI - Fax Inbox */}
                    <div className="glass" style={{
                        padding: '1.5rem',
                        minHeight: '340px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontWeight: 'bold' }}>Fax Inbox</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer' }}>+ Send Fax</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--glass-border)' }}>
                            {[
                                { from: '1-800-SRFAX-XX', date: 'Today, 10:30 AM', status: 'Received' },
                                { from: '1-555-NEXTIVA', date: 'Yesterday, 4:15 PM', status: 'Sent' },
                                { from: '1-888-999-XXXX', date: 'Dec 15, 9:00 AM', status: 'Failed', color: 'var(--error)' },
                            ].map((fax, i) => (
                                <div key={i} className="glass-hover" style={{
                                    padding: '1rem',
                                    background: 'var(--bg-dark)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.85rem'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '500' }}>{fax.from}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fax.date}</div>
                                    </div>
                                    <div style={{ color: fax.color || 'var(--success)', fontSize: '0.7rem' }}>
                                        {fax.status}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Storage Usage</div>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                                <div style={{ width: '65%', height: '100%', background: 'var(--primary)' }} />
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
                        opacity: 0.3
                    }} />
                </div>
            </div>
        </section>
    );
}
