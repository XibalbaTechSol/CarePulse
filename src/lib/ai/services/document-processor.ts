
import { aiService } from '../provider';
import { clinicalNLP } from './clinical-nlp';

export interface ExtractedDocument {
    category: 'lab_report' | 'referral' | 'prescription' | 'insurance' | 'other';
    patientName?: string;
    patientDob?: string;
    summary: string;
    entities: any[];
    confidence: number;
}

export class DocumentProcessorService {
    /**
     * Processes a document (simulated OCR + AI reasoning)
     * In a real scenario, this would take a PDF/Image buffer and use a proper OCR tool first.
     * Here, we simulate the text extraction for the prototype.
     */
    async processDocument(ocrText: string): Promise<ExtractedDocument> {
        const prompt = `
            Analyze the following text extracted from a medical document via OCR.
            1. Categorize the document.
            2. Extract patient identity (name, DOB).
            3. Provide a concise summary of the findings or intent.
            4. Extract key clinical entities.

            Return JSON format:
            {
                "category": "lab_report" | "referral" | "prescription" | "insurance" | "other",
                "patientName": "Full Name",
                "patientDob": "YYYY-MM-DD",
                "summary": "Brief summary",
                "entities": [],
                "confidence": 0.95
            }

            OCR Text:
            """
            ${ocrText}
            """
        `;

        const response = await aiService.generateText(prompt, "You are a medical records specialist.");

        try {
            const match = response.text.match(/\{[\s\S]*\}/);
            if (match) {
                return JSON.parse(match[0]);
            }
            throw new Error("No JSON found in response");
        } catch (e) {
            console.error("Failed to parse document extraction", e);
            return {
                category: 'other',
                summary: "Failed to process document automatically.",
                entities: [],
                confidence: 0
            };
        }
    }

    /**
     * Identifies potential patient match in the CRM
     * Simplified for prototype: expects the UI to handle the actual DB lookup based on the name.
     */
    async suggestPatientMatch(document: ExtractedDocument, availablePatients: { id: string, name: string }[]) {
        // Logic to fuzz match names
        if (!document.patientName) return null;

        const match = availablePatients.find(p =>
            p.name.toLowerCase().includes(document.patientName!.toLowerCase()) ||
            document.patientName!.toLowerCase().includes(p.name.toLowerCase())
        );

        return match || null;
    }
}

export const documentProcessor = new DocumentProcessorService();
