'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getPayrollData(startDate?: Date, endDate?: Date) {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) throw new Error('Unauthorized');

    // Default to current week range (Sunday to Saturday) if not provided
    const now = new Date();
    const firstDay = startDate ? new Date(startDate) : new Date(now.setDate(now.getDate() - now.getDay()));
    if (!startDate) firstDay.setHours(0, 0, 0, 0);

    const lastDay = endDate ? new Date(endDate) : new Date(firstDay);
    if (!endDate) {
        lastDay.setDate(lastDay.getDate() + 6);
        lastDay.setHours(23, 59, 59, 999);
    }

    const caregivers = await prisma.user.findMany({
        where: {
            organizationId: user.organizationId,
            role: { in: ['CAREGIVER', 'NURSE'] }
        },
        include: {
            caregiverVisits: {
                where: {
                    status: { in: ['COMPLETED', 'VERIFIED', 'SUBMITTED'] },
                    startDateTime: { gte: firstDay, lte: lastDay }
                }
            }
        }
    });

    const payrollData = caregivers.map(cg => {
        let totalMinutes = 0;
        cg.caregiverVisits.forEach(visit => {
            if (visit.startDateTime && visit.endDateTime) {
                totalMinutes += (visit.endDateTime.getTime() - visit.startDateTime.getTime()) / 60000;
            }
        });

        const totalHours = totalMinutes / 60;
        const rate = cg.hourlyRate || 20.00;
        const regHours = Math.min(totalHours, 40);
        const otHours = Math.max(0, totalHours - 40);
        const totalPay = (regHours * rate) + (otHours * rate * 1.5);

        return {
            id: cg.id,
            name: cg.name,
            email: cg.email,
            hourlyRate: rate,
            totalHours: parseFloat(totalHours.toFixed(2)),
            regularHours: parseFloat(regHours.toFixed(2)),
            overtimeHours: parseFloat(otHours.toFixed(2)),
            totalPay: parseFloat(totalPay.toFixed(2)),
            isNearOvertime: totalHours >= 38,
            isOvertime: totalHours >= 40,
            visitsCount: cg.caregiverVisits.length
        };
    });

    return {
        startDate: firstDay,
        endDate: lastDay,
        caregivers: payrollData
    };
}

export async function exportPayrollCSV(format: 'QUICKBOOKS' | 'ADP' = 'QUICKBOOKS', startDate?: Date, endDate?: Date) {
    const data = await getPayrollData(startDate, endDate);

    let header = "";
    if (format === 'QUICKBOOKS') {
        header = "Employee,Date,Service,Duration,Rate,Total,Description\n";
    } else {
        header = "EmployeeID,Hours,RateCode,Date\n";
    }

    const rows = data.caregivers.map(cg => {
        if (format === 'QUICKBOOKS') {
            return `"${cg.name}","${data.endDate.toLocaleDateString()}","Caregiving",${cg.totalHours},${cg.hourlyRate},${cg.totalPay},"Weekly Total"`;
        } else {
            return `"${cg.id}",${cg.totalHours},"REG","${data.endDate.toLocaleDateString()}"`;
        }
    }).join("\n");

    return {
        filename: `payroll_${format.toLowerCase()}_${data.endDate.toISOString().split('T')[0]}.csv`,
        content: header + rows
    };
}

export async function checkOvertimeAlerts() {
    const data = await getPayrollData();
    const alerts = [];

    for (const cg of data.caregivers) {
        if (cg.totalHours >= 38) {
            alerts.push({
                caregiverName: cg.name,
                hours: cg.totalHours,
                type: cg.totalHours >= 40 ? 'OVERTIME' : 'WARNING'
            });

            // Mock SMS
            console.log(`[Overtime Watchdog] ALERT: ${cg.name} is at ${cg.totalHours} hours.`);
        }
    }

    return alerts;
}
