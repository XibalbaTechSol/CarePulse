

import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, streamText, generateObject, type Schema, type LanguageModel } from 'ai';

// Configuration interface
export interface AIProviderConfig {
    provider: 'ollama' | 'openai' | 'google';
    modelId?: string; // e.g., 'llama3', 'gpt-4o', 'gemini-1.5-pro'
    apiKey?: string;
    baseUrl?: string; // For Ollama
}

const SYSTEM_PROMPTS = {
    clinical: "You are a highly accurate clinical AI assistant. Your goal is to help healthcare providers with documentation, summarization, and coding suggestions. Always prioritize patient safety and accuracy. Maintain HIPAA compliance by never repeating PHI in your internal logic unless explicitly asked to summarize it for the provider.",
    crm: "You are a professional CRM assistant for a healthcare organization. Your goal is to analyze lead quality, suggest follow-ups, and summarize interactions to help the intake team convert leads to patients.",
    general: "You are a helpful healthcare administrative AI assistant."
};

// Default configuration from environment
const DEFAULT_CONFIG: AIProviderConfig = {
    provider: (process.env.AI_PROVIDER as AIProviderConfig['provider']) || 'google',
    modelId: process.env.AI_MODEL_ID || 'gemini-1.5-flash',
    apiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY,
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
};

export class AIProviderService {
    private static instance: AIProviderService;
    private config: AIProviderConfig;

    private constructor(config: AIProviderConfig = DEFAULT_CONFIG) {
        this.config = config;
    }

    static getInstance(config?: AIProviderConfig): AIProviderService {
        if (!AIProviderService.instance) {
            AIProviderService.instance = new AIProviderService(config);
        }
        return AIProviderService.instance;
    }

    getModel(): LanguageModel {
        const apiKey = this.config.apiKey;

        switch (this.config.provider) {
            case 'openai':
                const openai = createOpenAI({ apiKey });
                return openai(this.config.modelId || 'gpt-4o');
            case 'google':
                const google = createGoogleGenerativeAI({ apiKey });
                return google(this.config.modelId || 'gemini-1.5-flash');
            case 'ollama':
                const localOllama = createOpenAI({
                    baseURL: this.config.baseUrl || 'http://localhost:11434/v1',
                    apiKey: 'not-needed'
                });
                return localOllama(this.config.modelId || 'phi3:mini');
            default:
                throw new Error(`Unsupported AI provider: ${this.config.provider}`);
        }
    }

    async generateText(prompt: string, system?: string) {
        return generateText({
            model: this.getModel(),
            prompt,
            system,
        });
    }

    async streamText(prompt: string, system?: string) {
        return streamText({
            model: this.getModel(),
            prompt,
            system: system || SYSTEM_PROMPTS.general,
        });
    }

    async generateClinical(prompt: string) {
        return this.generateText(prompt, SYSTEM_PROMPTS.clinical);
    }

    async generateCRM(prompt: string) {
        return this.generateText(prompt, SYSTEM_PROMPTS.crm);
    }

    // Wrapper for structured output (important for clinical data extraction)
    async generateStructured(prompt: string, schema: Schema, system?: string) {
        return generateObject({
            model: this.getModel(),
            schema,
            prompt,
            system,
        });
    }
}

export const aiService = AIProviderService.getInstance();
