# CRM (Customer Relationship Management) Module

The CRM module is the central repository for patient, provider, and agency contacts.

## Features
- **Contact Management**: Create, read, update, and delete contact information.
- **Pipeline View**: Kanban-style view for managing patient intake or sales pipelines.
- **Integration**: Syncs with Phone and Fax modules for unified contact identification.
- **Search**: Robust search capabilities to find records quickly.

## Architecture
- **Database**: Relational mapping to `Patient`, `Provider`, and `Contact` tables.
- **Server Actions**: Secure mutations for data integrity.
- **UI**: Uses Nord UI data tables and Kanban components.
