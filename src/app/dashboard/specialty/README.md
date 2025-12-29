# Specialty Care Modules

This directory contains specialized clinical dashboards tailored for specific medical disciplines. These modules provide focused workflows and data visualization for specialist care teams.

## Modules

### 1. Oncology
- **Path**: `/dashboard/specialty/oncology`
- **Purpose**: Manage chemotherapy cycles, infusion schedules, and patient treatment plans.
- **Features**:
  - Active treatment tracking.
  - Cycle progression bars.
  - Toxicity logging.

### 2. Maternal & Neonatal (L&D)
- **Path**: `/dashboard/specialty/maternal`
- **Purpose**: Monitor active labor, delivery, and NICU status.
- **Features**:
  - Real-time labor board (Dilation, Effacement, Station).
  - Fetal heart rate monitoring hooks.
  - NICU bed status.

### 3. Wound Care
- **Path**: `/dashboard/specialty/wound-care`
- **Purpose**: Track wound healing progress and assessments.
- **Features**:
  - Wound measurement logging (Size, Stage).
  - Image placeholder for progression (future integration).
  - Status indicators (Improving, Stagnant).

### 4. Cardiology (Planned)
- **Path**: `/dashboard/specialty/cardiology`
- **Purpose**: Telemetry and cardiac rehabilitation tracking.

### 5. Mental Health (Planned)
- **Path**: `/dashboard/specialty/mental-health`
- **Purpose**: Session management and PHQ-9 progress tracking.

## Architecture
Each specialty module utilizes the `ModuleLayout` for consistency and Nord UI components for a unified aesthetic. Data is fetched via specialized server actions in `@/lib/actions/specialty`.
