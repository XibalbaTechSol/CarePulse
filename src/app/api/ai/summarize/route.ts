/**
 * AI Clinical Summarization API
 * 
 * Endpoint: POST /api/ai/summarize
 * 
 * Summarizes clinical assessment notes using locally-hosted AI models (Phi-3 Mini).
 * Implements HIPAA-compliant PHI de-identification and comprehensive audit logging.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db-sql';
import {
    deidentifyText,
    reidentifyText,
    aiService,
    MEDICAL_PROMPTS,
    logAIInteraction,
    logAIError,
    canUseAIFeature
} from '@/lib/ai';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60s for AI processing

interface SummarizeRequest {
    assessmentId: string;
    userId: string;
    organizationId: string;
}

interface Assessment {
    id: string;
    contactId: string;
    type: string;
    data: string; // JSON string
    status: string;
}

interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    medicaidId: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
}

export async function POST(req: NextRequest) {
    const startTime = Date.now();

    try {
        const body = await req.json() as SummarizeRequest;
        const { assessmentId, userId, organizationId } = body;

        // Validate required fields
        if (!assessmentId || !userId || !organizationId) {
            return NextResponse.json(
                { error: 'Missing required fields: assessmentId, userId, organizationId' },
                { status: 400 }
            );
        }

        // Check user permissions
        const user = sql.get<{ role: string }>(`SELECT role FROM User WHERE id = ?`, [userId]);
        if (!user || !canUseAIFeature(user.role, 'clinical-summarization')) {
            await logAIError({
                userId,
                organizationId,
                module: 'clinical-summarization',
                action: 'SUMMARIZE_ASSESSMENT',
                modelUsed: 'phi3:mini',
                inputSummary: `Assessment ${assessmentId}`,
                error: 'Permission denied',
                processingTimeMs: Date.now() - startTime,
                entityType: 'Assessment',
                entityId: assessmentId
            });

            return NextResponse.json(
                { error: 'Insufficient permissions for AI summarization' },
                { status: 403 }
            );
        }

        // Fetch assessment data
        const assessment = sql.get<Assessment>(
            `SELECT * FROM Assessment WHERE id = ?`,
            [assessmentId]
        );

        if (!assessment) {
            return NextResponse.json(
                { error: 'Assessment not found' },
                { status: 404 }
            );
        }

        // Fetch patient data for PHI de-identification
        const patient = sql.get<Contact>(
            `SELECT * FROM Contact WHERE id = ?`,
            [assessment.contactId]
        );

        // Parse assessment data (stored as JSON)
        let assessmentText: string;
        try {
            const assessmentData = JSON.parse(assessment.data);
            // Extract text from various possible structures
            assessmentText = assessmentData.notes || assessmentData.findings || JSON.stringify(assessmentData);
        } catch {
            assessmentText = assessment.data; // Use raw data if not valid JSON
        }

        // De-identify PHI before sending to AI
        const deidentified = deidentifyText(assessmentText, {
            firstName: patient?.firstName,
            lastName: patient?.lastName,
            dateOfBirth: patient?.dateOfBirth || undefined,
            medicaidId: patient?.medicaidId || undefined,
            phone: patient?.phone || undefined,
            email: patient?.email || undefined,
            address: patient?.address || undefined
        });

        console.log(`[AI Summarize] De-identified ${deidentified.mappings.length} PHI elements`);

        // Generate summary using AI service
        const prompt = MEDICAL_PROMPTS.clinicalSummarization(deidentified.scrubbedText);

        const aiResponse = await aiService.generateText(prompt.prompt, prompt.system);

        // Re-identify the summary (restore PHI for clinical use)
        const summary = reidentifyText(aiResponse.text, deidentified.mappings);

        // Store AI analysis result
        const analysisId = sql.id();
        sql.run(`
      INSERT INTO AIAnalysis (
        id,
        modelName,
        modelVersion,
        inputType,
        inputId,
        outputData,
        confidenceScore,
        reviewStatus,
        organizationId,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            analysisId,
            'phi3:mini',
            'latest',
            'TEXT',
            assessmentId,
            JSON.stringify({ summary, originalLength: assessmentText.length }),
            null, // Phi-3 doesn't provide confidence scores
            'PENDING',
            organizationId,
            sql.now(),
            sql.now()
        ]);

        // Log AI interaction for audit trail
        await logAIInteraction({
            userId,
            organizationId,
            module: 'clinical-summarization',
            action: 'SUMMARIZE_ASSESSMENT',
            modelUsed: 'phi3:mini',
            inputSummary: deidentified.scrubbedText.substring(0, 500),
            outputSummary: summary.substring(0, 500),
            processingTimeMs: Date.now() - startTime,
            entityType: 'Assessment',
            entityId: assessmentId
        });

        return NextResponse.json({
            success: true,
            summary,
            analysisId,
            processingTimeMs: Date.now() - startTime,
            phiElementsProtected: deidentified.mappings.length
        });

    } catch (error) {
        console.error('[AI Summarize] Error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Try to log error if we have userId
        try {
            const body = await req.json().catch(() => ({})) as Partial<SummarizeRequest>;
            if (body.userId && body.organizationId) {
                await logAIError({
                    userId: body.userId,
                    organizationId: body.organizationId,
                    module: 'clinical-summarization',
                    action: 'SUMMARIZE_ASSESSMENT',
                    modelUsed: 'phi3:mini',
                    inputSummary: 'Error occurred before processing',
                    error: errorMessage,
                    processingTimeMs: Date.now() - startTime
                });
            }
        } catch (logError) {
            console.error('[AI Summarize] Failed to log error:', logError);
        }

        return NextResponse.json(
            { error: 'Failed to generate summary', details: errorMessage },
            { status: 500 }
        );
    }
}
