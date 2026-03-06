---
name: npm-xlsx-expert
description: "Expert skill for creating and editing Excel (.xlsx) spreadsheets programmatically using Node.js and exceljs. Before generating, interviews the user about their domain role and preferred data design philosophy, then adapts structure, formatting, color scheme, and layout accordingly. Use when the user wants to generate spreadsheets, dashboards, data tables, or reports in .xlsx format."
---

# npm Excel Expert (exceljs)

## Step 1 — User Interview (ALWAYS run before writing any code)

Before generating any spreadsheet, ask the user **both** questions in a single message using the `ask_user_input` tool:

```
Q1 (single_select): "What's your role / domain?"
Options:
  - Business / Finance — P&L, budgets, forecasts, KPI trackers
  - Marketing / Creative — campaign trackers, content calendars, performance dashboards
  - Engineering / Technical — test matrices, system metrics, data pipelines
  - Academic / Research — datasets, survey results, statistical summaries

Q2 (multi_select): "What data design principle should guide this spreadsheet?"
Options:
  - Minimalist / Clean — neutral palette, clean grid, no visual noise
  - Dashboard / Visual — bold headers, color-coded status, highlight key numbers
  - Data-integrity first — structured tables, validation, formula transparency (Tufte-inspired)
  - Corporate / Branded — brand colors, logo cell, standardised template
```

Do **not** skip this step, even if you think you already know the context.

---

## Step 2 — Apply Domain + Philosophy Profile

### Domain Profiles

| Domain | Sheet structure | Key features | Typical outputs |
|---|---|---|---|
| Business / Finance | Summary → Detail → Assumptions | Currency formats, totals, variance | P&L, budget tracker, forecast model |
| Marketing / Creative | Overview → Channel breakdown | Status colors, date columns, %-progress | Campaign tracker, content calendar |
| Engineering / Technical | Config → Data → Log | Monospace for codes, boolean flags | Test matrix, metrics log, pipeline |
| Academic / Research | Metadata → Raw data → Analysis | Strict types, source column, no merged cells | Survey data, results table, codebook |

### Design Philosophy Rules

**Minimalist / Clean (Dieter Rams inspired)**
- Background: white; alternating row fill: `"F5F5F5"` (very light grey)
- Header fill: `"333333"`, white bold text
- No cell borders except outer table border: `{ style: "thin" }`
- Single accent color for totals/highlights: `"1A1A2E"`
- Font: Calibri 11pt body, 12pt headers

**Dashboard / Visual**
- Bold colored header bands per section
- Status columns: green `"27AE60"` / amber `"F39C12"` / red `"E74C3C"` fills
- Key metric cells: large font (14–16pt), bold, accent fill
- Freeze top row and first column
- Use `autoFilter` on all data tables

**Data-integrity first (Tufte-inspired)**
- White background only; no decorative fills
- Borders: hairline `"thin"` on all data cells
- No merged cells in data regions — merge only in title rows
- Formula cells clearly distinguishable (italic or light blue `"EBF5FB"` fill)
- Column headers describe units: e.g. `"Revenue (USD)"`, `"Date (YYYY-MM-DD)"`

**Corporate / Branded**
- Ask user for brand hex colors; use placeholders `"003087"` / `"FFD700"` until confirmed
- Title row with company name, report name, date — spanning merged cells
- Consistent column widths matching brand template
- Footer row with "Confidential" label and version number

---

## Step 3 — Code

### Prerequisites

```javascript
const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";
const ExcelJS = require(G + "exceljs");
```

### Execution

1. List directory — check for existing `.js` script. If found, read it first.
2. **Edit existing** script for update requests; **create new** for new spreadsheets.
3. Run `node <filename>.js` and verify `.xlsx` output.

### Annotated Template

```javascript
const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";
const ExcelJS = require(G + "exceljs");

(async () => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "npm-xlsx-expert";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Report", {
    views: [{ state: "frozen", ySplit: 1 }], // freeze header row
  });

  // ── Column definitions ──────────────────────────────────────
  sheet.columns = [
    { header: "Product",       key: "product", width: 28 },
    { header: "Q1 (USD)",      key: "q1",      width: 16 },
    { header: "Q2 (USD)",      key: "q2",      width: 16 },
    { header: "Total (USD)",   key: "total",   width: 16 },
    { header: "Status",        key: "status",  width: 14 },
  ];

  // ── Data rows ───────────────────────────────────────────────
  const data = [
    { product: "Widget A", q1: 12000, q2: 15000, status: "On Track" },
    { product: "Widget B", q1: 8500,  q2: 9200,  status: "At Risk" },
    { product: "Widget C", q1: 22000, q2: 18500, status: "On Track" },
  ];

  data.forEach(row => {
    sheet.addRow({ ...row, total: row.q1 + row.q2 });
  });

  // ── Style header row ────────────────────────────────────────
  const headerRow = sheet.getRow(1);
  headerRow.font     = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
  headerRow.fill     = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E2761" } };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height   = 26;

  // ── Style data rows ─────────────────────────────────────────
  sheet.eachRow((row, rowNum) => {
    if (rowNum === 1) return;

    // Alternating row fill
    if (rowNum % 2 === 0) {
      row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F5F5" } };
    }

    // Status color coding
    const statusCell = row.getCell("status");
    if (statusCell.value === "On Track") {
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD5F5E3" } };
      statusCell.font = { color: { argb: "FF1E8449" }, bold: true };
    } else if (statusCell.value === "At Risk") {
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDEBD0" } };
      statusCell.font = { color: { argb: "FFB7770D" }, bold: true };
    }
  });

  // ── Number format ────────────────────────────────────────────
  ["q1", "q2", "total"].forEach(key => {
    sheet.getColumn(key).numFmt  = "#,##0";
    sheet.getColumn(key).alignment = { horizontal: "right" };
  });

  // ── Totals row ───────────────────────────────────────────────
  const lastRow = sheet.rowCount;
  const totalsRow = sheet.addRow({
    product: "TOTAL",
    q1:    { formula: `SUM(B2:B${lastRow})` },
    q2:    { formula: `SUM(C2:C${lastRow})` },
    total: { formula: `SUM(D2:D${lastRow})` },
  });
  totalsRow.font = { bold: true };
  totalsRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD6EAF8" } };

  // ── Auto-filter ──────────────────────────────────────────────
  sheet.autoFilter = { from: "A1", to: "E1" };

  await workbook.xlsx.writeFile("output.xlsx");
  console.log("Generated: output.xlsx");
})();
```

---

## Key API Reference

| Feature | Method / Property | Notes |
|---|---|---|
| New workbook | `new ExcelJS.Workbook()` | |
| Add worksheet | `workbook.addWorksheet("Name", opts)` | `opts` supports `views` (freeze) |
| Define columns | `sheet.columns = [{ header, key, width }]` | Sets headers and widths |
| Add row | `sheet.addRow({ key: value })` | Matches column keys |
| Get row | `sheet.getRow(n)` | 1-indexed |
| Get cell | `sheet.getCell("A1")` or `(row, col)` | col is 1-indexed |
| Font | `cell.font = { bold, size, color: { argb } }` | ARGB: `"FF"` + hex |
| Fill | `cell.fill = { type:"pattern", fgColor:{argb} }` | |
| Alignment | `cell.alignment = { horizontal, vertical, wrapText }` | |
| Border | `cell.border = { top, bottom, ... }` | Each side: `{ style:"thin" }` |
| Number format | `cell.numFmt = "#,##0.00"` | Standard Excel format strings |
| Formula | `cell.value = { formula: "SUM(A1:A10)" }` | |
| Merge cells | `sheet.mergeCells("A1:D1")` | Avoid in data regions |
| Freeze | `views: [{ state:"frozen", ySplit:1 }]` | In worksheet options |
| Auto-filter | `sheet.autoFilter = { from, to }` | |
| Save | `workbook.xlsx.writeFile("output.xlsx")` | Returns Promise |

---

## Philosophy × Domain Quick-Reference

| Role \ Philosophy | Minimalist | Dashboard/Visual | Data-integrity | Corporate/Branded |
|---|---|---|---|---|
| Business / Finance | Clean P&L model | KPI dashboard | Audit-ready ledger | Branded board report |
| Marketing / Creative | Simple tracker | Campaign dashboard | UTM data table | Agency deliverable |
| Engineering / Technical | Lean metrics log | System health board | Structured test matrix | Branded tech report |
| Academic / Research | Clean dataset | Summary overview | Codebook + raw data | Institutional report |

---

## Limitations & Gotchas

- ARGB colors include alpha prefix: `"FFFFFFFF"` = opaque white, `"FF1E2761"` = opaque navy.
- Row and column indices are **1-based**.
- Avoid merging cells inside data ranges — it breaks sorting and filtering.
- This skill is for **generating** spreadsheets, not deeply parsing complex existing `.xlsx` files.

## Error Handling

```bash
node create.js 2>&1
node -e "const G = require('child_process').execSync('npm root -g').toString().trim() + '/'; require(G + 'exceljs'); console.log('OK')"
```