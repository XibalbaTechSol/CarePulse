/**
 * AI Module - Entry point and exports
 * 
 * Provides all AI functionality for CarePulse including:
 * - Clinical notes summarization
 * - Diagnosis assistance (ICD-10 suggestions)
 * - Claims auditing
 * - Knowledge base RAG
 * - Medical image analysis
 */

export * from './phi-scrubber';
export * from './audit';
export * from './ollama';

// Re-export commonly used functions for convenience
export {
    deidentifyText,
    reidentifyText,
    validateDeidentification,
    type PHIMapping,
    type DeidentifiedData
} from './phi-scrubber';

export {
    logAIInteraction,
    logAIError,
    canUseAIFeature,
    AI_MODULE_PERMISSIONS,
    type AIAuditParams
} from './audit';

export {
    AIProviderService,
    aiService,
    type AIProviderConfig
} from './provider';

export {
    generateWithOllama,
    checkOllamaHealth,
    listOllamaModels,
    MEDICAL_PROMPTS,
    type OllamaGenerateParams,
    type OllamaResponse
} from './ollama';
