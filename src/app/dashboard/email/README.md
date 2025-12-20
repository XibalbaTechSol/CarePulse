# Email Module: Unified Mail Client

An integrated mail client supporting IMAP and SMTP to manage business communications alongside client and clinical data.

## ✨ Key Features

- **Unified Inbox**: View emails from multiple configured accounts.
- **Composer**: Full-featured email composition and sending.
- **IMAP/SMTP Support**: Works with Gmail, Outlook, and private mail servers.
- **Contextual Access**: Emails are linked to CRM contacts when addresses match.

## ⚙️ Configuration

1. Navigate to `Dashboard > Email`.
2. Provide your server details:
    - **IMAP Host/Port**
    - **SMTP Host/Port**
    - **Username & Password**
3. Ensure your mail provider allows IMAP/SMTP access (e.g., App Passwords for Gmail).

## 📂 Architecture

- **Page**: `src/app/dashboard/email/page.tsx`
- **Actions**: `src/lib/actions/email.ts`
- **Model**: `EmailAccount` in `schema.prisma`.
