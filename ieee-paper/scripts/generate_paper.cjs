const fs = require("fs");
const path = require("path");
const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    HeadingLevel,
    LevelFormat,
    SectionType,
    convertInchesToTwip,
} = require("docx");

// --- Configuration & Constants ---
const FONT = "Times New Roman";
const SIZE_TITLE = 48;      // 24pt
const SIZE_AUTHORS = 22;    // 11pt
const SIZE_AFFILIATION = 20; // 10pt
const SIZE_BODY = 20;       // 10pt
const SIZE_ABSTRACT = 18;   // 9pt
const SIZE_REF = 16;        // 8pt

const MARGIN_TOP = convertInchesToTwip(0.75);
const MARGIN_BOTTOM = convertInchesToTwip(1.0);
const MARGIN_LEFT = convertInchesToTwip(0.625);
const MARGIN_RIGHT = convertInchesToTwip(0.625);
const COLUMN_SPACE = convertInchesToTwip(0.2);

// --- Load Content from JSON Template ---
const defaultContentPath = path.join(__dirname, "../templates/ieee_content.json");
const contentPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultContentPath;

if (!fs.existsSync(contentPath)) {
    console.error("Error: Content template not found at " + contentPath);
    process.exit(1);
}
const data = JSON.parse(fs.readFileSync(contentPath, "utf-8"));

// --- Helper Functions ---
function createHeading1(text, numberingRef) {
    return new Paragraph({
        text: text.toUpperCase(),
        numbering: { reference: numberingRef, level: 0 },
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 120 },
        run: { size: SIZE_BODY, font: FONT, bold: true },
    });
}

function createHeading2(text, numberingRef) {
    return new Paragraph({
        text: text,
        numbering: { reference: numberingRef, level: 1 },
        alignment: AlignmentType.LEFT,
        spacing: { before: 180, after: 90 },
        run: { size: SIZE_BODY, font: FONT, italics: true },
    });
}

function createBody(text) {
    return new Paragraph({
        text: text,
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 120 },
        run: { size: SIZE_BODY, font: FONT },
    });
}

// --- Document Generation Logic ---
const doc = new Document({
    numbering: {
        config: [{
            reference: "ieee-num",
            levels: [
                { level: 0, format: LevelFormat.UPPER_ROMAN, text: "%1.", alignment: AlignmentType.CENTER },
                { level: 1, format: LevelFormat.UPPER_LETTER, text: "%2.", alignment: AlignmentType.LEFT },
            ]
        }]
    },
    sections: [
        // 1. Header Section (Single Column)
        {
            properties: {
                page: { margin: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, left: MARGIN_LEFT, right: MARGIN_RIGHT } },
                type: SectionType.CONTINUOUS,
            },
            children: [
                new Paragraph({
                    text: data.title,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 240 },
                    run: { size: SIZE_TITLE, font: FONT },
                }),
                new Paragraph({
                    children: [new TextRun({ text: data.authors, size: SIZE_AUTHORS, font: FONT })],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [new TextRun({ text: data.affiliation, size: SIZE_AFFILIATION, italics: true, font: FONT })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 480 },
                }),
            ],
        },
        // 2. Body Section (Double Column)
        {
            properties: {
                column: { count: 2, space: COLUMN_SPACE },
                type: SectionType.CONTINUOUS,
            },
            children: [
                // Abstract & Keywords
                new Paragraph({
                    children: [
                        new TextRun({ text: "Abstract— ", bold: true, italics: true, size: SIZE_ABSTRACT, font: FONT }),
                        new TextRun({ text: data.abstract, size: SIZE_ABSTRACT, font: FONT }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Keywords— ", bold: true, italics: true, size: SIZE_ABSTRACT, font: FONT }),
                        new TextRun({ text: data.keywords, size: SIZE_ABSTRACT, font: FONT }),
                    ],
                    spacing: { after: 240 },
                }),

                // Dynamic Sections from JSON
                ...data.sections.flatMap(section => {
                    const elements = [createHeading1(section.title, "ieee-num")];
                    if (section.content) elements.push(createBody(section.content));
                    
                    if (section.subsections) {
                        section.subsections.forEach(sub => {
                            elements.push(createHeading2(sub.title, "ieee-num"));
                            elements.push(createBody(sub.content));
                        });
                    }
                    return elements;
                }),

                // Acknowledgment
                new Paragraph({
                    text: "ACKNOWLEDGMENT",
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 240, after: 120 },
                    run: { size: SIZE_BODY, font: FONT, bold: true },
                }),
                createBody(data.acknowledgment),

                // References
                new Paragraph({
                    text: "REFERENCES",
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 240, after: 120 },
                    run: { size: SIZE_BODY, font: FONT, bold: true },
                }),
                ...data.references.map(ref => new Paragraph({
                    text: ref,
                    alignment: AlignmentType.JUSTIFIED,
                    run: { size: SIZE_REF, font: FONT },
                })),
            ],
        },
    ],
});

Packer.toBuffer(doc).then((buffer) => {
    const defaultOutputName = "IEEE_Paper_Generated.docx";
    const outputFileName = process.argv[3] ? process.argv[3] : defaultOutputName;
    
    fs.writeFileSync(outputFileName, buffer);
    console.log(`IEEE Paper generated from [${contentPath}] to [${outputFileName}]`);
});
