# CarePulse: Intelligent Agency Care

**CarePulse** (formerly Stitch PaaS/Nextiva Clone) is an enterprise-grade Platform-as-a-Service solution designed for modern **Personal Care & Home Health Agencies**. It unifies clinical, financial, and operational workflows into a single, intelligent "Single Pane of Glass" dashboard.

## 🆕 Latest Updates (v2.1)
- **AI Audio Orb**: Enhanced visualizer with `GdmLiveAudioVisuals` integration, providing real-time frequency analysis and reactive animations.
- **Advanced VoIP Suite**: New `Dialer`, `CallsView`, `MessagesView`, and `VoicemailView` components for a complete softphone experience.
- **Dynamic Form Editor**: Added `PDFFormEditor` and `TemplateGallery` for seamless PDF manipulation and template management.
- **Fax Management**: Improved `FaxComposer` and `FaxInbox` for robust digital fax handling.
- **Database Migration**: Successfully transitioned to PostgreSQL for production-grade reliability and security.

## 🚀 Platform Capabilities

### 🏥 Agency Care Suite
- **Interactive CRM**: Kanban-style workflow management for Intakes, Authorizations, and Referrals.
- **Real-Time EVV Monitor**: Live GPS mapping of active visits, exceptions, and schedule adherence.
- **Care Plans & ADLs**: Digital plan of care management with automated compliance checks.
- **Medicaid Billing & AR**: Integrated claims (837p), invoices, and cash posting workflows.
- **Dynamic Forms**: Digital assessments and Wisconsin Personal Care PDF automation.

### 🧠 Intelligence Layer
- **Local AI Engine**: Powered by the **Kiwi Thinking Model**, hosted in-house for maximum security and data privacy.
- **Agency Knowledge Base**: Instant access to agency policies, regulatory docs, and organization-specific data via secure RAG.
- **Deep Database Integration**: The AI module has direct, secure access to the entire clinical and operational database to provide context-aware insights.
- **Automated Audits**: T1019 audit readiness with finding details and resolution workflows, enhanced by AI reasoning.

### ⚡ Critical Business Ops
- **Unified Communication**: Integrated VoIP Softphone, Digital Fax (SRFax), and Email Suite.
- **Drive**: Secure, HIPAA-compliant document storage and sharing.
- **Productivity**: Integrated tools for scheduling and task management.

## 🛡️ HIPAA Compliance & Security Architecture

CarePulse is engineered to meet the stringent security requirements of the healthcare industry. Our "Security by Design" approach ensures Protected Health Information (PHI) is always handled with the highest level of care.

### 🔐 Data at Rest (Field-Level Encryption)
To safeguard sensitive integration credentials, we implement **Application-Level Encryption**.
- **Algorithm**: AES-256-CBC (Advanced Encryption Standard).
- **Scope**: All third-party communication passwords (SIP, IMAP/SMTP, SRFax) are encrypted before being persisted to the PostgreSQL database.
- **Key Management**: Encryption keys are managed through environment variables (`ENCRYPTION_KEY`), ensuring they are never hardcoded or committed to version control.

### 🛰️ Data in Transit
All external communications are protected using industry-standard encryption protocols:
- **Email**: Mandatory TLS (port 993/587) for all IMAP and SMTP connections.
- **Fax**: Secure HTTPS-based API communication with the SRFax network.
- **VoIP**: Secure SIP-over-WebSockets (WSS) and SRTP (Secure Real-time Transport Protocol) capabilities.
- **AI**: In production, local hosting of the **Kiwi Thinking Model** via Ollama ensures that sensitive clinical reasoning data never leaves the agency's private infrastructure. (Development supports cloud fallbacks for hardware-constrained environments).

### 📝 Audit & Accountability
The **Audit Vault** provides a tamper-evident log of clinical and operational activities, supporting Wisconsin T1019 audit requirements and general regulatory compliance.


## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [Prisma](https://www.prisma.io/) with **PostgreSQL** (Production-ready)
- **Styling**: Vanilla CSS with modern "Glassmorphism" aesthetics and premium UI/UX.
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context & Hooks

## 📥 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd CAREPULSE
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   ENCRYPTION_KEY="your-32-character-secret-key-here"
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

## 🤖 AI Development (Hardware Alternatives)

If you do not have the local hardware required to run the **Kiwi Thinking Model** via Ollama (e.g., 24GB+ VRAM), you can still develop the CarePulse AI module using cloud alternatives:

### 1. Cloud LLM Fallback (Recommended for Dev)
You can configure the system to use **Google Gemini** or **OpenAI** during development by setting the `AI_PROVIDER` environment variable.
- Update `src/app/api/chat/route.ts` to switch providers based on `.env`.
- Add your API key to `.env` (e.g., `GOOGLE_GENERATIVE_AI_API_KEY`).

### 2. Ollama Proxy
If you have access to a remote server with a GPU, you can set the `OLLAMA_HOST` to point to that remote instance:
```env
OLLAMA_HOST="http://your-gpu-server-ip:11434"
```

### 3. Mock Mode
For UI/UX development, you can implement a simple mock response in the chat route to bypass the LLM entirely while testing the dashboard and tool-calling logic.

---

## 💾 Database Migration (SQLite to PostgreSQL)

We have migrated from SQLite to **PostgreSQL** to meet the requirements of a clinical-grade healthcare platform:

- **Scalability**: Seamlessly handles increasing patient loads and data complexity.
- **CarePulse AI Assistant**: Integrated with an animated audio orb avatar inspired by Google AI Studio, providing real-time visual feedback during AI interactions.
- **High Concurrency**: Supports multiple simultaneous writes from caregivers and admins without "database locked" errors.
- **Enterprise Security**: Simplifies management of encryption-at-rest, point-in-time recovery, and HIPAA-compliant audit logs.
- **Relational Integrity**: Superior handling of complex healthcare data relationships and clinical assessments.

## ⚙️ Module Configuration

The system is modular. Each component can be configured via its respective settings page within the dashboard:

- **CRM**: Configure via `Dashboard > CRM`.
- **EVV**: Set Sandata credentials in `Dashboard > EVV > Configuration`.
- **Phone**: Add SIP accounts in `Dashboard > Phone > Settings`.
- **Fax**: Configure SRFax in `Dashboard > Settings`.
- **Email**: Set up IMAP/SMTP in `Dashboard > Email`.

## 📁 Modules Documentation

For detailed information on each module, refer to the README files in their respective directories:

- [AI Module](./src/app/dashboard/ai/README.md)
- [CRM Module](./src/app/dashboard/crm/README.md)
- [EVV Module](./src/app/dashboard/evv/README.md)
- [Phone Module](./src/app/dashboard/phone/README.md)
- [Fax Module](./src/app/dashboard/fax/README.md)
- [Email Module](./src/app/dashboard/email/README.md)
- [Storage Module](./src/app/dashboard/storage/README.md)
- [Admin Module](./src/app/dashboard/admin/README.md)

---
Developed with a focus on **Compliance**, **Usability**, and **Performance**.
