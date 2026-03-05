---
name: npm-file-creator
description: Use this skill whenever the user wants to create or generate Office files (PowerPoint, Word, Excel) or PDFs using Node.js/npm libraries. Trigger when the user says things like "สร้างไฟล์ PowerPoint", "สร้าง Word doc", "สร้าง Excel", "generate a .pptx", "create a .docx", "make a spreadsheet", "export to PDF", or any request to produce a file using code. This skill covers pptxgenjs (PowerPoint), docx (Word), exceljs (Excel), and pdf-lib (PDF). Always use this skill when the deliverable is an Office or PDF file created programmatically via npm packages.
---

# npm File Creator Skill

Create Office & PDF files programmatically using Node.js npm packages.

## Package Selection

| File Type | npm Package |
|-----------|-------------|
| PowerPoint (.pptx) | `pptxgenjs` |
| Word (.docx) | `docx` |
| Excel (.xlsx) | `exceljs` |
| PDF | `pdf-lib` |

---

## Setup

All packages are **pre-installed globally**. Use this path prefix in `require()` for the current Windows environment:

```js
const G = "C:\\Users\\origi\\AppData\\Roaming\\npm\\node_modules\\";

const PptxGenJS = require(G + "pptxgenjs");
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require(G + "docx");
const ExcelJS = require(G + "exceljs");
const { PDFDocument, rgb, StandardFonts } = require(G + "pdf-lib");
```

### General Workflow

1. Create a script at `C:\Users\origi\.gemini\tmp\origi\create.js`
2. Run: `node C:\Users\origi\.gemini\tmp\origi\create.js`
3. Copy output as needed.

---

## PowerPoint — pptxgenjs

```js
const G = "C:\\Users\\origi\\AppData\\Roaming\\npm\\node_modules\\";
const PptxGenJS = require(G + "pptxgenjs");

(async () => {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.33" x 7.5"

  const slide = pptx.addSlide();
  slide.background = { color: "1E2761" };

  // Add text
  slide.addText("ชื่อเรื่อง", {
    x: 1, y: 1.5, w: 11, h: 1.5,
    fontSize: 44, bold: true, color: "FFFFFF", align: "center"
  });

  // Add shape (use string name, NOT pptx.ShapeType)
  slide.addShape("rect", {
    x: 0.5, y: 0.5, w: 3, h: 1,
    fill: { color: "FF0000" }
  });

  // Add image
  // slide.addImage({ path: "C:\\path\\to\\image.png", x: 1, y: 1, w: 4, h: 3 });

  await pptx.writeFile({ fileName: "C:\\Users\\origi\\.gemini\\tmp\\origi\\output.pptx" });
  console.log("Done!");
})();
```

**⚠️ Important:** Always use shape names as strings (`"rect"`, `"roundRect"`, `"ellipse"`) — NOT `pptx.ShapeType.XXX`.

**Common shape names:** `"rect"`, `"roundRect"`, `"ellipse"`, `"triangle"`, `"line"`

---

## Word — docx

```js
const G = "C:\\Users\\origi\\AppData\\Roaming\\npm\\node_modules\\";
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } = require(G + "docx");
const fs = require("fs");

(async () => {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: "หัวข้อเอกสาร",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          children: [
            new TextRun("ข้อความปกติ "),
            new TextRun({ text: "ตัวหนา", bold: true }),
            new TextRun({ text: " ตัวเอียง", italics: true }),
          ],
        }),
        // Table
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("คอลัมน์ 1")] }),
                new TableCell({ children: [new Paragraph("คอลัมน์ 2")] }),
              ],
            }),
          ],
          width: { size: 100, type: WidthType.PERCENTAGE },
        }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("C:\\Users\\origi\\.gemini\\tmp\\origi\\output.docx", buffer);
  console.log("Done!");
})();
```

---

## Excel — exceljs

```js
const G = "C:\\Users\\origi\\AppData\\Roaming\\npm\\node_modules\\";
const ExcelJS = require(G + "exceljs");

(async () => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sheet1");

  // Define columns
  sheet.columns = [
    { header: "ชื่อ", key: "name", width: 20 },
    { header: "ยอดขาย", key: "sales", width: 15 },
    { header: "วันที่", key: "date", width: 15 },
  ];

  // Add data
  sheet.addRow({ name: "สินค้า A", sales: 50000, date: new Date() });
  sheet.addRow({ name: "สินค้า B", sales: 75000, date: new Date() });

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern", pattern: "solid",
    fgColor: { argb: "FF1E2761" }
  };

  await workbook.xlsx.writeFile("C:\\Users\\origi\\.gemini\\tmp\\origi\\output.xlsx");
  console.log("Done!");
})();
```

---

## PDF — pdf-lib

```js
const G = "C:\\Users\\origi\\AppData\\Roaming\\npm\\node_modules\\";
const { PDFDocument, rgb, StandardFonts } = require(G + "pdf-lib");
const fs = require("fs");

(async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  page.drawText("Hello PDF", {
    x: 50, y: 750, size: 30,
    font, color: rgb(0, 0.2, 0.6),
  });

  page.drawRectangle({
    x: 50, y: 600, width: 200, height: 50,
    color: rgb(0.9, 0.9, 1),
    borderColor: rgb(0, 0.2, 0.6), borderWidth: 2,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync("C:\\Users\\origi\\.gemini\\tmp\\origi\\output.pdf", pdfBytes);
  console.log("Done!");
})();
```

**Note:** StandardFonts (Helvetica, Times, Courier) do NOT support Thai. For Thai text, embed a .ttf font file.

---

## Debugging

```bash
# Run with error output
node create.js 2>&1

# Check Node.js version
node --version

# Verify a package is available
node -e "require('C:\\Users\\origi\\AppData\\Roaming\\npm\\node_modules\\pptxgenjs'); console.log('OK')"
```

---

## Available Packages (Pre-installed)

Global modules path: `C:\Users\origi\AppData\Roaming\npm\node_modules\`
Confirmed available: `pptxgenjs`, `docx`, `pdf-lib`, `exceljs`, `sharp`, `react`, `typescript`
