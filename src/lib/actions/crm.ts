'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createClient(formData: FormData) {
    const currentUser = await getCurrentUser();

    if (!currentUser.organizationId) {
        return { error: 'User does not belong to an organization' };
    }

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const zip = formData.get('zip') as string;
    const medicaidId = formData.get('medicaidId') as string;
    const dateOfBirth = formData.get('dateOfBirth') ? new Date(formData.get('dateOfBirth') as string) : null;

    try {
        await prisma.contact.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                address,
                city,
                state,
                zip,
                medicaidId,
                dateOfBirth,
                status: 'CUSTOMER',
                organizationId: currentUser.organizationId,
                userId: currentUser.id // Created by this user
            }
        });
        revalidatePath('/dashboard/crm');
        return { success: true };
    } catch (error) {
        console.error('Failed to create client:', error);
        return { error: 'Failed to create client.' };
    }
}

export async function getClients() {
    const currentUser = await getCurrentUser();
    if (!currentUser.organizationId) return [];

    return await prisma.contact.findMany({
        where: {
            organizationId: currentUser.organizationId,
            status: { in: ['CUSTOMER', 'LEAD'] }
        },
        orderBy: { updatedAt: 'desc' }
    });
}

export async function getClient(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser.organizationId) return null;

    return await prisma.contact.findFirst({
        where: {
            id,
            organizationId: currentUser.organizationId
        },
        include: {
            carePlans: {
                include: {
                    tasks: true
                }
            },
            documents: true
        }
    });
}

export async function createCarePlanTask(carePlanId: string, formData: FormData) {

    const taskName = formData.get('taskName') as string;
    const frequency = formData.get('frequency') as string;
    const category = formData.get('category') as string;

    try {
        await prisma.carePlanTask.create({
            data: {
                carePlanId,
                taskName,
                frequency,
                category
            }
        });
        const plan = await prisma.carePlan.findUnique({ where: { id: carePlanId } });
        if (plan) {
            revalidatePath(`/dashboard/crm/${plan.contactId}`);
        }

        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to create task' };
    }
}

export async function ensureCarePlan(contactId: string) {
    // Helper to ensure a default care plan exists
    const currentUser = await getCurrentUser();
    if (!currentUser.organizationId) return null;

    let plan = await prisma.carePlan.findFirst({
        where: { contactId, status: 'ACTIVE' },
        include: { tasks: true }
    });

    if (!plan) {
        plan = await prisma.carePlan.create({
            data: {
                contactId,
                organizationId: currentUser.organizationId,
                title: 'General Care Plan'
            },
            include: { tasks: true }
        });
    }
    return plan;
}

export async function saveCarePlan(contactId: string, title: string, tasks: { taskName: string; category: string }[]) {
    const currentUser = await getCurrentUser();
    if (!currentUser.organizationId) {
        throw new Error('User does not belong to an organization');
    }

    try {
        // Find existing active plan to update or create new
        const existingPlan = await prisma.carePlan.findFirst({
            where: { contactId, status: 'ACTIVE' }
        });

        if (existingPlan) {
            // Update existing plan
            await prisma.carePlan.update({
                where: { id: existingPlan.id },
                data: { title }
            });

            // Replace tasks (delete all and create new for simplicity in this builder)
            await prisma.visitTask.deleteMany({
                where: {
                    task: { carePlanId: existingPlan.id }
                }
            });
            await prisma.carePlanTask.deleteMany({
                where: { carePlanId: existingPlan.id }
            });

            await prisma.carePlanTask.createMany({
                data: tasks.map(t => ({
                    carePlanId: existingPlan.id,
                    taskName: t.taskName,
                    category: t.category,
                    frequency: 'EVERY_VISIT' // Default
                }))
            });
        } else {
            // Create new plan
            await prisma.carePlan.create({
                data: {
                    contactId,
                    organizationId: currentUser.organizationId,
                    title,
                    tasks: {
                        create: tasks.map(t => ({
                            taskName: t.taskName,
                            category: t.category,
                            frequency: 'EVERY_VISIT'
                        }))
                    }
                }
            });
        }

        revalidatePath(`/dashboard/crm/${contactId}`);
        revalidatePath(`/dashboard/crm/care-plans/${contactId}`);
        return { success: true };

    } catch (error) {
        console.error('Failed to save care plan:', error);
        throw new Error('Failed to save care plan');
    }
}

export async function exportLeadsAction() {
    const currentUser = await getCurrentUser();
    if (!currentUser.organizationId) {
        return { error: 'Unauthorized' };
    }

    try {
        const leads = await prisma.contact.findMany({
            where: {
                organizationId: currentUser.organizationId,
                status: 'LEAD'
            }
        });

        // CSV Header
        const header = 'First Name,Last Name,Email,Phone,Company,Status,Created At\n';

        // CSV Rows
        const rows = leads.map(lead => {
            return `${lead.firstName},${lead.lastName},${lead.email || ''},${lead.phone || ''},${lead.company || ''},${lead.status},${lead.createdAt.toISOString()}`;
        }).join('\n');

        return { data: header + rows };
    } catch (error) {
        console.error('Failed to export leads:', error);
        return { error: 'Failed to export leads' };
    }
}
