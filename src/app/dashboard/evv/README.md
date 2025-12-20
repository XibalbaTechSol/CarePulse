# EVV Module: Electronic Visit Verification

A DHS-compliant module for tracking caregiver visits using GPS verification and synchronizing data with the Sandata aggregator.

## ✨ Key Features

- **Visit Tracker**: Real-time GPS verification for starting and ending visits.
- **Sandata Sync**: Automated and manual synchronization of visit data with the Sandata data aggregator.
- **Service Types**: Support for Personal Care (T1019), Respite Care (S5150), and more.
- **Visit History**: Comprehensive log of all visits with GPS logs and sync status.
- **Compliance**: Enforces GPS signal acquisition before visit start.

## ⚙️ Configuration

1. Navigate to `Dashboard > EVV > Configuration`.
2. Provide your **Sandata Credentials**:
    - **Agency ID**
    - **Provider ID (Medicaid)**
    - **Username & Password**
3. Select the Environment (**Test** or **Production**).

## 📂 Architecture

- **Page**: `src/app/dashboard/evv/page.tsx`
- **Actions**: `src/lib/actions/evv.ts`
- **Models**: `Visit`, `SandataConfig` in `schema.prisma`.
