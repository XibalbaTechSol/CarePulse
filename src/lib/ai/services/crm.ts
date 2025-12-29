import { aiService } from '../provider';
import { z } from 'zod';
import { zodSchema } from 'ai';

export interface LeadContext {
    firstName: string;
    lastName: string;
    interactions: Array<{
        type: 'call' | 'email' | 'text' | 'form';
        content: string;
        date: string;
        direction: 'incoming' | 'outgoing';
    }>;
    status: string;
}

export const LeadScoreSchema = z.object({
    score: z.number().min(0).max(100),
    rationale: z.string(),
    hotButtons: z.array(z.string()), // Key concerns or interests
    suggestedNextAction: z.string(),
    urgency: z.enum(['low', 'medium', 'high', 'critical'])
});

export type LeadScore = z.infer<typeof LeadScoreSchema>;

export class CrmAIService {
    private static instance: CrmAIService;

    static getInstance(): CrmAIService {
        if (!CrmAIService.instance) {
            CrmAIService.instance = new CrmAIService();
        }
        return CrmAIService.instance;
    }

    async analyzeLead(context: LeadContext): Promise<LeadScore> {
        const prompt = `
            Analyze this lead's interaction history and provide a "Lead Heat Score" (0-100).
            Identify key interests ("hot buttons"), urgency, and the next best action to take.

            Lead: ${context.firstName} ${context.lastName}
            Current Status: ${context.status}
            
            History:
            ${context.interactions.map(i => `[${i.date}] ${i.direction} ${i.type}: ${i.content}`).join('\n')}
        `;

        const result = await aiService.generateStructured(
            prompt,
            zodSchema(LeadScoreSchema),
            "You are an expert healthcare intake specialist. Your goal is to identify high-quality leads that need immediate attention."
        );

        return result.object as LeadScore;
    }

    async generateFollowUp(context: LeadContext): Promise<string> {
        const lastInteraction = context.interactions[context.interactions.length - 1];
        const prompt = `
            Draft a personalized, professional follow-up email/text for ${context.firstName}.
            Reference their last interaction: "${lastInteraction?.content || 'Initial inquiry'}"
            Objective: Move them to the next stage (${context.status}).
        `;

        const result = await aiService.generateCRM(prompt);
        return result.text;
    }
}

export const crmAI = CrmAIService.getInstance();
