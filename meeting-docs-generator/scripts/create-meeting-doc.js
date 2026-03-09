const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeadingLevel } = require('docx');

// Read data from JSON file
const dataFilePath = process.argv[2] || 'meeting-template.json';
if (!fs.existsSync(dataFilePath)) {
  console.error(`Error: Data file not found: ${dataFilePath}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

const fontFamily = data.settings?.fontFamily || "TH Sarabun New";
const outputFileName = data.settings?.outputFileName || "Meeting_Document.docx";
const docType = (data.document?.type || "MINUTES").toUpperCase();

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

let children = [];

function addIndentParagraph(text, isBold = false) {
  return new Paragraph({
    children: [new TextRun({ text, bold: isBold })],
    indent: { firstLine: 1440 }, // 1 inch indent
    spacing: { after: 120 }
  });
}

function addNormalParagraph(text, isBold = false) {
  return new Paragraph({
    children: [new TextRun({ text, bold: isBold })],
    spacing: { after: 120 }
  });
}

if (docType === "MINUTES") {
  // รายงานการประชุม
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: `รายงานการประชุม${data.document.meetingName || ""}`, bold: true, size: 32 })
      ],
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `ครั้งที่ ${data.document.meetingNo || ""}`, bold: true, size: 32 })
      ],
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `เมื่อวันที่ ${data.document.date || ""} เวลา ${data.document.time || ""}`, size: 32 })
      ],
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `ณ ${data.document.location || ""}`, size: 32 })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 }
    }),
    new Paragraph({ text: "ผู้มาประชุม", bold: true }),
  );

  (data.attendees?.present || []).forEach(p => {
    children.push(addNormalParagraph(p));
  });

  if (data.attendees?.absent && data.attendees.absent.length > 0) {
    children.push(
      new Paragraph({ text: "", spacing: { before: 120 } }),
      new Paragraph({ text: "ผู้ไม่มาประชุม", bold: true })
    );
    data.attendees.absent.forEach(a => {
      children.push(addNormalParagraph(a));
    });
  }

  children.push(
    new Paragraph({ text: "", spacing: { before: 240 } }),
    new Paragraph({ text: `เริ่มประชุมเวลา ${data.document.time || ""}` })
  );

  (data.agendas || []).forEach(agenda => {
    children.push(
      new Paragraph({ text: "", spacing: { before: 240 } }),
      new Paragraph({ text: agenda.title, bold: true })
    );
    if (agenda.details) {
      children.push(addIndentParagraph(agenda.details));
    }
    if (agenda.resolution) {
      children.push(new Paragraph({
        children: [new TextRun({ text: "มติที่ประชุม: ", bold: true }), new TextRun(agenda.resolution)],
        indent: { firstLine: 1440 }
      }));
    }
  });

  children.push(
    new Paragraph({ text: "", spacing: { before: 360 } }),
    new Paragraph({ text: `เลิกประชุมเวลา ${data.meeting_end_time || ""}` }),
    new Paragraph({ text: "", spacing: { before: 480 } })
  );

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ text: "ผู้จดรายงานการประชุม", alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "", spacing: { before: 720 } }),
                new Paragraph({ text: "___________________________", alignment: AlignmentType.CENTER }),
                ...(data.signatory?.recorder ? data.signatory.recorder.split("\n").map(l => new Paragraph({ text: l, alignment: AlignmentType.CENTER })) : [])
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({ text: "ผู้ตรวจรายงานการประชุม", alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "", spacing: { before: 720 } }),
                new Paragraph({ text: "___________________________", alignment: AlignmentType.CENTER }),
                ...(data.signatory?.checker ? data.signatory.checker.split("\n").map(l => new Paragraph({ text: l, alignment: AlignmentType.CENTER })) : [])
              ]
            })
          ]
        })
      ]
    })
  );

} else if (docType === "INVITATION" || docType === "RESOLUTION_MEMO") {
  // บันทึกข้อความ สำหรับเชิญประชุม หรือ แจ้งมติ
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
              children: [new Paragraph({ children: [new TextRun({ text: "ส่วนราชการ ", bold: true, size: 32 }), new TextRun({ text: data.memo_details?.department || "", size: 32 })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: "ที่ ", bold: true, size: 32 }), new TextRun({ text: data.document.docNo || "", size: 32 })] })]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: "วันที่ ", bold: true, size: 32 }), new TextRun({ text: data.document.date || "", size: 32 })] })]
            })
          ]
        }),
      ]
    }),
    new Paragraph({ children: [new TextRun({ text: "เรื่อง ", bold: true, size: 32 }), new TextRun({ text: data.memo_details?.subject || "", size: 32 })] }),
    new Paragraph({ children: [new TextRun({ text: "เรียน ", bold: true, size: 32 }), new TextRun({ text: data.memo_details?.to || "", size: 32 })], spacing: { after: 240 } })
  );

  (data.content || []).forEach(paragraph => {
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
                new Paragraph({ text: data.signatory?.name || "", alignment: AlignmentType.CENTER }),
                new Paragraph({ text: data.signatory?.position || "", alignment: AlignmentType.CENTER })
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
        margin: { top: 1440, right: 1134, bottom: 1134, left: 1701 } // Top 2.5cm, Right 2cm, Bottom 2cm, Left 3cm 
      }
    },
    children: children
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputFileName, buffer);
  console.log(`${outputFileName} created successfully.`);
});