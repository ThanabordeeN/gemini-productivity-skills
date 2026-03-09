---
name: executive-docs-generator
description: Generate Thai executive documents (.docx) including Official Letters (หนังสือราชการ), Memos (บันทึกข้อความ), and Power of Attorney (หนังสือมอบอำนาจ) using TH Sarabun New. Use this skill whenever the user asks to create formal government or executive documents.
---

# Executive Docs Generator

This skill generates professional Thai executive and government-style documents in `.docx` format. It automatically formats the documents according to standard Thai official practices, using the "TH Sarabun New" font and proper indentation/spacing.

## Supported Document Types

Specify the document type in the JSON under `document.type`:
- `MEMO` (บันทึกข้อความ) - For internal communications.
- `OFFICIAL_LETTER` (หนังสือราชการ/หนังสือภายนอก) - For external formal letters.
- `POWER_OF_ATTORNEY` (หนังสือมอบอำนาจ) - For legal proxy authorization.

## How to use

1. Interpret the user's request. Ask for missing details if necessary.
2. Create a JSON file in the user's current directory (e.g., `exec-data.json`) based on the structure shown in `assets/exec-doc-template.json`.
3. Ensure `docx` is installed (`npm install docx`).
4. Run the script:
   `node <path_to_this_skill>/scripts/create-exec-doc.js exec-data.json`
5. The generated `.docx` file will be named according to `settings.outputFileName`.

## JSON Data Structure

See `assets/exec-doc-template.json` for details. Fill out the relevant fields depending on the `document.type`:
- `document`: type, docNo, date, location (for POA)
- `memo_details`: department, subject, to, reference, attachments (used by MEMO and OFFICIAL_LETTER)
- `poa_details`: grantor, grantee, power (used by POWER_OF_ATTORNEY)
- `content`: Array of strings for the body paragraphs
- `signatory`: name, position
- `settings`: outputFileName
