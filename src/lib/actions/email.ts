'use server';

import { ImapFlow } from 'imapflow';
import { prisma } from '@/lib/db';

export async function getRealEmailsAction(userId: string) {
    try {
        if (userId === 'user_demo') {
            return {
                data: [
                    { id: '1', sender: 'Support', email: 'support@example.com', subject: 'Welcome to Nextiva Clone', date: new Date().toISOString(), preview: 'Welcome to your new communication suite!', isStarred: true, isUnread: false },
                    { id: '2', sender: 'Sales Team', email: 'sales@example.com', subject: 'Q4 Targets', date: new Date(Date.now() - 3600000).toISOString(), preview: 'Please review the attached targets for Q4...', isStarred: false, isUnread: true },
                ]
            };
        }

        const account = await prisma.emailAccount.findFirst({
            where: { userId, isActive: true },
        });

        if (!account) {
            return { error: 'No active email account configured. Please go to settings.' };
        }

        const client = new ImapFlow({
            host: account.imapHost,
            port: account.imapPort,
            secure: account.imapPort === 993,
            auth: {
                user: account.username,
                pass: account.password,
            },
            logger: false,
        });

        await client.connect();

        const lock = await client.getMailboxLock('INBOX');
        try {
            const emails: { id: string, sender: string, email: string, subject: string, date: string, preview: string, isStarred: boolean, isUnread: boolean }[] = [];
            // Fetch the last 10 emails
            for await (const msg of client.fetch('1:10', { envelope: true, bodyStructure: true, flags: true })) {
                if (msg.envelope) {
                    emails.push({
                        id: msg.uid.toString(),
                        sender: msg.envelope.from?.[0]?.name || msg.envelope.from?.[0]?.address || 'Unknown',
                        email: msg.envelope.from?.[0]?.address || 'Unknown',
                        subject: msg.envelope.subject || '(No Subject)',
                        date: msg.envelope.date?.toISOString() || new Date().toISOString(),
                        preview: '',
                        isStarred: msg.flags?.has('\\Starred') || false,
                        isUnread: !msg.flags?.has('\\Seen'),
                    });
                }
            }
            return { data: emails.reverse() };
        } finally {
            lock.release();
            await client.logout();
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('IMAP Error:', error);
        return { error: `Failed to fetch emails: ${errorMessage}` };
    }
}
