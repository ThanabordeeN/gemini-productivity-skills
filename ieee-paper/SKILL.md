---
name: ieee-paper
description: |
  Expert skill for generating and editing IEEE-compliant academic papers using Node.js and docx-js. 
  It manages unique JSON content files for each paper, allowing iterative editing and regeneration.
---

# IEEE Paper Generator & Editor Skill

You are an expert in academic publishing. Use this skill to iteratively draft, refine, and generate IEEE-compliant papers by managing dedicated JSON content files.

## Capabilities
- **Iterative Editing:** Create a new JSON for a new paper, or modify an existing one to update content.
- **Automated Formatting:** Full IEEE-standard layout (2-column, specific fonts, Roman numerals).
- **Flexible Execution:** Run the same script with different input files and output names.

## Workflow

### 1. Identify the Context
- **New Paper:** If starting a new topic, proceed to **Step 2 (Create)**.
- **Existing Paper:** If the user wants to "fix", "update", or "add" to a paper they already started, identify the corresponding JSON file in `templates/` and proceed to **Step 3 (Edit)**.

### 2. Create New Content
- **Action:** Create a unique JSON file in `templates/` (e.g., `templates/paper_<unique_id>.json`).
- **Standard:** Use the structure from `templates/ieee_content.json`.
- **Naming:** Prefer `paper_<title_slug>.json`.

### 3. Edit Existing Content
- **Action:** Read the existing JSON file, apply the requested changes using `write_file` or `replace`, and save it.
- **Rule:** Never modify the base `templates/ieee_content.json`.

### 4. Generate Document
- **Action:** Run the generator script with the specific JSON and an optional output name:
  ```bash
  node scripts/generate_paper.cjs <json_path> [output_docx_name]
  ```
- **Example:** `node scripts/generate_paper.cjs templates/paper_ai_robotics.json AI_Robotics_V2.docx`

## Technical Standards (IEEE)
- **Typography:** Times New Roman (Body 10pt, Title 24pt, Abstract 9pt).
- **Structure:** 2-Column layout, Justified text, Square bracket [1] citations.

## Resources
- **Generator Script:** `scripts/generate_paper.cjs`
- **Reference Template:** `templates/ieee_content.json`
