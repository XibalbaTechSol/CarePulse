'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/actions/crm';
import { Button, Input, Card, Alert } from '@/components/nord';
import { crmModule } from '@/lib/modules/definitions/crm';

// In a real implementation, this would come from the active organization's configuration
const MODULE_CONFIG = crmModule.defaultConfig || {};
const REQUIRED_FIELDS = MODULE_CONFIG.requiredFields as string[] || [];

export default function NordIntakeForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await createClient(formData);
            if (result.success) {
                router.push('/dashboard/crm');
            } else {
                setError(result.error || 'Failed to create client');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="max-w-3xl mx-auto">
            <div className="p-6 border-b border-nord4 dark:border-nord2">
                <h2 className="text-xl font-bold text-nord0 dark:text-nord6">New Client Intake</h2>
                <p className="text-sm text-nord3 dark:text-nord4 mt-1">
                    Enter the prospective client&apos;s details to begin the intake process.
                </p>
            </div>

            <form action={handleSubmit} className="p-6 space-y-6">
                {error && (
                    <Alert variant="error">
                        <span className="font-bold">Submission Failed:</span> {error}
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        name="firstName"
                        label="First Name"
                        placeholder="e.g. Jane"
                        required={REQUIRED_FIELDS.includes('firstName')}
                    />
                    <Input
                        name="lastName"
                        label="Last Name"
                        placeholder="e.g. Doe"
                        required={REQUIRED_FIELDS.includes('lastName')}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        name="email"
                        type="email"
                        label="Email Address"
                        placeholder="jane.doe@example.com"
                        required={REQUIRED_FIELDS.includes('email')}
                    />
                    <Input
                        name="phone"
                        type="tel"
                        label="Phone Number"
                        placeholder="(555) 123-4567"
                        required={REQUIRED_FIELDS.includes('phone')}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        name="dateOfBirth"
                        type="date"
                        label="Date of Birth"
                        required={REQUIRED_FIELDS.includes('dateOfBirth')}
                    />
                    <Input
                        name="medicaidId"
                        label="Medicaid ID"
                        placeholder="Optional"
                        required={REQUIRED_FIELDS.includes('medicaidId')}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-nord2 dark:text-nord4 uppercase tracking-wider">Address Details</h3>
                    <Input
                        name="address"
                        label="Street Address"
                        placeholder="123 Care Lane"
                        required={REQUIRED_FIELDS.includes('address')}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            name="city"
                            label="City"
                            placeholder="City"
                        />
                        <Input
                            name="state"
                            label="State"
                            placeholder="WI"
                        />
                        <Input
                            name="zip"
                            label="Zip Code"
                            placeholder="53703"
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-nord4 dark:border-nord2 mt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Client Record'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
