import Link from 'next/link';

export default function Hero() {
    return (
        <section className="fade-in" style={{
            padding: '160px 2rem 80px',
            textAlign: 'center',
            background: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 50%)',
        }}>
            <div className="container">
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                    lineHeight: '1.1',
                    marginBottom: '1.5rem',
                    fontWeight: '800',
                }}>
                    Communication <br />
                    <span style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Evolved
                    </span>
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-muted)',
                    maxWidth: '700px',
                    margin: '0 auto 2.5rem',
                    lineHeight: '1.6',
                }}>
                    An all-in-one business solution providing custom CRM, VoIP phone systems, and digital fax to scale your enterprise seamlessly.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/dashboard">
                        <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
                            Launch Dashboard
                        </button>
                    </Link>
                    <Link href="#crm">
                        <button className="glass glass-hover" style={{
                            padding: '14px 32px',
                            fontSize: '1.1rem',
                            color: 'var(--text-main)',
                            cursor: 'pointer'
                        }}>
                            Watch Demo
                        </button>
                    </Link>
                </div>

                <div style={{
                    marginTop: '80px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem',
                }}>
                    <div className="glass glass-hover" style={{ padding: '2rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Integrated CRM</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}> Manage leads, track deals, and automate your sales pipeline in one place.</p>
                    </div>
                    <div className="glass glass-hover" style={{ padding: '2rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📞</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Smart VoIP</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Cloud-based phone system with AI transcription, call recording, and team chat.</p>
                    </div>
                    <div className="glass glass-hover" style={{ padding: '2rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📠</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Digital Fax</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Send and receive faxes electronically with secure cloud storage and email integration.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
