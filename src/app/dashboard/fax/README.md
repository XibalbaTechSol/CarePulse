# Virtual Fax Module

The Fax module allows for HIPAA-compliant digital faxing, replacing traditional hardware.

## Features
- **Inbox**: View received faxes with status tracking.
- **Composer**: Send faxes with cover sheets and file attachments.
- **Contact Integration**: Select recipients directly from the CRM.
- **Status Tracking**: Monitor transmission status (Queued, Sent, Failed).

## Architecture
- **Provider**: Integrated with SRFax / InterFAX (configurable).
- **PDF Generation**: Auto-generates cover sheets.
- **Storage**: Securely stores fax documents with audit logging.

## Usage
Navigate to `/dashboard/fax` to view the inbox or compose a new fax.
