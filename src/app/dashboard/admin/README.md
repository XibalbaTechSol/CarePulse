# Admin & Settings: Agency Governance

Tools for managing organization-wide configurations, users, and module access.

## ✨ Key Features

- **User Management**: Add, remove, and assign roles (Nurse, Admin, Office) to staff.
- **Organization Config**: Set agency domains and global settings.
- **Module Control**: Toggle modules (CRM, EVV, Fax, etc.) on or off for the organization.
- **White-labeling**: Update logos, brand colors, and localized content.

## ⚙️ Configuration

- Most settings are managed via `Dashboard > Settings`.
- Role-based permissions are enforced at the server action level.

## 📂 Architecture

- **Admin Page**: `src/app/dashboard/admin/page.tsx`
- **Settings Page**: `src/app/dashboard/settings/page.tsx`
- **Models**: `Organization`, `User`, `ModuleConfig` in `schema.prisma`.
