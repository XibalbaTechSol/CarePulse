# CarePulse: Intelligent Agency Care

**CarePulse** (formerly Stitch PaaS/Nextiva Clone) is an enterprise-grade Platform-as-a-Service solution designed for modern **Personal Care & Home Health Agencies**. It unifies clinical, financial, and operational workflows into a single, intelligent "Single Pane of Glass" dashboard.

## 🚀 Platform Capabilities

### 🏥 Agency Care Suite
- **Interactive CRM**: Kanban-style workflow management for Intakes, Authorizations, and Referrals.
- **Real-Time EVV Monitor**: Live GPS mapping of active visits, exceptions, and schedule adherence.
- **Care Plans & ADLs**: Digital plan of care management with automated compliance checks.

### 🧠 Intelligence Layer
- **AI Knowledge Base**: Instant access to agency policies and regulatory docs (RAG).
- **Automated Audits**: T1019 audit readiness with finding details and resolution workflows.

### ⚡ Critical Business Ops
- **Unified Communication**: Integrated VoIP Softphone, Digital Fax (SRFax), and Email Suite.
- **Drive**: Secure, HIPAA-compliant document storage and sharing.
- **Productivity**: Integrated tools for scheduling and task management.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [Prisma](https://www.prisma.io/) with SQLite (Dev) / Postgres (Prod)
- **Styling**: Vanilla CSS with modern "Glassmorphism" aesthetics and premium UI/UX.
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context & Hooks

## 📥 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd NextivaClone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   # Add third-party API keys here (SRFax, SendGrid, etc.)
   ```

4. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

## ⚙️ Module Configuration

The system is modular. Each component can be configured via its respective settings page within the dashboard:

- **CRM**: Configure via `Dashboard > CRM`.
- **EVV**: Set Sandata credentials in `Dashboard > EVV > Configuration`.
- **Phone**: Add SIP accounts in `Dashboard > Phone > Settings`.
- **Fax**: Configure SRFax in `Dashboard > Settings`.
- **Email**: Set up IMAP/SMTP in `Dashboard > Email`.

## 📁 Modules Documentation

For detailed information on each module, refer to the README files in their respective directories:

- [CRM Module](./src/app/dashboard/crm/README.md)
- [EVV Module](./src/app/dashboard/evv/README.md)
- [Phone Module](./src/app/dashboard/phone/README.md)
- [Fax Module](./src/app/dashboard/fax/README.md)
- [Email Module](./src/app/dashboard/email/README.md)
- [Storage Module](./src/app/dashboard/storage/README.md)

---
Developed with a focus on **Compliance**, **Usability**, and **Performance**.
