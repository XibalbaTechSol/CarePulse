import React from 'react';
import { getDashboardStats } from '@/lib/actions/evv';
import { getVisitsRequiringAttention } from '@/lib/actions/billing';
import { getPayrollData } from '@/lib/actions/payroll';
import { getCurrentUser } from '@/lib/auth';
import { sql } from '@/lib/db-sql';
import {
    MorningCoffeeWidget,
    BillingAttentionWidget,
    CRMMetricsWidget,
    PayrollWatchdogWidget,
    FaxStatusWidget,
    VoIPActivityWidget
} from '@/components/dashboard/DashboardWidgets';
import DashboardCustomizer from '@/components/dashboard/DashboardCustomizer';

export default async function DashboardOverview() {
    const user = await getCurrentUser();
    if (!user) return null;

    // 1. Fetch Configuration
    const config = sql.get<any>(`SELECT * FROM ModuleConfig WHERE organizationId = ?`, [user.organizationId || 'default']);

    const defaultLayout = ['morning_coffee', 'billing_attention', 'crm_metrics', 'payroll_watchdog'];
    const currentLayout: string[] = (config?.dashboardLayout && config.dashboardLayout !== 'default')
        ? JSON.parse(config.dashboardLayout)
        : defaultLayout;

    // Date for call count (start of today)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfDayIso = startOfDay.toISOString();

    // 2. Fetch Data for all potentially enabled widgets
    const [
        stats,
        attentionVisits,
        payrollData
    ] = await Promise.all([
        getDashboardStats(),
        getVisitsRequiringAttention(),
        getPayrollData()
    ]);

    // Simple counts don't need async if we use synchronous sql wrapper, but Promise.all is fine for grouping logic
    const crmContactCount = sql.get<any>(`SELECT COUNT(*) as c FROM Contact WHERE organizationId = ?`, [user.organizationId || 'default'])?.c || 0;
    const faxCount = sql.get<any>(`SELECT COUNT(*) as c FROM Fax WHERE organizationId = ?`, [user.organizationId || 'default'])?.c || 0;
    const callCount = sql.get<any>(`SELECT COUNT(*) as c FROM Message WHERE organizationId = ? AND createdAt >= ?`, [user.organizationId || 'default', startOfDayIso])?.c || 0;

    // 3. Render Widgets
    const renderWidget = (id: string) => {
        switch (id) {
            case 'morning_coffee':
                return <MorningCoffeeWidget key={id} stats={stats} />;
            case 'billing_attention':
                return <BillingAttentionWidget key={id} visits={attentionVisits} />;
            case 'crm_metrics':
                return <CRMMetricsWidget key={id} deals={crmContactCount} value={`$${crmContactCount * 1250}.00`} />;
            case 'payroll_watchdog':
                return <PayrollWatchdogWidget key={id} caregivers={payrollData.caregivers} />;
            case 'fax_status':
                return <FaxStatusWidget key={id} newFaxes={2} total={faxCount} />;
            case 'voip_activity':
                return <VoIPActivityWidget key={id} calls={callCount} missed={0} />;
            default:
                return null;
        }
    };

    return (
        <div className="fade-in" style={{ paddingBottom: '5rem' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Your Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name || 'Admin'}.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {currentLayout.map(widgetId => renderWidget(widgetId))}
            </div>

            {currentLayout.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Your dashboard is empty. Use the customizer to add widgets.</p>
                </div>
            )}

            <DashboardCustomizer organizationId={user.organizationId || 'default'} currentLayout={currentLayout} />
        </div >
    );
}
