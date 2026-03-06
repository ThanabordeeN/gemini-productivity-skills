const fs = require("fs");
const { 
    Document, Packer, Paragraph, TextRun, ImageRun, 
    Table, TableRow, TableCell, BorderStyle, 
    WidthType, AlignmentType, VerticalAlign,
    HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom
} = require("docx");

// 1 cm ≈ 566.9 TWIP (Twentieths of a point)
const cmToTwip = (cm) => Math.round(cm * 566.9);

/**
 * ฟังก์ชันสร้างบันทึกข้อความ (Thai Government Memorandum)
 * ตามระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ
 */
async function generateThaiMemo() {
    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: cmToTwip(2.5),    // ขอบบน 2.5 cm
                        bottom: cmToTwip(2.0), // ขอบล่าง 2.0 cm
                        left: cmToTwip(3.0),   // ขอบซ้าย 3.0 cm
                        right: cmToTwip(2.0)   // ขอบขวา 2.0 cm
                    },
                },
            },
            children: [
                // 1. ส่วนหัว: ครุฑ และ คำว่า "บันทึกข้อความ"
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        // แทรกครุฑ (สูง 1.5 ซม.) โดยใช้ Floating Position ชิดซ้าย
                        // หมายเหตุ: ต้องมีไฟล์ krut.png ในโฟลเดอร์เดียวกัน
                        ...(fs.existsSync("krut.png") ? [
                            new ImageRun({
                                data: fs.readFileSync("krut.png"),
                                transformation: { width: 56, height: 60 }, // ประมาณ 1.5 cm x 1.6 cm
                                floating: {
                                    horizontalPosition: {
                                        relative: HorizontalPositionRelativeFrom.COLUMN,
                                        offset: 0, // ชิดขอบซ้ายของคอลัมน์ (ซึ่งห่างขอบกระดาษ 3cm)
                                    },
                                    verticalPosition: {
                                        relative: VerticalPositionRelativeFrom.PARAGRAPH,
                                        offset: 0,
                                    },
                                },
                            })
                        ] : [
                            new TextRun({ text: "[ตราครุฑ]", color: "888888" })
                        ]),
                        // คำว่า บันทึกข้อความ
                        new TextRun({
                            text: "บันทึกข้อความ",
                            font: "TH Sarabun New",
                            size: 48, // 24pt
                            bold: true,
                        }),
                    ],
                }),

                // เว้นระยะห่างเล็กน้อย
                new Paragraph({ children: [] }),

                // 2. ส่วนข้อมูลหน่วยงาน (ใช้ตารางเพื่อจัดระเบียบตำแหน่งให้แม่นยำ)
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.NONE },
                        insideVertical: { style: BorderStyle.NONE },
                    },
                    rows: [
                        // ส่วนราชการ
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({ text: "ส่วนราชการ  ", font: "TH Sarabun New", size: 32, bold: true }),
                                                new TextRun({ text: "ฝ่ายเทคโนโลยีสารสนเทศ สำนักงานตัวอย่าง", font: "TH Sarabun New", size: 32 }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        // ที่ และ วันที่
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({ text: "ที่  ", font: "TH Sarabun New", size: 32, bold: true }),
                                                new TextRun({ text: "ศธ 0000/123", font: "TH Sarabun New", size: 32 }),
                                                new TextRun({ text: "\t\t\t\t\t\t", font: "TH Sarabun New", size: 32 }), // Tab space
                                                new TextRun({ text: "วันที่  ", font: "TH Sarabun New", size: 32, bold: true }),
                                                new TextRun({ text: "7 มีนาคม 2569", font: "TH Sarabun New", size: 32 }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        // เรื่อง
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({ text: "เรื่อง  ", font: "TH Sarabun New", size: 32, bold: true }),
                                                new TextRun({ text: "ขออนุมัติจัดจ้างพัฒนาซอฟต์แวร์บริหารจัดการเอกสาร", font: "TH Sarabun New", size: 32 }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),

                // เส้นคั่นระหว่างหัวกับเนื้อหา (ถ้าจำเป็น)
                new Paragraph({
                    border: {
                        bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 }
                    }
                }),

                new Paragraph({ children: [] }), // เว้นบรรทัด

                // 3. ส่วนเนื้อหา
                new Paragraph({
                    children: [
                        new TextRun({ text: "เรียน  ", font: "TH Sarabun New", size: 32, bold: true }),
                        new TextRun({ text: "ผู้อำนวยการสำนักบริหารเทคโนโลยี", font: "TH Sarabun New", size: 32 }),
                    ],
                }),

                new Paragraph({
                    indent: { firstLine: cmToTwip(2.5) }, // ย่อหน้า 2.5 cm
                    alignment: AlignmentType.BOTH,
                    spacing: { line: 360 }, // 1.5 line spacing (ประมาณ)
                    children: [
                        new TextRun({
                            text: "ตามที่ฝ่ายเทคโนโลยีสารสนเทศได้รับมอบหมายให้ดำเนินการพัฒนาระบบบริหารจัดการเอกสารอิเล็กทรอนิกส์ เพื่อยกระดับการทำงานภายในองค์กรให้มีความรวดเร็วและเป็นระบบมากยิ่งขึ้นนั้น ในขณะนี้การศึกษาความต้องการของผู้ใช้งานได้ดำเนินการเสร็จสิ้นแล้ว",
                            font: "TH Sarabun New",
                            size: 32,
                        }),
                    ],
                }),

                new Paragraph({
                    indent: { firstLine: cmToTwip(2.5) },
                    alignment: AlignmentType.BOTH,
                    children: [
                        new TextRun({
                            text: "จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติในหลักการจัดจ้างพัฒนาระบบดังกล่าวต่อไป",
                            font: "TH Sarabun New",
                            size: 32,
                        }),
                    ],
                }),

                new Paragraph({ children: [] }),
                new Paragraph({ children: [] }),

                // 4. ส่วนลงนาม (จัดชิดขวากลาง)
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    indent: { left: cmToTwip(7.0) }, // ดันไปทางขวาประมาณ 7 ซม.
                    children: [
                        new TextRun({ text: "(ลงชื่อ)...........................................................", font: "TH Sarabun New", size: 32 }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    indent: { left: cmToTwip(7.0) },
                    children: [
                        new TextRun({ text: "(นายสมชาย ใจดี)", font: "TH Sarabun New", size: 32 }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    indent: { left: cmToTwip(7.0) },
                    children: [
                        new TextRun({ text: "หัวหน้าฝ่ายเทคโนโลยีสารสนเทศ", font: "TH Sarabun New", size: 32 }),
                    ],
                }),
            ],
        }],
    });

    // บันทึกไฟล์
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("output_memo.docx", buffer);
    console.log("สร้างไฟล์ output_memo.docx สำเร็จแล้ว!");
}

generateThaiMemo().catch(console.error);
