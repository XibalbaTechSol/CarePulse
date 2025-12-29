import { SipProvider } from '@/lib/contexts/SipContext';
import FloatingDialer from '@/components/voip/FloatingDialer';
import { sql } from '@/lib/db-sql';
import { getCurrentUser } from '@/lib/auth';
import { decrypt } from '@/lib/encryption';
import DashboardShell from '@/components/DashboardShell';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) return null;

    const modules = sql.get<any>(`SELECT * FROM ModuleConfig WHERE organizationId = ?`, [user.organizationId || 'default']);

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: '🏠', enabled: true },
        { name: 'Intake Manager', href: '/dashboard/crm/intake', icon: '📋', enabled: modules?.crmEnabled ?? true },
        { name: 'Authorizations & POC', href: '/dashboard/crm/authorizations', icon: '📜', enabled: modules?.crmEnabled ?? true },
        { name: 'Care Coordination', href: '/dashboard/crm/coordination', icon: '🤝', enabled: modules?.crmEnabled ?? true },
        { name: 'Patient Scheduling', href: '/dashboard/scheduling/patient', icon: '🗓️', enabled: true },
        { name: 'Schedule Monitor', href: '/dashboard/scheduling/monitor', icon: '👁️', enabled: true },
        { name: 'Clinical POC', href: '/dashboard/clinical', icon: '👨‍⚕️', enabled: true },
        { name: 'Specialty Care', href: '/dashboard/specialty', icon: '⭐', enabled: true },
        { name: 'Beds Management', href: '/dashboard/beds', icon: '🛏️', enabled: true },
        { name: 'Emergency Dept', href: '/dashboard/ed', icon: '🚑', enabled: true },
        { name: 'Surgical/OR', href: '/dashboard/or', icon: '😷', enabled: true },
        { name: 'Laboratory (LIS)', href: '/dashboard/lis', icon: '🧪', enabled: true },
        { name: 'Radiology', href: '/dashboard/radiology', icon: '☢️', enabled: true },
        { name: 'Pharmacy', href: '/dashboard/pharmacy', icon: '💊', enabled: true },
        { name: 'EVV Tracker', href: '/dashboard/evv', icon: '📍', enabled: modules?.evvEnabled ?? true },
        { name: 'RPM Monitor', href: '/dashboard/rpm', icon: '💓', enabled: true },
        { name: 'Billing & AR', href: '/dashboard/billing', icon: '💳', enabled: (modules as any)?.billingEnabled ?? modules?.crmEnabled ?? true },
        { name: 'Payroll', href: '/dashboard/payroll', icon: '💸', enabled: modules?.payrollEnabled ?? true },
        { name: 'Email Suite', href: '/dashboard/email', icon: '📧', enabled: modules?.emailEnabled ?? true },
        { name: 'File Storage', href: '/dashboard/storage', icon: '📂', enabled: modules?.storageEnabled ?? true },
        { name: 'Phone System', href: '/dashboard/phone', icon: '📞', enabled: modules?.voipEnabled ?? true },
        { name: 'Digital Fax', href: '/dashboard/fax', icon: '📠', enabled: modules?.faxEnabled ?? true },
        { name: 'Forms', href: '/dashboard/forms', icon: '📝', enabled: modules?.formsEnabled ?? true },
        { name: 'Workflows', href: '/dashboard/workflows', icon: '🔄', enabled: true },
        { name: 'Research', href: '/dashboard/research', icon: '🔬', enabled: true },
        { name: 'Family Portal', href: '/dashboard/portals/family', icon: '👨‍👩‍👧‍👦', enabled: true },
        { name: 'Employee Portal', href: '/dashboard/portals/employee', icon: '👤', enabled: true },
        { name: 'Patient Engagement', href: '/dashboard/engagement', icon: '💬', enabled: true },
        { name: 'Audit Vault', href: '/dashboard/audit', icon: '🛡️', enabled: modules?.auditEnabled ?? true },
        { name: 'Reports & Analytics', href: '/dashboard/reports', icon: '📈', enabled: true },
        { name: 'CLI Terminal', href: '/dashboard/cli', icon: '⌨️', enabled: true },
        { name: 'AI Assistant', href: '/dashboard/ai', icon: '✨', enabled: true },
        { name: 'Settings', href: '/dashboard/settings', icon: '⚙️', enabled: true },
    ].filter(item => item.enabled);

    if (user.role === 'ADMIN') {
        navItems.push({ name: 'Admin', href: '/dashboard/admin', icon: '🛡️', enabled: true });
    }

    const sipConfig = sql.get<any>(`SELECT * FROM SipAccount WHERE userId = ?`, [user.id]);

    if (sipConfig && sipConfig.password) {
        try {
            sipConfig.password = decrypt(sipConfig.password);
        } catch (e) {
            console.error("Failed to decrypt SIP password:", e);
        }
    }

    return (
        <SipProvider sipConfig={sipConfig}>
            <DashboardShell
                navItems={navItems}
                userName={user.name || 'User'}
                userInitials={user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
            >
                {children}
            </DashboardShell>
            <FloatingDialer />
        </SipProvider>
    );
}



