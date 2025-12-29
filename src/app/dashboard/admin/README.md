# Admin Dashboard Module

The Admin Dashboard provides administrative capabilities for the CarePulse platform, focusing on extensive resource management, credentials verification, and revenue tracking.

## Sub-Modules

### 1. Revenue Cycle Management (RCM)
- **Path**: `/dashboard/admin/rcm`
- **Key Features**:
  - Validates claim status (Paid, Denied, Pending).
  - Visualization of revenue trends.
  - Tracking of denial rates and average days to payment.

### 2. Supply Chain & Inventory
- **Path**: `/dashboard/admin/inventory`
- **Key Features**:
  - Stock level monitoring (Low Stock alerts).
  - Direct reordering capability.
  - Value summary of current inventory.

### 3. Credentialing
- **Path**: `/dashboard/admin/credentialing`
- **Key Features**:
  - Provider profile management.
  - Alerts for expiring credentials (DEA, Medical License).
  - Status tracking (Verified, Expiring Soon).

### 4. Analytics
- **Path**: `/dashboard/admin/analytics`
- **Key Features**:
  - Quality performance metrics (Readmissions, Patient Satisfaction).
  - HEDIS measure tracking.
  - Visual trends for key healthcare indicators.

## Tech Stack
- **UI Components**: `@/components/nord` (Card, Badge, Button), `recharts` for visualization.
- **Icons**: `lucide-react`.
- **Data Fetching**: Server actions located in `@/lib/actions/administrative`.
