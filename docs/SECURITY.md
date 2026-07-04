# Security Specifications

This document outlines the security controls, validation systems, and storage boundaries implemented in the project.

---

## 1. Password-Protected Site Editor

Admin panel actions (editing cases, updating site config, uploading files) are locked behind a passcode validation modal.

- **Storage**: Passcode verification occurs on the server to prevent bypass.
- **Passcode Configuration**: The default passcode is configured in backend environmental configurations.

---

## 2. API Validation and Inputs

To prevent arbitrary script injections, all content saved to the database files is parsed and normalized.

- **Express JSON Limits**: Payloads are restricted to safe sizes to block server memory attacks.
- **Strict Headers**: REST write operations require correct `application/json` headers.

---

## 3. Safe Media Uploads (Multer Constraints)

The `/api/upload` endpoint uses the **Multer** file parsing middleware to enforce strict validation limits:

- **File Type Restrictions**: Only image formats (`image/png`, `image/jpeg`, `image/jpg`, `image/webp`) are allowed. Any execution files or other formats are rejected.
- **Size Boundaries**: Uploads are restricted to **5MB** to prevent server disk space depletion.
- **Renaming Conventions**: Files are renamed with timestamp prefixes to avoid directory traversal and filename collisions.
