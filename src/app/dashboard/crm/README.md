# CRM Module: Personal Care Agency Focus

The CRM module is the heart of the agency operations, specifically enhanced to handle the clinical and administrative workflows of Home Care and Personal Care services.

## ✨ Key Features

- **Role-Based Dashboards**:
    - **Agency View**: High-level metrics for active clients, today's visits, and expiring authorizations.
    - **Nurse Portal**: Specialized view for clinical staff to manage assessments and documentation.
    - **Compliance Admin**: Tracking for caregiver certifications and license expirations.
- **Client Management**:
    - Intake workflow capturing Medicaid IDs and Birth Dates.
    - **Authorization Tracking**: Monitor used vs. remaining units to ensure billing compliance.
    - **Care Plans & ADLs**: Define Activities of Daily Living (ADLs) for caregivers to track during visits.
- **Nursing Assessments**: Document Initial, Recertification, and Follow-up clinical evaluations.
- **Lead Pipeline**: Track potential clients through the intake funnel.

## 🛠️ Configuration & Setup

1. **Client Intake**: New clients are added via the "Add Contact" button. Ensure "Medicaid ID" is provided for EVV compatibility.
2. **Authorizations**: Managed under the client details. Requires Start/End dates and Total Units.
3. **Care Plans**: Nurses assign Care Plan Tasks (ADLs) to clients, which then appear in the caregiver's visit tracker.

## 📂 Architecture

- **Page**: `src/app/dashboard/crm/page.tsx`
- **Templates**: `src/components/crm/templates/` (PersonalCare, NursePortal, AdminCompliance)
- **Actions**: `src/lib/actions/crm.ts`
- **Models**: `Authorization`, `CarePlan`, `Certification`, `Assessment` in `schema.prisma`.
