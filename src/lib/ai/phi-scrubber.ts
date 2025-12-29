/**
 * PHI De-identification Utilities for HIPAA-compliant AI Processing
 * 
 * All AI processing must work with de-identified data. This module handles
 * automatic scrubbing of Protected Health Information (PHI) before sending
 * to AI models, and re-identification of results for clinical use.
 */

import { createHash } from 'crypto';

export interface PHIMapping {
    original: string;
    pseudonym: string;
    type: 'NAME' | 'DOB' | 'MRN' | 'MEDICAID_ID' | 'ADDRESS' | 'PHONE' | 'EMAIL';
}

export interface DeidentifiedData {
    scrubbedText: string;
    mappings: PHIMapping[];
    processingId: string; // Unique ID to track this de-identification session
}

/**
 * Common patterns for PHI detection
 */
const PHI_PATTERNS = {
    // Social Security Numbers: XXX-XX-XXXX
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,

    // Phone numbers: various formats
    phone: /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,

    // Email addresses
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,

    // Dates in various formats (MM/DD/YYYY, MM-DD-YYYY, etc.)
    date: /\b(0?[1-9]|1[0-2])[/-](0?[1-9]|[12]\d|3[01])[/-](\d{4}|\d{2})\b/g,

    // ZIP codes (5 or 9 digit)
    zip: /\b\d{5}(-\d{4})?\b/g,

    // Medical Record Numbers (common formats)
    mrn: /\b(MRN|Medical Record|Patient ID)[:\s#]*([A-Z0-9]{6,})\b/gi,
};

/**
 * Generate a consistent pseudonym for a given PHI value
 */
function generatePseudonym(original: string, type: PHIMapping['type']): string {
    // Use hash to generate consistent pseudonyms
    const hash = createHash('sha256').update(original).digest('hex').substring(0, 8);

    switch (type) {
        case 'NAME':
            return `PATIENT_${hash.toUpperCase()}`;
        case 'DOB':
            return 'XX/XX/XXXX';
        case 'MRN':
            return `MRN_${hash}`;
        case 'MEDICAID_ID':
            return `MEDICAID_${hash}`;
        case 'ADDRESS':
            return `[REDACTED_ADDRESS_${hash}]`;
        case 'PHONE':
            return 'XXX-XXX-XXXX';
        case 'EMAIL':
            return `patient${hash}@example.com`;
        default:
            return `[REDACTED_${hash}]`;
    }
}

/**
 * De-identify text by replacing PHI with pseudonyms
 * 
 * @param text - Raw clinical text that may contain PHI
 * @param knownPHI - Optional object with known PHI fields from database
 * @returns De-identified text and mapping for re-identification
 */
export function deidentifyText(
    text: string,
    knownPHI?: {
        firstName?: string;
        lastName?: string;
        dateOfBirth?: string;
        medicaidId?: string;
        phone?: string;
        email?: string;
        address?: string;
    }
): DeidentifiedData {
    const mappings: PHIMapping[] = [];
    let scrubbed = text;
    const processingId = createHash('sha256')
        .update(text + Date.now())
        .digest('hex')
        .substring(0, 16);

    // Replace known PHI from database first (more accurate)
    if (knownPHI) {
        if (knownPHI.firstName) {
            const pseudonym = generatePseudonym(knownPHI.firstName, 'NAME');
            scrubbed = scrubbed.replace(new RegExp(knownPHI.firstName, 'gi'), pseudonym);
            mappings.push({ original: knownPHI.firstName, pseudonym, type: 'NAME' });
        }

        if (knownPHI.lastName) {
            const pseudonym = generatePseudonym(knownPHI.lastName, 'NAME');
            scrubbed = scrubbed.replace(new RegExp(knownPHI.lastName, 'gi'), pseudonym);
            mappings.push({ original: knownPHI.lastName, pseudonym, type: 'NAME' });
        }

        if (knownPHI.dateOfBirth) {
            const pseudonym = generatePseudonym(knownPHI.dateOfBirth, 'DOB');
            scrubbed = scrubbed.replace(new RegExp(knownPHI.dateOfBirth, 'g'), pseudonym);
            mappings.push({ original: knownPHI.dateOfBirth, pseudonym, type: 'DOB' });
        }

        if (knownPHI.medicaidId) {
            const pseudonym = generatePseudonym(knownPHI.medicaidId, 'MEDICAID_ID');
            scrubbed = scrubbed.replace(new RegExp(knownPHI.medicaidId, 'gi'), pseudonym);
            mappings.push({ original: knownPHI.medicaidId, pseudonym, type: 'MEDICAID_ID' });
        }

        if (knownPHI.phone) {
            const pseudonym = generatePseudonym(knownPHI.phone, 'PHONE');
            scrubbed = scrubbed.replace(new RegExp(knownPHI.phone, 'g'), pseudonym);
            mappings.push({ original: knownPHI.phone, pseudonym, type: 'PHONE' });
        }

        if (knownPHI.email) {
            const pseudonym = generatePseudonym(knownPHI.email, 'EMAIL');
            scrubbed = scrubbed.replace(new RegExp(knownPHI.email, 'gi'), pseudonym);
            mappings.push({ original: knownPHI.email, pseudonym, type: 'EMAIL' });
        }

        if (knownPHI.address) {
            const pseudonym = generatePseudonym(knownPHI.address, 'ADDRESS');
            scrubbed = scrubbed.replace(new RegExp(knownPHI.address, 'gi'), pseudonym);
            mappings.push({ original: knownPHI.address, pseudonym, type: 'ADDRESS' });
        }
    }

    // Pattern-based scrubbing for remaining PHI
    // SSNs
    scrubbed = scrubbed.replace(PHI_PATTERNS.ssn, (match) => {
        const pseudonym = 'XXX-XX-XXXX';
        if (!mappings.find(m => m.original === match)) {
            mappings.push({ original: match, pseudonym, type: 'MRN' });
        }
        return pseudonym;
    });

    // Phone numbers
    scrubbed = scrubbed.replace(PHI_PATTERNS.phone, (match) => {
        const pseudonym = 'XXX-XXX-XXXX';
        if (!mappings.find(m => m.original === match)) {
            mappings.push({ original: match, pseudonym, type: 'PHONE' });
        }
        return pseudonym;
    });

    // Email addresses
    scrubbed = scrubbed.replace(PHI_PATTERNS.email, (match) => {
        const pseudonym = generatePseudonym(match, 'EMAIL');
        if (!mappings.find(m => m.original === match)) {
            mappings.push({ original: match, pseudonym, type: 'EMAIL' });
        }
        return pseudonym;
    });

    // Dates (be careful - may catch non-PHI dates)
    scrubbed = scrubbed.replace(PHI_PATTERNS.date, (match) => {
        // Only redact if it looks like a birth date context
        const matchIndex = text.indexOf(match);
        const contextBefore = text.substring(Math.max(0, matchIndex - 20), matchIndex);
        if (/birth|dob|born/i.test(contextBefore)) {
            const pseudonym = 'XX/XX/XXXX';
            if (!mappings.find(m => m.original === match)) {
                mappings.push({ original: match, pseudonym, type: 'DOB' });
            }
            return pseudonym;
        }
        return match; // Keep non-birth dates
    });

    return {
        scrubbedText: scrubbed,
        mappings,
        processingId
    };
}

/**
 * Re-identify AI output by replacing pseudonyms with original PHI
 * 
 * @param aiOutput - De-identified text from AI model
 * @param mappings - Mapping table from de-identification step
 * @returns Original text with PHI restored
 */
export function reidentifyText(aiOutput: string, mappings: PHIMapping[]): string {
    let reidentified = aiOutput;

    // Replace in reverse order to avoid partial replacements
    const sortedMappings = [...mappings].sort((a, b) => b.pseudonym.length - a.pseudonym.length);

    for (const mapping of sortedMappings) {
        reidentified = reidentified.replace(new RegExp(mapping.pseudonym, 'g'), mapping.original);
    }

    return reidentified;
}

/**
 * Validate that text is properly de-identified (safety check)
 * Returns true if no obvious PHI patterns detected
 */
export function validateDeidentification(text: string): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (PHI_PATTERNS.ssn.test(text)) {
        violations.push('SSN pattern detected');
    }

    if (PHI_PATTERNS.phone.test(text) && !/XXX-XXX-XXXX/.test(text)) {
        violations.push('Unredacted phone number detected');
    }

    if (PHI_PATTERNS.email.test(text) && !/@example\.com/.test(text)) {
        violations.push('Unredacted email detected');
    }

    return {
        isValid: violations.length === 0,
        violations
    };
}
