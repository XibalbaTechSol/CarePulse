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


### 🧠 CarePulse AI: Clinical & Operational Intelligence

CarePulse isn't just a dashboard; it's an intelligent partner powered by the **Kiwi Thinking Model**. Our AI integration is specifically engineered to solve the most painful challenges in home health operations.

#### 🛡️ Audit-Ready Intelligence (T1019 & Beyond)
The AI assistant has direct access to the **Audit Vault** and clinical database, providing a "Pre-Audit" reasoning layer:
- **Audit Verification**: Automatically checks visits against active authorizations and Plan of Care (485) tasks.
- **Compliance Gap Detection**: Identifies missing clinical signatures, task discrepancies, or EVV exceptions *before* an auditor arrives.
- **Regulatory Retrieval**: Uses RAG to instantly cite Wisconsin DHS regulations and agency-specific policies during documentation.

#### 🚫 Proactive Error Prevention
By analyzing patterns across the organization, the AI prevents costly clinical and administrative mistakes:
- **Real-Time Documentation Analysis**: Flags inconsistencies between nursing assessments and daily caregiver task logs.
- **Authorization Monitoring**: Alerts administrators when care usage deviates from approved Medicaid limits, preventing unbillable "over-servicing."
- **Data Integrity**: Detects potential fraudulent patterns in EVV data through anomaly detection in clock-in/out coordinates.

#### 💰 Maximizing Agency Profitability
CarePulse AI identifies hidden opportunities to optimize resources and increase revenue:
- **Billable Activity Recovery**: Surfaces unbilled coordination time and supplies that often leak from agency revenue streams.
- **Visit Optimization**: Analyzes travel patterns and staff availability to suggest the most cost-effective scheduling routes.
- **Staff Retention Insights**: Monitors caregiver exception trends and workload to predict and prevent burnout, reducing high turnover costs.

#### 🎙️ Interactive AI Guidance (Audio Orb)
Experience natural, context-aware assistance through our **volume-responsive Audio Orb**:
- **Eyes-Free Interaction**: Nurses can query client history or organization protocols hands-free during clinical evaluations.
- **Visual Feedback**: Real-time frequency analysis provides a tactile, "living" presence for the AI, ensuring users know exactly when the model is processing deep reasoning.

#### 🖥️ CarePulse Medical AI CLI
For advanced users and developers, we've integrated a specialized **Terminal User Interface (TUI)** powered by the [TOAD](./toad/) framework:
- **Privacy-First Medical Assistant**: Direct access to local Ollama models (Phi-3 Mini) or Gemini API fallback
- **Webserver Mode**: Run CarePulse Medical AI as a standalone web application on port 8000
- **Integrated Startup**: Automatically launched with the main CarePulse platform via `./rebuild_and_restart.sh`
- **Clinical Prompts**: Pre-configured with medical-specific system prompts for clinical summarization and ICD-10 suggestions

**Access the CLI:**
```bash
# Launch directly
cd toad && python3 -m toad.cli run --agent medical

# Or access the web interface (started automatically)
http://localhost:8000
```

---

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

The **CarePulse Medical AI** system is designed to work with both local and cloud AI providers. The integrated **TOAD CLI** automatically handles fallback between Ollama and Gemini.

### Local LLM (Ollama)
For maximum privacy and on-premises deployment, install Ollama with medical models:
```bash
./install_ollama.sh
```

### Cloud Fallback (Gemini)
When Ollama is unavailable or to reduce RAM usage, the system automatically falls back to Google Gemini:
- Set `USE_LOCAL_LLM=false` in your environment to use Gemini exclusively
- API key is automatically read from `.env` (`GEMINI_API_KEY`)
- No code changes required—fallback is transparent

### CarePulse Medical AI CLI
The integrated TUI provides a powerful interface for advanced users:
```bash
# Launch with local LLM (tries Ollama, falls back to Gemini)
cd toad && python3 -m toad.cli run --agent medical

# Force Gemini only
USE_LOCAL_LLM=false python3 -m toad.cli run --agent medical

# Run webserver (automatically started by rebuild_and_restart.sh)
python3 -m toad.cli run --agent medical --serve --port 8000 --host localhost
```

For development without local hardware, the system seamlessly uses Gemini as configured in your `.env` file.

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
- [Specialty Care Module](./src/app/dashboard/specialty/README.md)

## 🤝 Contributing

We welcome contributions to **CarePulse**! To ensure a smooth workflow, please follow these guidelines:

1. **Target Branch**: All development work and feature contributions should be targeted at the `dev` branch. The `main` branch is reserved for stable, production-ready releases.
2. **Fork & Clone**: Fork the repository to your own GitHub account and clone it locally.
3. **Create a Feature Branch**:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```
4. **Commit Changes**: Use descriptive commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) specification.
5. **Submit a Pull Request**: Open a PR from your feature branch to the `dev` branch of the main repository. Provide a clear description of your changes and any relevant issue numbers.

---
Developed with a focus on **Compliance**, **Usability**, and **Performance**.
