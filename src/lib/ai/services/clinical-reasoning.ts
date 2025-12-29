
import { aiService } from '../provider';

export interface DiagnosticInput {
    symptoms: string[];
    history?: string;
    vitals?: Record<string, any>;
    age: number;
    gender: string;
}

export interface DifferentialDiagnosis {
    condition: string;
    probability: 'high' | 'medium' | 'low';
    rationale: string;
    recommendedTests: string[];
}

export class ClinicalReasoningService {

    /**
     * Generate differential diagnoses based on patient data
     */
    async generateDifferentialDiagnosis(input: DiagnosticInput): Promise<DifferentialDiagnosis[]> {
        const prompt = `
      Patient: ${input.age} year old ${input.gender}
      Symptoms: ${input.symptoms.join(', ')}
      History: ${input.history || 'None'}
      Vitals: ${JSON.stringify(input.vitals || {})}

      Generate a differential diagnosis. Return JSON array of objects with:
      - condition (string)
      - probability (high/medium/low)
      - rationale (string - brief explanation)
      - recommendedTests (array of strings)
    `;

        try {
            const response = await aiService.generateText(prompt, "You are a diagnostic expert system.");
            const match = response.text.match(/\[[\s\S]*\]/);
            if (match) {
                return JSON.parse(match[0]);
            }
            return [];
        } catch (error) {
            console.error("DIagnosis generation failed", error);
            return [];
        }
    }

    /**
     * Check for drug interactions (Mock/AI-based for now)
     */
    async checkInteractions(medications: string[]): Promise<any[]> {
        const prompt = `
        Analyze potential interactions between these medications: ${medications.join(', ')}.
        Return JSON array of interaction alerts.
      `;
        // AI implementation would go here
        return [];
    }
}

export const clinicalReasoning = new ClinicalReasoningService();
