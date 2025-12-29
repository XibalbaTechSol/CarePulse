
'use server'

import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';
import { aiService } from '../../ai/provider';

export interface TriageEntry {
    patientId: string;
    chiefComplaint: string;
    vitals: any;
    age: number;
    gender: string;
    arrivalTime: string;
}

export async function createTriageEntry(data: TriageEntry) {
    try {
        const id = uuidv4();

        // AI ESI Score Prediction
        const esiPrediction = await predictESI(data);

        const stmt = db.prepare(`
            INSERT INTO EmergencyVisit (
                id, patientId, chiefComplaint, arrivalTime, status, 
                esiScore, predictedWaitTime
            ) VALUES (?, ?, ?, ?, 'WAITING', ?, ?)
        `);

        stmt.run(
            id,
            data.patientId,
            data.chiefComplaint,
            data.arrivalTime,
            esiPrediction.score,
            esiPrediction.waitTime
        );

        return { success: true, id, prediction: esiPrediction };
    } catch (error) {
        console.error('Error creating triage entry:', error);
        return { success: false, error: 'Failed to triage' };
    }
}

async function predictESI(data: TriageEntry) {
    // Mock AI call or real LLM call
    const prompt = `
        Predict ESI Score (1-5, 1 is most urgent) and wait time (minutes) for:
        Complaint: ${data.chiefComplaint}
        Vitals: ${JSON.stringify(data.vitals)}
        Age: ${data.age}
        
        Return JSON: { "score": number, "waitTime": number, "rationale": "string" }
    `;

    try {
        const response = await aiService.generateText(prompt, "You are a triage nurse assistant.");
        const match = response.text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
    } catch (e) {
        console.error("ESI prediction failed", e);
    }

    // Fallback
    return { score: 3, waitTime: 45, rationale: "Standard assessment fallback" };
}

export async function getEDWaitingList(organizationId: string) {
    // Mock return of waiting patients
    return [
        { id: '1', patientName: 'Jane Doe', chiefComplaint: 'Chest Pain', esi: 2, waitTime: 10, status: 'WAITING' },
        { id: '2', patientName: 'Bob Smith', chiefComplaint: 'Sprained Ankle', esi: 4, waitTime: 120, status: 'WAITING' },
    ];
}
