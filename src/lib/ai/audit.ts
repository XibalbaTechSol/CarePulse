/**
 * AI Audit Logging for HIPAA Compliance
 * 
 * Every AI interaction must be logged to the AuditLog table for compliance.
 * This module provides utilities to track AI model usage, inputs, outputs,
 * and user actions.
 */

import { sql } from '../db-sql';

export interface AIAuditParams {
    userId: string;
    organizationId: string;
    module: 'clinical-summarization' | 'diagnosis-assistance' | 'claims-audit' | 'knowledge-base' | 'radiology-analysis';
    action: string; // e.g., 'SUMMARIZE_ASSESSMENT', 'SUGGEST_ICD10', 'AUDIT_CLAIM'
    modelUsed: string; // e.g., 'phi3:mini', 'ClinicalBERT'
    inputSummary: string; // De-identified summary of input (first 500 chars)
    outputSummary: string; // De-identified summary of output (first 500 chars)
    confidenceScore?: number; // If model provides confidence
    processingTimeMs?: number; // How long the AI took
    entityType?: string; // e.g., 'Assessment', 'Claim', 'Contact'
    entityId?: string; // ID of the record being processed
}

/**
 * Log an AI interaction to the audit trail
 */
export async function logAIInteraction(params: AIAuditParams): Promise<void> {
    try {
        await sql.run(`
      INSERT INTO AuditLog (
        id, 
        userId, 
        organizationId, 
        action, 
        entity, 
        entityId, 
        details, 
        status,
        createdAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            sql.id(),
            params.userId,
            params.organizationId,
            `AI_${params.action}`,
            params.entityType || params.module,
            params.entityId || null,
            JSON.stringify({
                module: params.module,
                model: params.modelUsed,
                input: params.inputSummary.substring(0, 500),
                output: params.outputSummary.substring(0, 500),
                confidence: params.confidenceScore,
                processingTimeMs: params.processingTimeMs
            }),
            'SUCCESS',
            sql.now()
        ]);

        console.log(`[AI Audit] Logged ${params.action} for user ${params.userId}`);
    } catch (error) {
        console.error('[AI Audit] Failed to log AI interaction:', error);
        // Don't throw - audit logging failures shouldn't break AI functionality
    }
}

/**
 * Log AI error/failure
 */
export async function logAIError(params: Omit<AIAuditParams, 'outputSummary'> & { error: string }): Promise<void> {
    try {
        await sql.run(`
      INSERT INTO AuditLog (
        id, 
        userId, 
        organizationId, 
        action, 
        entity, 
        entityId, 
        details, 
        status,
        createdAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            sql.id(),
            params.userId,
            params.organizationId,
            `AI_${params.action}_FAILED`,
            params.entityType || params.module,
            params.entityId || null,
            JSON.stringify({
                module: params.module,
                model: params.modelUsed,
                input: params.inputSummary.substring(0, 500),
                error: params.error.substring(0, 500),
                processingTimeMs: params.processingTimeMs
            }),
            'FAILURE',
            sql.now()
        ]);
    } catch (error) {
        console.error('[AI Audit] Failed to log AI error:', error);
    }
}

/**
 * Get AI usage statistics for a user or organization
 */
export async function getAIUsageStats(organizationId: string, startDate?: string, endDate?: string) {
    const dateFilter = startDate && endDate
        ? `AND createdAt BETWEEN ? AND ?`
        : '';

    const params = [organizationId];
    if (startDate && endDate) {
        params.push(startDate, endDate);
    }

    const stats = await sql.all<{
        action: string;
        count: number;
        avgConfidence: number;
        avgProcessingTimeMs: number;
    }>(`
    SELECT 
      action,
      COUNT(*) as count,
      AVG(CAST(json_extract(details, '$.confidence') AS REAL)) as avgConfidence,
      AVG(CAST(json_extract(details, '$.processingTimeMs') AS REAL)) as avgProcessingTimeMs
    FROM AuditLog
    WHERE organizationId = ?
      AND action LIKE 'AI_%'
      ${dateFilter}
    GROUP BY action
    ORDER BY count DESC
  `, params);

    return stats;
}

/**
 * Check AI permissions for user role
 */
export const AI_MODULE_PERMISSIONS = {
    'clinical-summarization': ['ADMIN', 'NURSE'],
    'diagnosis-assistance': ['ADMIN', 'NURSE'],
    'radiology-analysis': ['ADMIN', 'NURSE'],
    'claims-audit': ['ADMIN', 'OFFICE'],
    'knowledge-base': ['ADMIN', 'NURSE', 'OFFICE', 'CAREGIVER']
} as const;

export function canUseAIFeature(
    userRole: string,
    module: keyof typeof AI_MODULE_PERMISSIONS
): boolean {
    const allowedRoles = AI_MODULE_PERMISSIONS[module] as readonly string[];
    return allowedRoles?.includes(userRole) ?? false;
}
