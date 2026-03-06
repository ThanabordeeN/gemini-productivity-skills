---
name: npm-pdf-expert
description: "Expert skill for creating and editing PDF files programmatically using Node.js and pdf-lib. Before generating, interviews the user about their domain role and preferred visual design philosophy, then adapts layout, typography, color palette, and document structure accordingly. Use when the user wants to generate PDFs from scratch, draw text, shapes, or images on pages. Note: StandardFonts do NOT support Thai text — a .ttf font must be embedded."
---

# npm PDF Expert (pdf-lib)

## Step 1 — User Interview (ALWAYS run before writing any code)

Before generating any PDF, ask the user **both** questions in a single message using the `ask_user_input` tool:

```
Q1 (single_select): "What's your role / domain?"
Options:
  - Business / Finance — invoices, financial reports, executive summaries
  - Marketing / Creative — brochures, proposals, one-pagers, event flyers
  - Engineering / Technical — technical specs, certificates, data sheets
  - Academic / Research — papers, posters, certificates, formatted reports

Q2 (multi_select): "What visual design philosophy should guide this PDF?"
Options:
  - Minimalist / Clean — white space, single accent color, no clutter (Dieter Rams)
  - Editorial / Magazine — bold typography, strong visual hierarchy, striking layout
  - Data-driven / Tufte — dense but clear, annotations on data, no decorative ink
  - Corporate / Branded — brand palette, logo placement, template consistency
```

Do **not** skip this step, even if you think you already know the context.

---

## Step 2 — Apply Domain + Philosophy Profile

### Domain Profiles

| Domain | Layout | Tone | Key features |
|---|---|---|---|
| Business / Finance | Portrait A4, structured sections | Formal, authoritative | Tables, totals, header/footer, page numbers |
| Marketing / Creative | Portrait or landscape, free-form | Emotive, visual-first | Large type, color blocks, image areas |
| Engineering / Technical | Portrait A4, dense | Precise, neutral | Monospace text, diagrams, numbered sections |
| Academic / Research | Portrait A4, IMRaD-style | Scholarly | Abstract block, section numbers, figure captions |

### Design Philosophy Rules

**Minimalist / Clean (Dieter Rams)**
- Background: white `rgb(1,1,1)`
- Single accent color, used sparingly (e.g. navy `rgb(0.1, 0.13, 0.38)`)
- Body: Helvetica 11pt; Headings: HelveticaBold 16pt / 13pt
- Wide margins (≥50pt all sides)
- Horizontal rule instead of filled header bars

**Editorial / Magazine**
- Full-width header band with strong background color
- Display title: 36–48pt bold, high contrast
- Pull quotes or call-out boxes using `drawRectangle` with accent fill
- Varied font sizes to create rhythm: 48pt hero → 18pt subhead → 11pt body
- Use `drawLine` sparingly as a typographic separator

**Data-driven / Tufte**
- White background only; no decorative fills
- Tables drawn with hairline `drawLine` borders, no shading
- Data labels drawn directly beside values
- Muted grey palette `rgb(0.4, 0.4, 0.4)` for supporting text; one highlight color for key figures
- Maximum content density per page without crowding

**Corporate / Branded**
- Ask user for brand hex colors; convert to rgb(r,g,b) fractions
- Logo placeholder rectangle in consistent corner
- Header band (`drawRectangle` full width, height 60pt) + footer band (height 30pt)
- Page numbers in footer
- Every page: company name + document title in header

---

## Step 3 — Code

### Prerequisites

```javascript
const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";
const { PDFDocument, rgb, StandardFonts, degrees } = require(G + "pdf-lib");
const fs = require("fs");
```

### Execution

1. List directory — check for existing `.js` script. If found, read it first.
2. **Edit existing** script for update requests; **create new** for new PDFs.
3. Run `node <filename>.js` and verify `.pdf` output.

### Annotated Template

```javascript
const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";
const { PDFDocument, rgb, StandardFonts } = require(G + "pdf-lib");
const fs = require("fs");

// ── Color palette (swap per philosophy) ──────────────────────
const COLORS = {
  primary:   rgb(0.10, 0.13, 0.38), // navy
  accent:    rgb(0.90, 0.22, 0.27), // red
  body:      rgb(0.15, 0.15, 0.15),
  muted:     rgb(0.55, 0.55, 0.55),
  white:     rgb(1, 1, 1),
  pageBg:    rgb(1, 1, 1),
};

// ── Page sizes (points) ───────────────────────────────────────
const A4 = [595, 842];

(async () => {
  const pdfDoc = await PDFDocument.create();
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const font     = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ── Page 1 ────────────────────────────────────────────────
  const page = pdfDoc.addPage(A4);
  const { width, height } = page.getSize();
  const margin = 50;

  // Header band (Corporate / Editorial style)
  page.drawRectangle({
    x: 0, y: height - 70,
    width, height: 70,
    color: COLORS.primary,
  });
  page.drawText("Company Name", {
    x: margin, y: height - 28,
    size: 11, font, color: COLORS.white,
  });
  page.drawText("Confidential Report  ·  2024", {
    x: margin, y: height - 46,
    size: 9, font, color: rgb(0.7, 0.7, 0.85),
  });

  // Document title
  page.drawText("Annual Performance Report", {
    x: margin, y: height - 110,
    size: 28, font: boldFont, color: COLORS.primary,
  });

  // Horizontal rule
  page.drawLine({
    start: { x: margin, y: height - 122 },
    end:   { x: width - margin, y: height - 122 },
    thickness: 1, color: COLORS.accent,
  });

  // Section heading
  page.drawText("1. Executive Summary", {
    x: margin, y: height - 152,
    size: 14, font: boldFont, color: COLORS.primary,
  });

  // Body text (manual line wrapping)
  const bodyLines = [
    "This report presents a comprehensive overview of the organisation's",
    "performance for the fiscal year. Key metrics indicate sustained growth",
    "across all primary business units.",
  ];
  bodyLines.forEach((line, i) => {
    page.drawText(line, {
      x: margin, y: height - 178 - (i * 18),
      size: 11, font, color: COLORS.body,
    });
  });

  // Highlight / call-out box
  page.drawRectangle({
    x: margin, y: height - 290,
    width: width - margin * 2, height: 50,
    color: rgb(0.93, 0.96, 1.0),
  });
  page.drawText("Key Result:  Revenue grew 22% YoY to $14.2M", {
    x: margin + 14, y: height - 270,
    size: 13, font: boldFont, color: COLORS.primary,
  });

  // Footer
  page.drawRectangle({
    x: 0, y: 0, width, height: 30,
    color: rgb(0.95, 0.95, 0.95),
  });
  page.drawText("Page 1", {
    x: width - 70, y: 10,
    size: 9, font, color: COLORS.muted,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync("output.pdf", pdfBytes);
  console.log("Generated: output.pdf");
})();
```

---

## Thai / Non-Latin Font Support

StandardFonts **do not** support Thai characters. Embed a `.ttf` file:

```javascript
const fontBytes = fs.readFileSync("/path/to/Sarabun-Regular.ttf");
const thaiFont  = await pdfDoc.embedFont(fontBytes);

page.drawText("ข้อความภาษาไทย", {
  x: 50, y: 700,
  size: 14, font: thaiFont,
  color: rgb(0, 0, 0),
});
```

---

## Key API Reference

| Feature | Method | Notes |
|---|---|---|
| Create doc | `PDFDocument.create()` | |
| Load existing | `PDFDocument.load(bytes)` | Modify existing file |
| Add page | `pdfDoc.addPage([w, h])` | Points; A4 = 595×842 |
| Get size | `page.getSize()` | Returns `{ width, height }` |
| Embed font | `pdfDoc.embedFont(StandardFonts.X)` | Or pass TTF bytes |
| Draw text | `page.drawText(str, { x, y, size, font, color })` | No auto-wrap |
| Draw line | `page.drawLine({ start, end, thickness, color })` | |
| Draw rect | `page.drawRectangle({ x, y, width, height, color })` | |
| Draw ellipse | `page.drawEllipse({ x, y, xScale, yScale, color })` | |
| Embed PNG | `pdfDoc.embedPng(bytes)` | |
| Embed JPG | `pdfDoc.embedJpg(bytes)` | |
| Draw image | `page.drawImage(img, { x, y, width, height })` | |
| Rotation | Pass `rotate: degrees(45)` in draw options | Import `degrees` |
| Save | `pdfDoc.save()` → `fs.writeFileSync` | Returns Uint8Array |

## Color Conversion (hex → pdf-lib rgb)

```javascript
// Hex "1A1A2E" → rgb(0.102, 0.102, 0.180)
const hexToRgb = hex => ({
  r: parseInt(hex.slice(0,2),16)/255,
  g: parseInt(hex.slice(2,4),16)/255,
  b: parseInt(hex.slice(4,6),16)/255,
});
const c = hexToRgb("1A1A2E");
// rgb(c.r, c.g, c.b)
```

## Common Page Sizes

| Size | Width | Height |
|---|---|---|
| A4 | 595 | 842 |
| A3 | 842 | 1190 |
| Letter | 612 | 792 |
| Legal | 612 | 1008 |

---

## Philosophy × Domain Quick-Reference

| Role \ Philosophy | Minimalist | Editorial | Data-driven | Corporate |
|---|---|---|---|---|
| Business / Finance | Clean invoice / summary | Bold exec one-pager | Dense financial table | Branded board report |
| Marketing / Creative | White-space brochure | Magazine-style flyer | Metrics one-pager | On-brand proposal |
| Engineering / Technical | Lean data sheet | Visual architecture doc | Dense spec table | Branded tech doc |
| Academic / Research | Clean paper layout | Conference poster | Figure-dense report | Institutional paper |

---

## Limitations & Gotchas

- Origin `(0,0)` is **bottom-left** — `y` increases upward.
- `drawText` does **not** auto-wrap — split strings manually across multiple calls.
- StandardFonts (Helvetica, Times, Courier) **do not support Thai or CJK**.
- This skill is for **generating** PDFs, not parsing complex existing documents.

## Error Handling

```bash
node create.js 2>&1
node -e "const G = require('child_process').execSync('npm root -g').toString().trim() + '/'; require(G + 'pdf-lib'); console.log('OK')"
```