export const FORM_MAPPINGS: Record<string, Record<string, string>> = {
    // Mapping for standard Wisconsin forms (e.g., F-62274A)
    // Keys are the potential PDF field names (lowercase partial match).
    // Values are the data paths.
    'default': {
        'member name': 'contact.name',
        'applicant': 'contact.name',
        'patient': 'contact.name',
        'client': 'contact.name',
        'ma id': 'contact.medicaidId',
        'medicaid id': 'contact.medicaidId',
        'prime number': 'contact.medicaidId', // WI term
        'dob': 'contact.dob',
        'birth': 'contact.dob',
        'address': 'contact.address',
        'street': 'contact.address',
        'city': 'contact.city',
        'state': 'contact.state',
        'zip': 'contact.zip',
        'phone': 'contact.phone',
        'telephone': 'contact.phone',
        'provider name': 'organization.name',
        'agency': 'organization.name',
        'provider number': 'organization.npi',
        'npi': 'organization.npi'
    }
};
