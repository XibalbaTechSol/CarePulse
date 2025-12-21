// @ts-nocheck
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { sql } from '@/lib/db-sql';
import { z } from 'zod';

// Allow streaming responses up to 60 seconds for thinking models
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// Configuration for local LM Studio
const lmstudio = createOpenAI({
    baseURL: 'http://localhost:1234/v1',
    apiKey: 'not-needed',
});

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
        model: lmstudio('kimi'),
        messages,
        system: systemPrompt,
        tools: {
            getAgencyData: tool({
                description: 'Search for patient contacts, deals, or general agency records.',
                parameters: z.object({
                    query: z.string().describe('The name or keyword to search for in contacts/deals'),
                }),
                execute: async ({ query }) => {
                    const contacts = sql.all<any>(`
                        SELECT id, firstName, lastName, status, medicaidId 
                        FROM Contact 
                        WHERE firstName LIKE ? OR lastName LIKE ? OR company LIKE ?
                        LIMIT 10
                    `, [`%${query}%`, `%${query}%`, `%${query}%`]);
                    return { contacts };
                },
            }),
            getCareInsights: tool({
                description: 'Fetch detailed care-related data including visits, care plans, and assessments.',
                parameters: z.object({
                    patientId: z.string().describe('The ID of the patient to fetch care data for'),
                }),
                execute: async ({ patientId }) => {
                    const carePlans = sql.all(`SELECT * FROM CarePlan WHERE contactId = ? LIMIT 3`, [patientId]);
                    const visits = sql.all(`SELECT * FROM Visit WHERE clientId = ? ORDER BY createdAt DESC LIMIT 5`, [patientId]);
                    const assessments = sql.all(`SELECT * FROM Assessment WHERE contactId = ? ORDER BY createdAt DESC LIMIT 2`, [patientId]);
                    return { carePlans, visits, assessments };
                },
            }),
            searchKnowledgeBase: tool({
                description: 'Search agency policies, regulatory documents, and rules.',
                parameters: z.object({
                    query: z.string().describe('The regulatory or policy-related question'),
                }),
                execute: async ({ query }) => {
                    const findings = sql.all(`
                        SELECT id, content, type, source
                        FROM KnowledgeBase
                        WHERE content LIKE ?
                        LIMIT 5
                    `, [`%${query}%`]);
                    return { findings };
                },
            }),
        },
    });

    return result.toTextStreamResponse();
}
