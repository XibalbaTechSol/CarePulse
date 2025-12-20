import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { prisma } from '@/lib/db';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const { messages } = await req.json();

    // Fetch recent context
    let context = '';
    try {
        const contacts = await prisma.contact.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { firstName: true, lastName: true, company: true, status: true }
        });

        const deals = await prisma.deal.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { title: true, value: true, stage: true }
        });

        context = `
    Recent Contacts: ${JSON.stringify(contacts)}
    Recent Deals: ${JSON.stringify(deals)}
    `;
    } catch (err) {
        console.error('Failed to fetch context:', err);
    }

    const systemPrompt = `You are a helpful AI assistant for a business using NextivaClone.
  You have access to their CRM and communication tools.
  Be professional, concise, and helpful.
  
  Current System Context:
  ${context}
  
  If asked about leads or tasks, use the above context.`;

    const result = streamText({
        model: google('gemini-1.5-pro'),
        messages,
        system: systemPrompt,
    });

    return result.toTextStreamResponse();
}
