---
name: npm-docx-expert
description: "Expert skill for creating and editing Word (.docx) files programmatically using Node.js and the docx package. Before generating, interviews the user about their domain role and preferred document design philosophy, then adapts structure, typography, layout, and tone accordingly. Use when the user wants to generate reports, memos, letters, proposals, or structured Word documents."
---

# npm Word Document Expert (docx)

## Step 1 — User Interview (ALWAYS run before writing any code)

Before generating any document, ask the user **both** questions in a single message using the `ask_user_input` tool:

```
Q1 (single_select): "What's your role / domain?"
Options:
  - Business / Finance — board reports, financial summaries, executive memos
  - Marketing / Creative — proposals, briefs, campaign copy, content plans
  - Engineering / Technical — specs, API docs, runbooks, architecture writeups
  - Academic / Research — papers, literature reviews, thesis chapters, reports

Q2 (multi_select): "What document design principle should guide this?"
Options:
  - Minimalist / Clean — clear hierarchy, generous whitespace, no decoration (Dieter Rams)
  - Structured / Scannable — headers, tables, callout boxes for fast reading
  - Narrative / Prose-first — flowing text, minimal tables, story-driven (Orwell's clarity rules)
  - Formal / Institutional — strict styles, numbered sections, citations, official tone
```

Do **not** skip this step, even if you think you already know the context.

---

## Step 2 — Apply Domain + Philosophy Profile

### Domain Profiles

| Domain | Structure | Tone | Key elements |
|---|---|---|---|
| Business / Finance | Executive summary first, appendices last | Formal, concise, action-oriented | Tables, bullet summaries, recommendations |
| Marketing / Creative | Hook → insight → action | Conversational, persuasive | Bold headers, pull quotes, minimal prose |
| Engineering / Technical | Context → spec → reference | Neutral, precise, unambiguous | Code blocks, numbered steps, diagrams |
| Academic / Research | IMRaD or equivalent | Scholarly, evidence-based | Numbered sections, citations, figures |

### Design Philosophy Rules

**Minimalist / Clean (Dieter Rams)**
- Single font family (e.g. Calibri or Arial)
- Body 11pt, Heading 1 = 18pt bold, Heading 2 = 14pt bold
- Ample paragraph spacing: `spacing: { before: 200, after: 200 }`
- No borders, no shading on body sections
- Tables: borderless or hairline borders only

**Structured / Scannable**
- Clear H1 → H2 → H3 hierarchy
- Use tables for comparisons, bullet lists for sequences
- Shaded header rows in tables: `fgColor: { argb: "FF1E2761" }`, white text
- Callout boxes using bordered `TableCell` with light fill
- Short paragraphs (≤4 lines)

**Narrative / Prose-first (Orwell's clarity rules)**
- Minimal headings — let paragraphs carry the argument
- No bullet lists unless truly enumerable
- Prefer active voice; short sentences
- Section breaks instead of visual separators
- Footnotes over inline citations

**Formal / Institutional**
- Auto-numbered headings: `1.`, `1.1`, `1.1.1`
- Page numbers in footer
- Title page with author, date, version
- Table of contents placeholder paragraph at top
- All tables and figures captioned

---

## Step 3 — Code

### Prerequisites

```javascript
const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";
const {
  Document, Packer, Paragraph, TextRun,
  HeadingLevel, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle,
} = require(G + "docx");
const fs = require("fs");
```

### Execution

1. List directory — check for existing `.js` script. If found, read it first.
2. **Edit existing** script for update requests; **create new** for new documents.
3. Run `node <filename>.js` and verify `.docx` output.

### Annotated Template

```javascript
const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";
const {
  Document, Packer, Paragraph, TextRun,
  HeadingLevel, Table, TableRow, TableCell,
  WidthType, AlignmentType,
} = require(G + "docx");
const fs = require("fs");

(async () => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [

          // ── Title ──────────────────────────────────────────
          new Paragraph({
            text: "Document Title",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // ── Subtitle / author line ──────────────────────────
          new Paragraph({
            children: [
              new TextRun({ text: "Author Name  ·  ", color: "666666", size: 20 }),
              new TextRun({ text: new Date().toDateString(), color: "666666", size: 20 }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          }),

          // ── Section heading ────────────────────────────────
          new Paragraph({
            text: "1. Executive Summary",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),

          // ── Body paragraph ─────────────────────────────────
          new Paragraph({
            children: [
              new TextRun("This document provides a "),
              new TextRun({ text: "concise overview", bold: true }),
              new TextRun(" of the topic at hand. Key findings are summarised below."),
            ],
            spacing: { before: 100, after: 200 },
          }),

          // ── Table ──────────────────────────────────────────
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Item", bold: true, color: "FFFFFF" })] })],
                    shading: { fill: "1E2761" },
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Value", bold: true, color: "FFFFFF" })] })],
                    shading: { fill: "1E2761" },
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Revenue")] }),
                  new TableCell({ children: [new Paragraph("$1,200,000")] }),
                ],
              }),
            ],
          }),

        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("output.docx", buffer);
  console.log("Generated: output.docx");
})();
```

---

## Key API Reference

| Feature | Class / Method | Notes |
|---|---|---|
| Document root | `new Document({ sections: [...] })` | One or more section objects |
| Heading | `new Paragraph({ heading: HeadingLevel.X })` | H1–H6 available |
| Body text | `new Paragraph({ children: [...] })` | Mix of `TextRun` objects |
| Styled text | `new TextRun({ text, bold, italics, color, size })` | `size` is half-points |
| Alignment | `alignment: AlignmentType.CENTER` | LEFT, CENTER, RIGHT, JUSTIFIED |
| Spacing | `spacing: { before, after, line }` | Twips (1 inch = 1440 twips) |
| Table | `new Table({ rows: [...] })` | |
| Cell shading | `shading: { fill: "HEX" }` | Hex without `#` |
| Save | `Packer.toBuffer(doc)` → `fs.writeFileSync` | Always async |

---

## Philosophy × Domain Quick-Reference

| Role \ Philosophy | Minimalist | Structured/Scannable | Narrative/Prose | Formal/Institutional |
|---|---|---|---|---|
| Business / Finance | Clean one-pager | Dashboard-style report | CEO letter | Board paper |
| Marketing / Creative | White-space brief | Campaign playbook | Brand story doc | Agency proposal |
| Engineering / Technical | Lean spec | Runbook / how-to | Architecture rationale | RFC / standard |
| Academic / Research | Clean essay | Annotated review | Thesis chapter | Journal paper |

---

## Limitations & Gotchas

- `TextRun` font `size` uses **half-points** (e.g. `size: 24` = 12pt).
- All content must be declared inside `sections[].children` — no append-after-creation.
- Thai text is supported natively in `.docx` without embedding fonts.
- This skill is for **generating** documents, not parsing/reading existing `.docx` content.

## Error Handling

```bash
node create.js 2>&1
node -e "const G = require('child_process').execSync('npm root -g').toString().trim() + '/'; require(G + 'docx'); console.log('OK')"
```