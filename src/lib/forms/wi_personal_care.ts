export const FORM_MAPPINGS: Record<string, Record<string, string>> = {
    // Default fallback
    'default': {
        'member name': 'contact.name',
        'applicant': 'contact.name',
        'patient': 'contact.name',
        'client': 'contact.name',
        'ma id': 'contact.medicaidId',
        'medicaid id': 'contact.medicaidId',
        'prime number': 'contact.medicaidId', 
        'dob': 'contact.dob',
        'address': 'contact.complete_address', // Prefer complete
        'phone': 'contact.phone',
        'provider name': 'organization.name',
        'npi': 'organization.npi'
    },
    'CMS-485-P': {
        'claimNumber': 'contact.medicaidId',
        'mrn': 'contact.id', // Or specific MRN field if added
        'patientName': 'contact.name',
        'patientAddress': 'contact.complete_address',
        'providerInfo': 'organization.name', // Should append address if available
        'socDate': 'contact.admissionDate', // Derived in action if needed
        'dob': 'contact.dob',
        'icdCodes': 'clinical.diagnosis', // Derived
        'goals': 'carePlan.goals', // Derived
        'orders': 'carePlan.tasks' // Derived
    },
    'WI-F-62274A': {
        'billingProviderName': 'organization.name',
        'billingProviderNPI': 'organization.npi',
        'memberID': 'contact.medicaidId',
        'memberName': 'contact.name',
        'serviceCode_1': 'auth.serviceCode', // Default to T1019 in action
        'modifier_1': 'auth.modifier',
        'quantity_1': 'auth.units',
        'primaryDiagnosis': 'clinical.diagnosis'
    }
};