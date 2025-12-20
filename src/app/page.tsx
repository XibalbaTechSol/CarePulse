import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CRMFeature from '@/components/CRMFeature';
import VOIPFeature from '@/components/VOIPFeature';
import FaxFeature from '@/components/FaxFeature';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: -1,
      }} />
      <Navbar />
      <Hero />

      {/* Feature Sections */}
      <CRMFeature />
      <VOIPFeature />
      <FaxFeature />

      <footer className="container" style={{
        padding: '60px 0 40px',
        borderTop: '1px solid var(--glass-border)',
        textAlign: 'center',
        color: 'var(--text-muted)'
      }}>
        <p>&copy; 2024 Nextiva Clone. All rights reserved.</p>
      </footer>
    </main>
  );
}
