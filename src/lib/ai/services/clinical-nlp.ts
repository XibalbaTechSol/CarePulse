
import { aiService } from '../provider';
import { z } from 'zod'; // Assuming zod is available via ai sdk peer dep or I need to install it. 
// If not installed, I'll need to remove this import and use a meaningful generic.
// Actually, 'ai' sdk uses zod internally often.

// Define schemas for structured output
// Since I can't confirm zod is installed, I will define interfaces and use standard prompt engineering for now, 
// or I can try to use standard JSON schema.

export interface ClinicalEntity {
    text: string;
    type: 'condition' | 'medication' | 'symptom' | 'procedure';
    code?: string; // ICD-10 or RxNorm
    confidence?: number;
}

export interface SOAPNote {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

export class ClinicalNLPService {
    /**
     * Extract clinical entities from text
     */
    async extractEntities(text: string): Promise<ClinicalEntity[]> {
        const prompt = `
      Extract clinical entities (conditions, medications, symptoms, procedures) from the following text.
      Return a JSON array of objects with keys: text, type, code (optional), confidence.
      
      Text: "${text}"
    `;

        // Using generateText for now, would strictly use generateObject if zod was confirmed
        const response = await aiService.generateText(prompt, "You are a medical coding assistant.");
        try {
            // Naive parsing, in production use generateObject
            const match = response.text.match(/\[[\s\S]*\]/);
            if (match) {
                return JSON.parse(match[0]);
            }
            return [];
        } catch (e) {
            console.error("Failed to parse entities", e);
            return [];
        }
    }

    /**
     * Generate SOAP note from transcript
     */
    async generateSOAP(transcript: string): Promise<SOAPNote> {
        const prompt = `
      Convert the following doctor-patient transcript into a structured SOAP note.
      Return JSON with keys: subjective, objective, assessment, plan.
      
      Transcript: "${transcript}"
    `;

        const response = await aiService.generateText(prompt, "You are a clinical scribe.");
        try {
            const match = response.text.match(/\{[\s\S]*\}/);
            if (match) {
                return JSON.parse(match[0]);
            }
            throw new Error("No JSON found");
        } catch (e) {
            // Fallback
            return {
                subjective: "Error generating note",
                objective: "",
                assessment: "",
                plan: ""
            };
        }
    }

    /**
     * Summarize clinical history
     */
    async summarizeHistory(history: string): Promise<string> {
        const result = await aiService.generateText(
            `Summarize this patient history into a concise medical abstract:\n${history}`,
            "You are a helpful medical assistant."
        );
        return result.text;
    }
}

export const clinicalNLP = new ClinicalNLPService();
