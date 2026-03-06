---
name: npm-file-creator
description: "Comprehensive Node.js/npm toolkit for creating, editing, and updating Microsoft Office files (PowerPoint, Word, Excel) and PDFs programmatically. When Claude needs to generate new reports from scratch, edit existing document scripts, assemble slides, or build spreadsheets using JS packages like pptxgenjs, docx, exceljs, or pdf-lib. Use for automated document workflows and precise formatting tasks. Not for reading or parsing complex existing PDF/Word content."
---

# npm File Creator

## Overview

This skill provides instructions for creating, editing, and updating Office files (.pptx, .docx, .xlsx) and PDFs programmatically using Node.js.

**CRITICAL DIFFERENTIATION:**

- **Create New (สร้าง/ทำใหม่):** Generate a new script and output file.
- **Edit/Update (แก้/ปรับปรุง):** Modify the _existing_ script instead of creating new versioned files (e.g., `create2.js`).

## Prerequisites

All required packages are pre-installed globally. Use this snippet to dynamically resolve the global `node_modules` path in your scripts:

```javascript
const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";

// Import required packages dynamically:
const PptxGenJS = require(G + "pptxgenjs");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
} = require(G + "docx");
const ExcelJS = require(G + "exceljs");
const { PDFDocument, rgb, StandardFonts } = require(G + "pdf-lib");
```

## Execution Steps

**1. Research Phase**

- List the directory (`list_directory`) to check for existing Node.js scripts (e.g., `create.js`).
- If a script exists, read it (`read_file`) to understand the current logic and structure.

**2. Decision Logic**
Determine the user's intent based on their prompt:

- **Edit/Update:** Look for keywords like "แก้", "เปลี่ยน", "เพิ่มสไลด์", "ปรับสี", "update".
  - _Action:_ Modify the existing `.js` script using replace/write tools. Do NOT create new files.
- **Create New:** Look for keywords like "สร้าง", "ทำไฟล์ใหม่", "generate".
  - _Action:_ Create a new `.js` script with a descriptive name.
- _Unsure:_ If the request is ambiguous, use the `ask_user` tool to confirm the intent before writing code.

**3. Execution & Verification**

- Write or modify the Node.js script.
- Execute the script using `node <filename>.js`.
- Verify the output file (e.g., `.pptx`, `.pdf`) was generated successfully in the directory.

## Examples

### PowerPoint (pptxgenjs)

```javascript
const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";
const PptxGenJS = require(G + "pptxgenjs");

(async () => {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";

  const slide = pptx.addSlide();
  slide.background = { color: "1E2761" };

  slide.addText("Title", {
    x: 1,
    y: 1.5,
    w: 11,
    h: 1.5,
    fontSize: 44,
    bold: true,
    color: "FFFFFF",
    align: "center",
  });

  // IMPORTANT: Always use string shape names ("rect", "roundRect", "ellipse")
  slide.addShape("rect", {
    x: 0.5,
    y: 0.5,
    w: 3,
    h: 1,
    fill: { color: "FF0000" },
  });

  await pptx.writeFile({ fileName: "output.pptx" });
  console.log("Generated: output.pptx");
})();
```

### Word Document (docx)

```javascript
const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require(
  G + "docx",
);
const fs = require("fs");

(async () => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "Document Title",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun("Normal text "),
              new TextRun({ text: "Bold", bold: true }),
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

### Excel Spreadsheet (exceljs)

```javascript
const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";
const ExcelJS = require(G + "exceljs");

(async () => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data");

  sheet.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Sales", key: "sales", width: 15 },
  ];

  sheet.addRow({ name: "Product A", sales: 50000 });

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E2761" },
  };

  await workbook.xlsx.writeFile("output.xlsx");
  console.log("Generated: output.xlsx");
})();
```

### PDF Generation (pdf-lib)

```javascript
const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";
const { PDFDocument, rgb, StandardFonts } = require(G + "pdf-lib");
const fs = require("fs");

(async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 Size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText("Hello PDF", {
    x: 50,
    y: 750,
    size: 30,
    font,
    color: rgb(0, 0.2, 0.6),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync("output.pdf", pdfBytes);
  console.log("Generated: output.pdf");
})();
```

## Error Handling

If a script fails during execution:

- Run the script with explicit error output: `node <filename>.js 2>&1`
- Verify the global package is available dynamically:
  ```bash
  node -e "const G = require('child_process').execSync('npm root -g').toString().trim() + '/'; require(G + 'pptxgenjs'); console.log('OK')"
  ```
- Check for Node.js syntax errors or incorrect dynamically resolved imports.

## Limitations

- **PDF Thai Fonts Support:** StandardFonts (Helvetica, Times, Courier) in `pdf-lib` do NOT support Thai text. To use Thai text, you must embed a `.ttf` font file explicitly.
- **pptxgenjs Shapes:** Do NOT use `pptx.ShapeType.XXX`. Always use explicit string names like `"rect"`, `"roundRect"`, `"ellipse"`, `"triangle"`, `"line"`.
- **Parsing Restrictions:** This skill is strictly for _generating_ and _programmatically updating_ files. It should not be used for natively parsing complex PDF or Office documents.
