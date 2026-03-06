const fs = require("fs");
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

// --- IEEE Constants & Configuration ---
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

// --- Helper Functions for Consistency ---
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

// --- Document Definition ---
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
        // Section 1: Title & Authors (Single Column)
        {
            properties: {
                page: { margin: { top: MARGIN_TOP, bottom: MARGIN_BOTTOM, left: MARGIN_LEFT, right: MARGIN_RIGHT } },
                type: SectionType.CONTINUOUS,
            },
            children: [
                new Paragraph({
                    text: "Full Title of the IEEE Research Paper",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 240 },
                    run: { size: SIZE_TITLE, font: FONT },
                }),
                new Paragraph({
                    children: [new TextRun({ text: "Author One, Author Two, and Author Three", size: SIZE_AUTHORS, font: FONT })],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [new TextRun({ text: "Department of Electronics, University of Technology, Country", size: SIZE_AFFILIATION, italics: true, font: FONT })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 480 },
                }),
            ],
        },
        // Section 2: Main Content (Double Column)
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
                        new TextRun({ text: "This paper presents a complete template for IEEE documents. It covers all necessary sections from introduction to conclusion, ensuring compliance with the two-column formatting and specific font requirements.", size: SIZE_ABSTRACT, font: FONT }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Keywords— ", bold: true, italics: true, size: SIZE_ABSTRACT, font: FONT }),
                        new TextRun({ text: "IEEE Standards, docx-js, Document Automation, Academic Writing.", size: SIZE_ABSTRACT, font: FONT }),
                    ],
                    spacing: { after: 240 },
                }),

                // I. INTRODUCTION
                createHeading1("Introduction", "ieee-num"),
                createBody("The introduction provides the background of the study. It should state the problem clearly and motivate the research goals. All body text is justified and 10pt Times New Roman."),

                // II. RELATED WORK
                createHeading1("Related Work", "ieee-num"),
                createBody("This section reviews existing literature. Previous studies have explored similar concepts but often lack the automation provided by our proposed system [1]."),

                // III. PROPOSED METHODOLOGY
                createHeading1("Proposed Methodology", "ieee-num"),
                createHeading2("System Architecture", "ieee-num"),
                createBody("We propose a modular architecture that separates data processing from layout generation."),
                createHeading2("Implementation Details", "ieee-num"),
                createBody("The implementation uses Node.js and the docx library to map IEEE standards to XML-based word processing formats."),

                // IV. RESULTS AND DISCUSSION
                createHeading1("Results and Discussion", "ieee-num"),
                createBody("Our experimental results show that the generated documents pass the IEEE PDF eXpress check with 100% accuracy."),

                // V. CONCLUSION
                createHeading1("Conclusion", "ieee-num"),
                createBody("In conclusion, this template provides a robust foundation for academic writing using programmatic tools. Future work will include automated citation management."),

                // ACKNOWLEDGMENT
                new Paragraph({
                    text: "ACKNOWLEDGMENT",
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 240, after: 120 },
                    run: { size: SIZE_BODY, font: FONT, bold: true },
                }),
                createBody("The authors would like to thank the open-source community for providing the tools used in this research."),

                // REFERENCES
                new Paragraph({
                    text: "REFERENCES",
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 240, after: 120 },
                    run: { size: SIZE_BODY, font: FONT, bold: true },
                }),
                new Paragraph({
                    text: "[1] J. Doe, “Automated Formatting,” IEEE Trans. on Automation, vol. 1, no. 1, pp. 1-10, 2024.",
                    alignment: AlignmentType.JUSTIFIED,
                    run: { size: SIZE_REF, font: FONT },
                }),
                new Paragraph({
                    text: "[2] A. Smith, “Academic Writing with Node.js,” Journal of Web Tech, vol. 5, pp. 20-30, 2023.",
                    alignment: AlignmentType.JUSTIFIED,
                    run: { size: SIZE_REF, font: FONT },
                }),
            ],
        },
    ],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("IEEE_Paper_Full_Output.docx", buffer);
    console.log("Full IEEE Paper generated successfully: IEEE_Paper_Full_Output.docx");
});
