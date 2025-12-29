import { aiService } from '../provider';
import { z } from 'zod';
import { zodSchema } from 'ai';

export interface ClinicalEncounter {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    notes?: string[];
}

export const ClinicalSummarySchema = z.object({
    summary: z.string(),
    keyFindings: z.array(z.string()),
    codingSuggestions: z.array(z.object({
        code: z.string(),
        description: z.string(),
        type: z.enum(['ICD-10', 'CPT'])
    })),
    followUpTasks: z.array(z.string())
});

export type ClinicalSummary = z.infer<typeof ClinicalSummarySchema>;

export class ClinicalAIService {
    private static instance: ClinicalAIService;

    static getInstance(): ClinicalAIService {
        if (!ClinicalAIService.instance) {
            ClinicalAIService.instance = new ClinicalAIService();
        }
        return ClinicalAIService.instance;
    }

    async summarizeEncounter(encounter: ClinicalEncounter): Promise<ClinicalSummary> {
        const prompt = `
            Please analyze the following patient encounter data and provide a structured summary.
            Include key clinical findings, suggested ICD-10 and CPT codes, and any necessary follow-up tasks.

            Encounter Data:
            Subjective: ${encounter.subjective || 'N/A'}
            Objective: ${encounter.objective || 'N/A'}
            Assessment: ${encounter.assessment || 'N/A'}
            Plan: ${encounter.plan || 'N/A'}
            Additional Notes: ${encounter.notes?.join('\n') || 'N/A'}
        `;

        const result = await aiService.generateStructured(
            prompt,
            zodSchema(ClinicalSummarySchema),
            "You are an expert clinical documentation specialist. Focus on high-accuracy billing codes and concise medical summaries."
        );

        return result.object as ClinicalSummary;
    }

    async suggestCodes(text: string): Promise<ClinicalSummary['codingSuggestions']> {
        const prompt = `
            Based on the following clinical text, suggest relevant ICD-10 and CPT codes for billing.
            Clinical Text: ${text}
        `;

        const schema = z.object({
            codes: z.array(z.object({
                code: z.string(),
                description: z.string(),
                type: z.enum(['ICD-10', 'CPT'])
            }))
        });

        const result = await aiService.generateStructured(prompt, zodSchema(schema));
        return (result.object as any).codes;
    }
}

export const clinicalAI = ClinicalAIService.getInstance();
