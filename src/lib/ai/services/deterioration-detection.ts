
import { aiService } from '../provider';
import { predictionService } from './prediction';

export interface VitalsData {
    heartRate: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    temperature: number;
    respiratoryRate: number;
    spo2: number;
    consciousness?: 'alert' | 'voice' | 'pain' | 'unresponsive';
}

export interface DeteriorationAlert {
    score: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    type: 'SEPSIS' | 'General Deterioration';
    message: string;
    timestamp: string;
}

export class DeteriorationDetectionService {

    /**
     * Monitor patient vitals for signs of deterioration
     */
    async analyzeVitals(patientId: string, vitals: VitalsData): Promise<DeteriorationAlert | null> {

        // 1. Calculate NEWS2 score (simplified)
        const news2Score = this.calculateNEWS2(vitals);

        // 2. AI Analysis for subtle patterns
        const aiPrediction = await predictionService.predictRisk({
            patientId,
            data: vitals,
            modelType: 'deterioration'
        });

        // Combine signals
        if (news2Score >= 5 || aiPrediction.score > 0.7) {
            return {
                score: Math.max(news2Score, aiPrediction.score * 10), // normalize rough
                riskLevel: news2Score >= 7 || aiPrediction.score > 0.85 ? 'critical' : 'high',
                type: 'General Deterioration',
                message: `Early warning score: ${news2Score}. AI Risk: ${(aiPrediction.score * 100).toFixed(0)}%. ${aiPrediction.recommendation}`,
                timestamp: new Date().toISOString()
            };
        }

        // Checking specifically for Sepsis (qSOFA criteria)
        if (this.checkQSOFA(vitals)) {
            return {
                score: 3,
                riskLevel: 'high',
                type: 'SEPSIS',
                message: 'Possible Sepsis: Met qSOFA criteria (RR >= 22, Altered Mentation, SBP <= 100)',
                timestamp: new Date().toISOString()
            };
        }

        return null;
    }

    calculateNEWS2(v: VitalsData): number {
        let score = 0;
        if (v.respiratoryRate <= 8 || v.respiratoryRate >= 25) score += 3;
        else if (v.respiratoryRate >= 21) score += 2;

        if (v.spo2 <= 91) score += 3;
        else if (v.spo2 <= 93) score += 2;
        else if (v.spo2 <= 95) score += 1;

        if (v.bloodPressureSystolic <= 90) score += 3;
        else if (v.bloodPressureSystolic <= 100) score += 2;

        if (v.heartRate <= 40 || v.heartRate >= 131) score += 3;
        else if (v.heartRate >= 111) score += 2;
        else if (v.heartRate >= 91) score += 1;

        return score;
    }

    checkQSOFA(v: VitalsData): boolean {
        let count = 0;
        if (v.respiratoryRate >= 22) count++;
        if (v.bloodPressureSystolic <= 100) count++;
        if (v.consciousness && v.consciousness !== 'alert') count++;
        return count >= 2;
    }
}

export const deteriorationDetection = new DeteriorationDetectionService();
