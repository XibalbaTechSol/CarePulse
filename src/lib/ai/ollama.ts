/**
 * Ollama Client for Local AI Model Inference
 * 
 * Provides a simple interface to interact with locally-hosted Ollama models
 * (Phi-3 Mini, Llama 3.2, etc.) for medical AI tasks.
 */

export interface OllamaGenerateParams {
    model: string; // e.g., 'phi3:mini', 'llama3.2:3b'
    prompt: string;
    system?: string; // System prompt for context
    temperature?: number; // 0.0 - 1.0, lower = more deterministic
    maxTokens?: number;
    stream?: boolean;
}

export interface OllamaResponse {
    response: string;
    model: string;
    createdAt: string;
    done: boolean;
    totalDuration?: number; // nanoseconds
    loadDuration?: number;
    promptEvalDuration?: number;
    evalDuration?: number;
}

const OLLAMA_BASE_URL = process.env.OLLAMA_HOST || 'http://localhost:11434';

/**
 * Generate text using Ollama model
 */
export async function generateWithOllama(params: OllamaGenerateParams): Promise<OllamaResponse> {
    const startTime = Date.now();

    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: params.model,
                prompt: params.prompt,
                system: params.system,
                temperature: params.temperature ?? 0.3, // Lower temp for medical accuracy
                options: {
                    num_predict: params.maxTokens ?? 1000,
                },
                stream: params.stream ?? false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as OllamaResponse;

        console.log(`[Ollama] Generated response in ${Date.now() - startTime}ms using ${params.model}`);

        return data;
    } catch (error) {
        console.error('[Ollama] Generation failed:', error);
        throw new Error(`Failed to generate with Ollama: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Check if Ollama server is running and accessible
 */
export async function checkOllamaHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
            method: 'GET',
        });
        return response.ok;
    } catch (error) {
        console.error('[Ollama] Health check failed:', error);
        return false;
    }
}

/**
 * List available models in Ollama
 */
export async function listOllamaModels(): Promise<{ name: string; size: number; modified: string }[]> {
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
        if (!response.ok) {
            throw new Error('Failed to fetch models');
        }

        const data = await response.json();
        return data.models || [];
    } catch (error) {
        console.error('[Ollama] Failed to list models:', error);
        return [];
    }
}

/**
 * Medical-specific prompt templates
 */
export const MEDICAL_PROMPTS = {
    clinicalSummarization: (assessmentText: string) => ({
        system: `You are a medical assistant specialized in clinical documentation. 
Your task is to create concise, accurate summaries of patient assessments.
Use medical terminology appropriately and maintain clinical accuracy.
Format output as clear bullet points with relevant clinical details.`,
        prompt: `Summarize the following clinical assessment:\n\n${assessmentText}\n\nProvide a concise summary with key findings, diagnoses, and recommendations.`
    }),

    icd10Suggestion: (clinicalNotes: string) => ({
        system: `You are a medical coding assistant. Based on clinical documentation,
suggest appropriate ICD-10 diagnosis codes. Always provide the code and description.
Be conservative - only suggest codes clearly supported by documentation.`,
        prompt: `Based on these clinical notes, suggest appropriate ICD-10 codes:\n\n${clinicalNotes}\n\nProvide up to 5 relevant ICD-10 codes with descriptions.`
    }),

    carePlanRecommendation: (patientHistory: string, currentAssessment: string) => ({
        system: `You are a clinical care planning assistant. Review patient history and
current assessment to recommend evidence-based care plan modifications.
Focus on patient safety, quality of life, and regulatory compliance.`,
        prompt: `Patient History:\n${patientHistory}\n\nCurrent Assessment:\n${currentAssessment}\n\nRecommend care plan adjustments if needed.`
    })
};
