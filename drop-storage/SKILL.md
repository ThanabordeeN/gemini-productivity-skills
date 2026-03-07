---
name: drop-storage
description: Securely upload temporary files to drop.2edge.co. Use when Gemini CLI needs to share files, store temporary artifacts, or provide download links for generated assets.
---

# drop-storage

Securely upload files to `https://drop.2edge.co/api/upload` using an encrypted token system.

## Workflow

1.  **Prepare File**: Ensure the file to be uploaded exists on the filesystem.
2.  **Execute Upload**: Use the provided `upload.mjs` script. This script handles:
    *   Reading the `API_KEY` from the environment.
    *   Generating a time-limited (5-minute), AES-256-GCM encrypted `X-API-Token`.
    *   Performing a multipart/form-data POST request to the upload endpoint.
3.  **Share URL**: The script outputs a JSON response containing the public download URL and expiration time. Share this URL with the user.

## Technical Details

-   **Endpoint**: `https://drop.2edge.co/api/upload`
-   **Authentication**: `X-API-Token: <iv>:<authTag>:<encryptedPayload>`
-   **Limits**: Max 5 files (combined into zip), 50MB total size.
-   **Retention**: Files are deleted after 5 minutes.

## Setup (First Run)

If the `API_KEY` is not set in the environment or the skill's internal `.env` file:
1. Ask the user for their `drop.2edge.co` API Key.
2. Create a `.env` file in the skill's `scripts/` directory:
   ```bash
   echo "API_KEY=<user-provided-key>" > <skill-path>/scripts/.env
   ```

## Script Usage

```bash
# Upload a file (the script will automatically load the API_KEY from its own .env if not in env)
node <skill-path>/scripts/upload.mjs /path/to/file.ext
```

### Output Format
```json
{
  "id": "1234",
  "url": "https://drop.2edge.co/1234",
  "expiresAt": 1741364701234,
  "filename": "file.ext"
}
```
