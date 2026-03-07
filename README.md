# Gemini Productivity Skills

A collection of specialized, AI-driven skills for the Gemini CLI to enhance productivity through professional file generation and document automation.

## Available Skills

### 1. [npm-docx-expert](./docx-expert)
Expert skill for creating and editing Word (.docx) files programmatically using Node.js and the `docx` package.
- **Dynamic Documents**: Generates reports, memos, letters, and proposals.
- **Adaptive Design**: Interviews the user to adapt structure, typography, and tone.

### 2. [ieee-paper](./ieee-paper)
Advanced skill for generating and editing IEEE-compliant academic papers.
- **Compliance**: Ensures all formatting follows IEEE academic standards.
- **Iterative Drafting**: Manages JSON content files for continuous refinement.

### 3. [npm-pdf-expert](./pdf-expert)
Expert skill for creating and editing PDF files programmatically using Node.js and `pdf-lib`.
- **Visual Design**: Supports custom layouts, typography, and color palettes.
- **Thai Language Support**: Built-in strategy for embedding .ttf fonts for Thai text.

### 4. [npm-pptx-expert](./powerpoint-expert)
Expert skill for creating and editing PowerPoint (.pptx) files programmatically using Node.js and `pptxgenjs`.
- **Professional Slides**: Generates high-impact slide decks with custom layouts and shapes.
- **Interviewer Mode**: Adapts design philosophy based on user role and context.

### 5. [thai-gov-docs](./thai-gov-docs)
Specialized skill for creating Thai Government Documents (บันทึกข้อความ) according to official standards.
- **Standard Compliance**: Follows the Prime Minister's Office regulations for official correspondence.
- **Automation**: Uses `docx` to generate perfectly formatted Thai official memos.

### 6. [npm-xlsx-expert](./xlsx-expert)
Expert skill for creating and editing Excel (.xlsx) spreadsheets programmatically using Node.js and `exceljs`.
- **Data Visualization**: Generates dashboards, data tables, and structured reports.
- **Structural Integrity**: Focuses on data design philosophy and consistent formatting.

---

## Installation

Users can install these skills directly using the Gemini CLI:

### Install via URL
```bash
# Example: To install npm-docx-expert
gemini skills install https://github.com/ThanabordeeN/gemini-productivity-skills.git --path docx-expert

# Example: To install thai-gov-docs
gemini skills install https://github.com/ThanabordeeN/gemini-productivity-skills.git --path thai-gov-docs
```

### Manual Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/ThanabordeeN/gemini-productivity-skills.git
   ```
2. Link the repository to your Gemini CLI:
   ```bash
   gemini skills link ./gemini-productivity-skills
   ```

---

## Usage
Once installed, you can trigger these skills by asking Gemini to perform specific tasks:
- "Create a professional Word report about..."
- "Generate an IEEE paper draft for my research on..."
- "สร้างบันทึกข้อความราชการเรื่อง..."
- "Design a PowerPoint presentation for my project..."
- "Prepare an Excel dashboard for the quarterly data..."
