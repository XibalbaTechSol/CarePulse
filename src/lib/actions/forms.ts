'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getForms() {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (prisma as any).form.findMany({
        where: { organizationId: user.organizationId || 'default' },
        include: { fields: { orderBy: { order: 'asc' } } },
        orderBy: { createdAt: 'desc' }
    });
}

export async function createForm(title: string, description: string, fields: { label: string, type: string, required: boolean, options?: string }[]) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = await (prisma as any).form.create({
        data: {
            title,
            description,
            organizationId: user.organizationId || 'default',
            fields: {
                create: fields.map((f, index) => ({
                    label: f.label,
                    type: f.type,
                    required: f.required,
                    options: f.options,
                    order: index
                }))
            }
        }
    });

    revalidatePath('/dashboard/forms');
    return form;
}

export async function deleteForm(id: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).form.delete({
        where: { id, organizationId: user.organizationId || 'default' }
    });

    revalidatePath('/dashboard/forms');
}
