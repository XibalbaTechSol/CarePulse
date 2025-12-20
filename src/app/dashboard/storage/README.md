# Storage Module: Secure Document Management

A centralized repository for managing client documents, compliance records, and agency files.

## ✨ Key Features

- **Folder Hierarchy**: Organize documents into custom folders.
- **Starring**: Quick access to important files.
- **Search**: Fast lookup by document name or type.
- **Encryption**: Designed to support application-layer encryption for sensitive health data.

## ⚙️ Configuration

- Document storage paths and encryption keys can be configured in the global settings.
- The module uses the local filesystem or cloud providers (S3/Azure) based on the environment configuration.

## 📂 Architecture

- **Page**: `src/app/dashboard/storage/page.tsx`
- **Model**: `Document` in `schema.prisma`.
