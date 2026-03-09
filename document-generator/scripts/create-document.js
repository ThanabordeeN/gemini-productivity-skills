const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, AlignmentType, HeadingLevel } = require('docx');

// Read data from JSON file
const dataFilePath = process.argv[2] || 'document-data.json';
if (!fs.existsSync(dataFilePath)) {
  console.error(`Error: Data file not found: ${dataFilePath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

const primaryColor = data.settings?.primaryColor || "1F4E79"; // Corporate Blue
const lightShading = "EBF3F9";
const borderColor = "B0C4DE";
const fontFamily = data.settings?.fontFamily || "TH Sarabun New";
const outputFileName = data.settings?.outputFileName || "Document_Output.docx";

// Determine Document Type
const docType = (data.document?.type || "QUOTATION").toUpperCase();

let titleText = "ใบเสนอราคา (QUOTATION)";
let docNoLabel = "เลขที่ใบเสนอราคา:";
let issuerLabel = "ผู้เสนอราคา:";

switch (docType) {
  case "INVOICE":
    titleText = "ใบแจ้งหนี้ (INVOICE)";
    docNoLabel = "เลขที่ใบแจ้งหนี้:";
    issuerLabel = "ผู้ออกเอกสาร:";
    break;
  case "BILLING_NOTE":
    titleText = "ใบวางบิล (BILLING NOTE)";
    docNoLabel = "เลขที่ใบวางบิล:";
    issuerLabel = "ผู้ออกเอกสาร:";
    break;
  case "RECEIPT":
    titleText = "ใบเสร็จรับเงิน (RECEIPT)";
    docNoLabel = "เลขที่ใบเสร็จ:";
    issuerLabel = "ผู้รับเงิน:";
    break;
  case "PURCHASE_ORDER":
  case "PO":
    titleText = "ใบสั่งซื้อ (PURCHASE ORDER)";
    docNoLabel = "เลขที่ใบสั่งซื้อ:";
    issuerLabel = "ผู้สั่งซื้อ:";
    break;
  case "PURCHASE_REQUISITION":
  case "PR":
    titleText = "ใบขออนุมัติสั่งซื้อ (PURCHASE REQUISITION)";
    docNoLabel = "เลขที่เอกสาร:";
    issuerLabel = "ผู้ขออนุมัติ:";
    break;
  case "PRICE_COMPARISON":
    titleText = "เอกสารเปรียบเทียบราคา (PRICE COMPARISON)";
    docNoLabel = "เลขที่เอกสาร:";
    issuerLabel = "ผู้จัดทำ:";
    break;
  case "QUOTATION":
  default:
    titleText = "ใบเสนอราคา (QUOTATION)";
    docNoLabel = "เลขที่ใบเสนอราคา:";
    issuerLabel = "ผู้เสนอราคา:";
    break;
}

// Calculate Totals
let subTotal = 0;
const itemRows = data.items.map((item, index) => {
  const amount = item.qty * item.price;
  subTotal += amount;
  const isEven = index % 2 !== 0; // 0-based, so odd index = even row visually
  const cellShading = isEven ? { fill: lightShading, type: ShadingType.CLEAR } : undefined;

  return new TableRow({
    children: [
      new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, shading: cellShading, children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })] }),
      new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, shading: cellShading, children: [new Paragraph({ text: item.description })] }),
      new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, shading: cellShading, children: [new Paragraph({ text: item.qty.toString(), alignment: AlignmentType.CENTER })] }),
      new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, shading: cellShading, children: [new Paragraph({ text: item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: AlignmentType.RIGHT })] }),
      new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, shading: cellShading, children: [new Paragraph({ text: amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: AlignmentType.RIGHT })] }),
    ]
  });
});

const taxAmount = subTotal * ((data.taxRate || 0) / 100);
const grandTotal = subTotal + taxAmount;

const formatCurrency = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: fontFamily,
          size: 32, // 16pt 
          color: "333333",
        },
      },
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 48, bold: true, color: primaryColor },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 240 } },
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(titleText)] }),
      
      new Paragraph({
        children: [
          new TextRun({ text: data.company.name, bold: true, size: 36, color: primaryColor }),
        ]
      }),
      new Paragraph({ text: data.company.address, color: "555555" }),
      new Paragraph({ text: data.company.contact, color: "555555" }),
      new Paragraph({ text: data.company.taxId, color: "555555" }),
      new Paragraph({ text: "", spacing: { after: 240 } }),

      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [4513, 4513],
        borders: {
            top: { style: BorderStyle.SINGLE, size: 12, color: primaryColor },
            bottom: { style: BorderStyle.SINGLE, size: 12, color: primaryColor },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 4513, type: WidthType.DXA },
                margins: { top: 120, bottom: 120, left: 0, right: 120 },
                children: [
                  new Paragraph({ children: [new TextRun({ text: (docType === "PURCHASE_ORDER" || docType === "PO") ? "ผู้ขาย:" : "ลูกค้า:", bold: true, color: primaryColor })] }),
                  new Paragraph({ text: data.customer.contactName }),
                  new Paragraph({ text: data.customer.companyName }),
                  new Paragraph({ text: data.customer.address }),
                  ...(data.customer.taxId ? [new Paragraph({ text: data.customer.taxId })] : []),
                ]
              }),
              new TableCell({
                width: { size: 4513, type: WidthType.DXA },
                margins: { top: 120, bottom: 120, left: 120, right: 0 },
                children: [
                  new Paragraph({ children: [new TextRun({ text: docNoLabel, bold: true, color: primaryColor }), new TextRun(` ${data.document.docNo}`)] }),
                  new Paragraph({ children: [new TextRun({ text: "วันที่:", bold: true, color: primaryColor }), new TextRun(` ${data.document.date}`)] }),
                  new Paragraph({ children: [new TextRun({ text: issuerLabel, bold: true, color: primaryColor }), new TextRun(` ${data.document.issuer}`)] }),
                  ...(data.document.paymentTerms ? [new Paragraph({ children: [new TextRun({ text: "เงื่อนไขการชำระเงิน:", bold: true, color: primaryColor }), new TextRun(` ${data.document.paymentTerms}`)] })] : []),
                ]
              })
            ]
          })
        ]
      }),

      new Paragraph({ text: "", spacing: { before: 360 } }),

      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [800, 4226, 1000, 1500, 1500],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
          left: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
          right: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
          insideVertical: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, shading: { fill: primaryColor, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "ลำดับ", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })] }),
              new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, shading: { fill: primaryColor, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "รายการ", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })] }),
              new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, shading: { fill: primaryColor, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "จำนวน", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })] }),
              new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, shading: { fill: primaryColor, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "ราคาต่อหน่วย", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })] }),
              new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, shading: { fill: primaryColor, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "จำนวนเงิน", bold: true, color: "FFFFFF" })], alignment: AlignmentType.CENTER })] }),
            ]
          }),
          ...itemRows,
          new TableRow({
            children: [
              new TableCell({ columnSpan: 3, borders: { bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, children: [new Paragraph("")] }),
              new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "รวมเป็นเงิน", bold: true, color: primaryColor })], alignment: AlignmentType.RIGHT })] }),
              new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: formatCurrency(subTotal), bold: true })], alignment: AlignmentType.RIGHT })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ columnSpan: 3, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, children: [new Paragraph("")] }),
              new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: `ภาษีมูลค่าเพิ่ม ${data.taxRate || 0}%`, bold: true, color: primaryColor })], alignment: AlignmentType.RIGHT })] }),
              new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: formatCurrency(taxAmount), bold: true })], alignment: AlignmentType.RIGHT })] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ columnSpan: 3, borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } }, margins: { top: 100, bottom: 100, left: 120, right: 120 }, children: [new Paragraph("")] }),
              new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, shading: { fill: primaryColor, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "ยอดสุทธิ", bold: true, color: "FFFFFF" })], alignment: AlignmentType.RIGHT })] }),
              new TableCell({ margins: { top: 100, bottom: 100, left: 120, right: 120 }, shading: { fill: lightShading, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: formatCurrency(grandTotal), bold: true, color: primaryColor })], alignment: AlignmentType.RIGHT })] }),
            ]
          })
        ]
      }),

      new Paragraph({ text: "", spacing: { before: 480 } }),
      new Paragraph({ children: [new TextRun({ text: "หมายเหตุ:", bold: true, color: primaryColor })] }),
      ...(data.notes || []).map(note => new Paragraph({ text: note, color: "555555" })),

      new Paragraph({ text: "", spacing: { before: 720 } }),
      
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [4513, 4513],
        borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 4513, type: WidthType.DXA },
                children: [
                  new Paragraph({ children: [new TextRun({ text: `ลงชื่อ${issuerLabel.replace(":", "")}`, bold: true, color: primaryColor })], alignment: AlignmentType.CENTER }),
                  new Paragraph({ text: "", spacing: { before: 720 } }),
                  new Paragraph({ text: "___________________________", alignment: AlignmentType.CENTER }),
                  new Paragraph({ text: `(${data.document.issuer})`, alignment: AlignmentType.CENTER }),
                  new Paragraph({ text: "วันที่: ____/____/________", alignment: AlignmentType.CENTER }),
                ]
              }),
              new TableCell({
                width: { size: 4513, type: WidthType.DXA },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "ลงชื่อผู้อนุมัติ / ยืนยันเอกสาร", bold: true, color: primaryColor })], alignment: AlignmentType.CENTER }),
                  new Paragraph({ text: "", spacing: { before: 720 } }),
                  new Paragraph({ text: "___________________________", alignment: AlignmentType.CENTER }),
                  new Paragraph({ text: "(___________________________)", alignment: AlignmentType.CENTER }),
                  new Paragraph({ text: "วันที่: ____/____/________", alignment: AlignmentType.CENTER }),
                ]
              })
            ]
          })
        ]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputFileName, buffer);
  console.log(`${outputFileName} created successfully.`);
});