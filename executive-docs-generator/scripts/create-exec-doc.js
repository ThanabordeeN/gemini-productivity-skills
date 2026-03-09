const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, TabStopType, TabStopPosition, HeadingLevel } = require('docx');

// Read data from JSON file
const dataFilePath = process.argv[2] || 'exec-doc-template.json';
if (!fs.existsSync(dataFilePath)) {
  console.error(`Error: Data file not found: ${dataFilePath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

const fontFamily = data.settings?.fontFamily || "TH Sarabun New";
const outputFileName = data.settings?.outputFileName || "Executive_Doc.docx";
const docType = (data.document?.type || "MEMO").toUpperCase();

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

let children = [];

function addIndentParagraph(text) {
  return new Paragraph({
    children: [new TextRun(text)],
    indent: { firstLine: 1440 }, // 1 inch indent (approx 2.54 cm)
    spacing: { after: 120 }
  });
}

if (docType === "MEMO") {
  // บันทึกข้อความ
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "บันทึกข้อความ", bold: true, size: 58 })], // 29pt
      spacing: { after: 240 }
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: "ส่วนราชการ ", bold: true, size: 32 }), new TextRun({ text: data.memo_details.department, size: 32 })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: "ที่ ", bold: true, size: 32 }), new TextRun({ text: data.document.docNo, size: 32 })] })]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: "วันที่ ", bold: true, size: 32 }), new TextRun({ text: data.document.date, size: 32 })] })]
            })
          ]
        }),
      ]
    }),
    new Paragraph({ children: [new TextRun({ text: "เรื่อง ", bold: true, size: 32 }), new TextRun({ text: data.memo_details.subject, size: 32 })] }),
    new Paragraph({ children: [new TextRun({ text: "เรียน ", bold: true, size: 32 }), new TextRun({ text: data.memo_details.to, size: 32 })], spacing: { after: 240 } })
  );

  if (data.memo_details.reference) {
    children.push(new Paragraph({ children: [new TextRun({ text: "อ้างถึง ", bold: true, size: 32 }), new TextRun({ text: data.memo_details.reference, size: 32 })] }));
  }
  if (data.memo_details.attachments) {
    children.push(new Paragraph({ children: [new TextRun({ text: "สิ่งที่ส่งมาด้วย ", bold: true, size: 32 }), new TextRun({ text: data.memo_details.attachments, size: 32 })], spacing: { after: 240 } }));
  }

  data.content.forEach(paragraph => {
    children.push(addIndentParagraph(paragraph));
  });

  children.push(
    new Paragraph({ text: "", spacing: { before: 480 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
      rows: [
        new TableRow({
          children: [
            new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph("")] }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ text: "___________________________", alignment: AlignmentType.CENTER }),
                new Paragraph({ text: data.signatory.name, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: data.signatory.position, alignment: AlignmentType.CENTER })
              ]
            })
          ]
        })
      ]
    })
  );

} else if (docType === "OFFICIAL_LETTER") {
  // หนังสือภายนอก
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "หนังสือราชการ", bold: true, size: 58 })], // Mocking krut temporarily with text
      alignment: AlignmentType.CENTER,
      spacing: { after: 480 }
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: "ที่ ", bold: true, size: 32 }), new TextRun({ text: data.document.docNo, size: 32 })] })]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: data.memo_details?.department || "ส่วนราชการ", size: 32 })] })]
            })
          ]
        })
      ]
    }),
    new Paragraph({ text: data.document.date, alignment: AlignmentType.CENTER, spacing: { after: 240 } }),
    
    new Paragraph({ children: [new TextRun({ text: "เรื่อง ", bold: true, size: 32 }), new TextRun({ text: data.memo_details?.subject || "", size: 32 })] }),
    new Paragraph({ children: [new TextRun({ text: "เรียน ", bold: true, size: 32 }), new TextRun({ text: data.memo_details?.to || "", size: 32 })] })
  );
  
  if (data.memo_details?.reference) {
    children.push(new Paragraph({ children: [new TextRun({ text: "อ้างถึง ", bold: true, size: 32 }), new TextRun({ text: data.memo_details.reference, size: 32 })] }));
  }
  if (data.memo_details?.attachments) {
    children.push(new Paragraph({ children: [new TextRun({ text: "สิ่งที่ส่งมาด้วย ", bold: true, size: 32 }), new TextRun({ text: data.memo_details.attachments, size: 32 })] }));
  }

  children.push(new Paragraph({ text: "", spacing: { after: 240 } }));

  data.content.forEach(paragraph => {
    children.push(addIndentParagraph(paragraph));
  });

  children.push(
    new Paragraph({ text: "ขอแสดงความนับถือ", alignment: AlignmentType.CENTER, indent: { left: 4500 }, spacing: { before: 480, after: 720 } }),
    new Paragraph({ text: "___________________________", alignment: AlignmentType.CENTER, indent: { left: 4500 } }),
    new Paragraph({ text: data.signatory.name, alignment: AlignmentType.CENTER, indent: { left: 4500 } }),
    new Paragraph({ text: data.signatory.position, alignment: AlignmentType.CENTER, indent: { left: 4500 } })
  );

} else if (docType === "POWER_OF_ATTORNEY") {
  // หนังสือมอบอำนาจ
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "หนังสือมอบอำนาจ", bold: true, size: 58 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 480 }
    }),
    new Paragraph({ text: `ทำที่ ${data.document.location || ""}`, alignment: AlignmentType.RIGHT }),
    new Paragraph({ text: `วันที่ ${data.document.date}`, alignment: AlignmentType.RIGHT, spacing: { after: 240 } })
  );

  const poa = data.poa_details;
  if (poa) {
    children.push(
      addIndentParagraph(`ข้าพเจ้า ${poa.grantor.name} อายุ ${poa.grantor.age} ปี อยู่บ้านเลขที่ ${poa.grantor.address}`),
      addIndentParagraph(`ขอมอบอำนาจให้ ${poa.grantee.name} อายุ ${poa.grantee.age} ปี อยู่บ้านเลขที่ ${poa.grantee.address}`),
      addIndentParagraph(`เป็นผู้มีอำนาจจัดการ ${poa.power} แทนข้าพเจ้าจนเสร็จการ`),
      addIndentParagraph(`การใดที่ผู้รับมอบอำนาจได้กระทำไปภายในขอบเขตอำนาจนี้ ให้ถือเสมือนว่าข้าพเจ้าได้กระทำด้วยตนเองทุกประการ เพื่อเป็นหลักฐาน ข้าพเจ้าจึงได้ลงลายมือชื่อไว้เป็นสำคัญต่อหน้าพยาน`)
    );
  }

  children.push(
    new Paragraph({ text: "", spacing: { before: 720 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
      rows: [
        new TableRow({
          children: [
            new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph("")] }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ text: "ลงชื่อ ___________________________ ผู้มอบอำนาจ", alignment: AlignmentType.CENTER }),
                new Paragraph({ text: `(${poa?.grantor?.name || "................................................"})`, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "", spacing: { after: 480 } }),
                new Paragraph({ text: "ลงชื่อ ___________________________ ผู้รับมอบอำนาจ", alignment: AlignmentType.CENTER }),
                new Paragraph({ text: `(${poa?.grantee?.name || "................................................"})`, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "", spacing: { after: 480 } }),
                new Paragraph({ text: "ลงชื่อ ___________________________ พยาน", alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "(................................................)", alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "", spacing: { after: 480 } }),
                new Paragraph({ text: "ลงชื่อ ___________________________ พยาน", alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "(................................................)", alignment: AlignmentType.CENTER })
              ]
            })
          ]
        })
      ]
    })
  );
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: fontFamily,
          size: 32, // 16pt 
          color: "000000",
        },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1134, bottom: 1134, left: 1701 } // Top 2.5cm, Right 2cm, Bottom 2cm, Left 3cm (Thai Gov standard roughly)
      }
    },
    children: children
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputFileName, buffer);
  console.log(`${outputFileName} created successfully.`);
});