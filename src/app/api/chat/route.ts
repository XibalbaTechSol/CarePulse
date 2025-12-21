import { ollama } from 'ollama-ai-provider';
import { streamText, tool } from 'ai';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Allow streaming responses up to 60 seconds for thinking models
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const { messages } = await req.json();

    const systemPrompt = `You are the CarePulse AI Assistant, powered by the Kiwi Thinking Model.
    You are an expert in home health care operations, regulations, and agency management.
    
    Current Date: ${new Date().toLocaleDateString()}
    
    You have secure access to the agency's in-house database and knowledge base.
    Use the provided tools to fetch real-time information about patients (contacts), care plans, 
    visits, and regulatory rules.
    
    Guidelines:
    1. Always use deep reasoning (Chain-of-Thought) before providing a final answer.
    2. Cite specific agency data or regulations when answering.
    3. If information is missing, ask for clarification or suggest where it might be found.
    4. Maintain HIPAA compliance: only discuss patient info in the context of care management.`;

    const result = streamText({
        model: ollama('kimi'), // User to host 'kimi' locally
        messages,
        system: systemPrompt,
        tools: {
            getAgencyData: tool({
                description: 'Search for patient contacts, deals, or general agency records.',
                parameters: z.object({
                    query: z.string().describe('The name or keyword to search for in contacts/deals'),
                }),
                execute: async ({ query }) => {
                    const contacts = await prisma.contact.findMany({
                        where: {
                            OR: [
                                { firstName: { contains: query, mode: 'insensitive' } },
                                { lastName: { contains: query, mode: 'insensitive' } },
                                { company: { contains: query, mode: 'insensitive' } },
                            ],
                        },
                        take: 10,
                        select: { id: true, firstName: true, lastName: true, status: true, medicaidId: true }
                    });
                    return { contacts };
                },
            }),
            getCareInsights: tool({
                description: 'Fetch detailed care-related data including visits, care plans, and assessments.',
                parameters: z.object({
                    patientId: z.string().describe('The ID of the patient to fetch care data for'),
                }),
                execute: async ({ patientId }) => {
                    const [carePlans, visits, assessments] = await Promise.all([
                        prisma.carePlan.findMany({ where: { contactId: patientId }, take: 3 }),
                        prisma.visit.findMany({ where: { clientId: patientId }, take: 5, orderBy: { createdAt: 'desc' } }),
                        prisma.assessment.findMany({ where: { contactId: patientId }, take: 2, orderBy: { createdAt: 'desc' } }),
                    ]);
                    return { carePlans, visits, assessments };
                },
            }),
            searchKnowledgeBase: tool({
                description: 'Search agency policies, regulatory documents, and rules.',
                parameters: z.object({
                    query: z.string().describe('The regulatory or policy-related question'),
                }),
                execute: async ({ query }) => {
                    // Note: In production, this would use a vector search query.
                    // For now, we'll do a text-based fallback until pgvector is fully populated.
                    const findings = await prisma.$queryRawUnsafe(`
                        SELECT id, content, type, source
                        FROM "KnowledgeBase"
                        WHERE content ILIKE $1
                        LIMIT 5
                    `, `%${query}%`);
                    return { findings };
                },
            }),
        },
    });

    return result.toTextStreamResponse();
}
