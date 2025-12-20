# Fax Module: Digital Cloud Faxing

Seamlessly integrate traditional faxing into your digital workflow using the SRFax network.

## ✨ Key Features

- **Fax Composer**: Upload and send documents as faxes with real-time status tracking.
- **Fax Inbox**: Receive digital faxes directly in the dashboard.
- **History**: Searchable log of sent and received faxes with downloadable PDF previews.
- **SRFax Integration**: Backed by a high-reliability fax network.

## ⚙️ Configuration

1. Secure your **SRFax Account ID** and **Password**.
2. Navigate to `Dashboard > Settings` to globally configure Fax credentials.
3. Once configured, the system will automatically fetch incoming faxes and enable the composer.

## 📂 Architecture

- **Page**: `src/app/dashboard/fax/page.tsx`
- **Actions**: `src/lib/actions/fax.ts` (SRFax API wrappers)
- **Model**: `Fax` in `schema.prisma`.
