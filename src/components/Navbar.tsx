import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '1200px',
            padding: '0.75rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <div className="brand-font" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                Nextiva<span style={{ color: 'var(--text-main)' }}>Clone</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link href="/#crm" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>CRM</Link>
                <Link href="/#voip" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>VoIP</Link>
                <Link href="/#fax" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Digital Fax</Link>
                <Link href="/dashboard">
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Get Started</button>
                </Link>
            </div>
        </nav>
    );
}
