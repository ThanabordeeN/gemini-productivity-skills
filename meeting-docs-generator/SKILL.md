---
name: meeting-docs-generator
description: Generate Thai meeting documents (.docx) including Meeting Minutes (รายงานการประชุม), Meeting Invitations (จดหมายเชิญประชุม), and Resolution Memos (บันทึกข้อความแจ้งมติที่ประชุม). Use this skill whenever the user asks to create formal documents related to meetings.
---

# Meeting Docs Generator

This skill generates professional Thai meeting documents in `.docx` format. It automatically formats the documents according to standard Thai official practices, using the "TH Sarabun New" font and proper indentation/spacing.

## Supported Document Types

Specify the document type in the JSON under `document.type`:
- `MINUTES` (รายงานการประชุม) - The minutes of the meeting.
- `INVITATION` (จดหมายเชิญประชุม) - Using memo format for invitation.
- `RESOLUTION_MEMO` (บันทึกข้อความแจ้งมติที่ประชุม) - Using memo format for broadcasting resolutions.

## How to use

1. Interpret the user's request. Ask for missing details if necessary.
2. Create a JSON file in the user's current directory (e.g., `meeting-data.json`) based on the structure shown in `assets/meeting-template.json`.
3. Ensure `docx` is installed (`npm install docx`).
4. Run the script:
   `node <path_to_this_skill>/scripts/create-meeting-doc.js meeting-data.json`
5. The generated `.docx` file will be named according to `settings.outputFileName`.

## JSON Data Structure

See `assets/meeting-template.json` for details. Fill out the relevant fields depending on the `document.type`:
- `document`: type, meetingName, meetingNo, date, time, location, docNo
- `memo_details`: department, subject, to (used by INVITATION and RESOLUTION_MEMO)
- `attendees`: present, absent (Arrays of strings, used by MINUTES)
- `agendas`: Array of objects {title, details, resolution} (used by MINUTES)
- `content`: Array of strings for the body paragraphs (used by INVITATION and RESOLUTION_MEMO)
- `meeting_end_time`: (used by MINUTES)
- `signatory`: name, position (for memo), recorder, checker (for MINUTES)
- `settings`: outputFileName
