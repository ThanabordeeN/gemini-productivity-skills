---
name: npm-pptx-expert
description: "Expert skill for creating and editing PowerPoint (.pptx) files programmatically using Node.js and pptxgenjs. Before generating, interviews the user about their domain role and preferred design philosophy, then adapts layout, color palette, typography, and structure accordingly. Use when the user wants to generate slide decks, add/edit slides, customize layouts, shapes, text, or colors."
---

# npm PowerPoint Expert (pptxgenjs)

## Step 1 — User Interview (ALWAYS run before writing any code)

Before generating any slide, ask the user **both** of these questions in a single message using the `ask_user_input` tool:

```
Q1 (single_select): "What's your role / domain?"
Options:
  - Business / Finance — executive reports, investor decks, KPI dashboards
  - Marketing / Creative — campaign decks, brand storytelling, product launches
  - Engineering / Technical — architecture diagrams, sprint reviews, system docs
  - Academic / Research — thesis defence, conference talks, literature reviews

Q2 (multi_select): "Which design philosophy should guide this presentation?"
Options:
  - Minimalist / Clean — less is more, ample whitespace (Dieter Rams)
  - Storytelling / Narrative — one idea per slide, emotional arc (Garr Reynolds, Nancy Duarte)
  - Data-driven — maximize data-ink ratio, avoid chartjunk (Edward Tufte)
  - Corporate / Brand-consistent — brand colors, logo lock-up, template fidelity
```

Do **not** skip this step, even if you think you already know the context.

---

## Step 2 — Apply Domain + Philosophy Profile

Map the user's answers to a concrete design profile before writing code.

### Domain Profiles

| Domain | Slide density | Tone | Typical structure |
|---|---|---|---|
| Business / Finance | Low (≤5 words/bullet) | Formal, authoritative | Title → Exec summary → Data → Recommendation |
| Marketing / Creative | Low–medium | Emotive, punchy | Hook → Problem → Solution → CTA |
| Engineering / Technical | Medium–high | Precise, neutral | Context → Architecture → Details → Next steps |
| Academic / Research | Medium | Scholarly, evidence-first | Intro → Methodology → Results → Discussion |

### Design Philosophy Rules

**Minimalist / Clean (Dieter Rams)**
- Background: white or near-white (`"F8F8F8"`)
- Accent: single strong color only (e.g. `"1A1A2E"` navy or `"E63946"` red)
- Font sizes: Title 40pt, Body 20pt, Caption 14pt
- No decorative shapes; generous margins (x≥0.6, y≥0.6)
- Max 1 visual element per slide alongside text

**Storytelling / Narrative (Garr Reynolds / Nancy Duarte)**
- Full-bleed background images or bold color fills
- Giant single-statement text (52–64pt) per slide
- Minimal bullets — prefer visuals and icons
- Emotional color progressions (dark opener → light resolution)
- High contrast: `"FFFFFF"` text on dark fills

**Data-driven (Edward Tufte)**
- White background, no decorative grid lines
- Tables and charts over decorative graphics
- Annotations directly on data, not in separate legends
- Muted palette: greys + one highlight color for key data points
- High information density is acceptable when the data justifies it

**Corporate / Brand-consistent**
- Ask user for brand hex colors; use placeholders `"003087"` / `"FFFFFF"` / `"FFD700"` until confirmed
- Logo placeholder shape in consistent corner (top-right default)
- Standardised title bar at top (`h: 0.8`) and footer bar at bottom
- Slide numbers on every slide except the title

---

## Step 3 — Code

### Prerequisites

```javascript
const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";
const PptxGenJS = require(G + "pptxgenjs");
```

### Execution

1. List directory — check for existing `.js` script. If found, read it first.
2. **Edit existing** script for update requests; **create new** script for new decks.
3. Run `node <filename>.js` and verify `.pptx` output.

### Annotated Template

```javascript
const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";
const PptxGenJS = require(G + "pptxgenjs");

(async () => {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.33" x 7.5"

  // ── Title Slide ──────────────────────────────────────────────
  const title = pptx.addSlide();
  title.background = { color: "1A1A2E" }; // ← swap per philosophy

  title.addText("Presentation Title", {
    x: 1, y: 2.5, w: 11, h: 1.2,
    fontSize: 48, bold: true,
    color: "FFFFFF", align: "center",
  });
  title.addText("Subtitle or Date", {
    x: 1, y: 3.9, w: 11, h: 0.6,
    fontSize: 18, color: "AAAACC", align: "center",
  });

  // ── Content Slide ────────────────────────────────────────────
  const slide = pptx.addSlide();
  slide.background = { color: "FFFFFF" };

  // Title bar (Corporate / Brand example)
  slide.addShape("rect", {
    x: 0, y: 0, w: 13.33, h: 0.8,
    fill: { color: "1A1A2E" }, line: { color: "1A1A2E" },
  });
  slide.addText("Section Title", {
    x: 0.4, y: 0.1, w: 10, h: 0.6,
    fontSize: 22, bold: true, color: "FFFFFF",
  });

  // Body — mixed style text array
  slide.addText(
    [
      { text: "Key point one\n", options: { fontSize: 18, color: "1A1A2E", bold: true } },
      { text: "Supporting detail for point one\n", options: { fontSize: 14, color: "444444" } },
      { text: "Key point two\n", options: { fontSize: 18, color: "1A1A2E", bold: true } },
      { text: "Supporting detail for point two", options: { fontSize: 14, color: "444444" } },
    ],
    { x: 0.5, y: 1.1, w: 12, h: 5.5 }
  );

  // Slide number
  slide.addText("2", {
    x: 12.5, y: 7.1, w: 0.6, h: 0.3,
    fontSize: 10, color: "999999", align: "right",
  });

  await pptx.writeFile({ fileName: "output.pptx" });
  console.log("Generated: output.pptx");
})();
```

---

## Key API Reference

| Feature | Method | Notes |
|---|---|---|
| Add slide | `pptx.addSlide()` | Returns slide object |
| Background | `slide.background = { color }` | Hex, no `#` |
| Add text | `slide.addText(str or array, opts)` | Array enables mixed styles |
| Add shape | `slide.addShape("rect", opts)` | Always use string names |
| Add image | `slide.addImage({ path, x, y, w, h })` | `.png` / `.jpg` |
| Add table | `slide.addTable(rows, opts)` | Rows = arrays of cell objects |
| Layout | `pptx.layout = "LAYOUT_WIDE"` | Also `"LAYOUT_4x3"` |
| Save | `pptx.writeFile({ fileName })` | Returns Promise |

**Valid shape strings:** `"rect"` · `"roundRect"` · `"ellipse"` · `"triangle"` · `"line"` · `"pentagon"` · `"hexagon"`

---

## Philosophy × Domain Quick-Reference

| Role \ Philosophy | Minimalist | Storytelling | Data-driven | Corporate |
|---|---|---|---|---|
| Business / Finance | Clean KPI cards, white bg | Bold exec narrative slides | Dense data tables, muted palette | Branded boardroom template |
| Marketing / Creative | White-space hero slides | Full-bleed visual storytelling | Campaign metrics annotated | On-brand product launch |
| Engineering / Technical | Diagram-first, no clutter | Problem → solution arc | Architecture + data overlay | Branded tech spec |
| Academic / Research | Paper-clean layout | Conference narrative flow | Figure-heavy, Tufte tables | Institutional template |

---

## Slide Layout Library — อย่าใช้ Bullet ทุก Slide

**กฎสำคัญ:** ก่อนเขียนโค้ดทุก slide ให้ถามตัวเองว่า "เนื้อหานี้ควรใช้ layout ไหน?" แล้วเลือกจากตารางด้านล่าง — bullet list เป็นแค่ 1 ใน 8 ตัวเลือก

| Layout | เหมาะกับเนื้อหา | โครงสร้างหลัก |
|---|---|---|
| **Title Splash** | เปิดเรื่อง, transition ระหว่าง section | Big text กลางหน้า + พื้นหลังสี |
| **Big Statement** | ไอเดียหลัก, quote, insight สำคัญ | ประโยคเดียว 48–64pt, ไม่มี bullet |
| **Two Column** | เปรียบเทียบ Before/After, Pro/Con | สองกล่องข้อความข้างกัน |
| **Image + Caption** | Case study, ภาพประกอบ, product shot | รูปใหญ่ + ข้อความสั้นด้านข้างหรือล่าง |
| **Data Callout** | KPI, metric เดี่ยวที่สำคัญมาก | ตัวเลขใหญ่ 72pt + label เล็กๆ |
| **Timeline** | ขั้นตอน, roadmap, ประวัติ | shape + เส้น + text แนวนอน |
| **Table** | ข้อมูลเปรียบเทียบหลายมิติ | `addTable()` structured |
| **Bullet List** | หลายประเด็นที่ต้องอ่านครบ | `bullet: true` array |

---

### โค้ดตัวอย่างแต่ละ Layout

**1. Title Splash**
```javascript
const s = pptx.addSlide();
s.background = { color: "1A1A2E" };
s.addText("Chapter 2", {
  x: 0, y: 2.8, w: 13.33, h: 0.7,
  fontSize: 18, color: "AAAACC", align: "center",
});
s.addText("การวิเคราะห์ตลาด", {
  x: 0, y: 3.3, w: 13.33, h: 1.4,
  fontSize: 52, bold: true, color: "FFFFFF", align: "center",
});
```

**2. Big Statement** (ไม่มี bullet เลย)
```javascript
const s = pptx.addSlide();
s.background = { color: "F8F8F8" };
s.addText(""ลูกค้า 73% ตัดสินใจซื้อภายใน 8 วินาที"", {
  x: 1.2, y: 1.8, w: 11, h: 3.5,
  fontSize: 44, bold: true, color: "1A1A2E",
  align: "center", valign: "middle",
});
s.addText("— Nielsen Consumer Study 2023", {
  x: 1.2, y: 5.5, w: 11, h: 0.5,
  fontSize: 14, color: "888888", align: "center",
});
```

**3. Two Column**
```javascript
const s = pptx.addSlide();
s.background = { color: "FFFFFF" };
// Left column
s.addShape("rect", { x: 0.4, y: 1, w: 5.8, h: 5.5, fill: { color: "F0F4FF" }, line: { color: "F0F4FF" } });
s.addText("Before", { x: 0.4, y: 1, w: 5.8, h: 0.6, fontSize: 16, bold: true, color: "888888", align: "center" });
s.addText("ขั้นตอนซับซ้อน\nใช้เวลา 3 ชั่วโมง\nเกิด error บ่อย", {
  x: 0.6, y: 1.8, w: 5.4, h: 4.2,
  fontSize: 18, color: "444444", valign: "top",
});
// Right column
s.addShape("rect", { x: 7.1, y: 1, w: 5.8, h: 5.5, fill: { color: "EAFAF1" }, line: { color: "EAFAF1" } });
s.addText("After", { x: 7.1, y: 1, w: 5.8, h: 0.6, fontSize: 16, bold: true, color: "27AE60", align: "center" });
s.addText("คลิกเดียวเสร็จ\nใช้เวลา 5 นาที\nอัตโนมัติ 100%", {
  x: 7.3, y: 1.8, w: 5.4, h: 4.2,
  fontSize: 18, color: "1E8449", valign: "top",
});
```

**4. Data Callout** (ตัวเลขใหญ่)
```javascript
const s = pptx.addSlide();
s.background = { color: "FFFFFF" };
s.addText("รายได้รวม Q3", {
  x: 0, y: 1.5, w: 13.33, h: 0.7,
  fontSize: 20, color: "888888", align: "center",
});
s.addText("฿ 14.2M", {
  x: 0, y: 2.1, w: 13.33, h: 2.5,
  fontSize: 80, bold: true, color: "1A1A2E", align: "center",
});
s.addText("▲ 22% จากปีที่แล้ว", {
  x: 0, y: 4.5, w: 13.33, h: 0.7,
  fontSize: 22, color: "27AE60", align: "center",
});
```

**5. Timeline** (แนวนอน)
```javascript
const s = pptx.addSlide();
s.background = { color: "FFFFFF" };
const steps = ["Research", "Design", "Build", "Launch"];
const colors = ["3498DB", "9B59B6", "E67E22", "27AE60"];
steps.forEach((label, i) => {
  const x = 1.2 + i * 2.8;
  s.addShape("ellipse", { x, y: 3, w: 0.7, h: 0.7, fill: { color: colors[i] }, line: { color: colors[i] } });
  s.addText(label, { x: x - 0.5, y: 3.9, w: 1.7, h: 0.5, fontSize: 14, color: "333333", align: "center" });
  if (i < steps.length - 1) {
    s.addShape("line", { x: x + 0.7, y: 3.35, w: 2.1, h: 0, line: { color: "CCCCCC", width: 2 } });
  }
});
```

---

### เมื่อไหร่ถึงใช้ Bullet ได้?

ใช้ `bullet: true` เฉพาะเมื่อ **มี 3 ประเด็นขึ้นไปที่ต้องอ่านครบทุกข้อ** เท่านั้น ถ้าน้อยกว่านั้นให้ใช้ Big Statement หรือ Two Column แทน

---

## Common Bugs & Fixes

### 🐛 Text box แสดงเป็นเส้น (zero-height box)

**อาการ:** text box ใน slide กลายเป็นเส้นบางๆ แทนที่จะเป็นกล่องข้อความ

**สาเหตุ & วิธีแก้:**

**1. ลืมใส่ `h` หรือค่าเป็น 0**
```javascript
// ❌ ผิด — ขาด h
slide.addText("Dynamic Template Selection", { x: 0.5, y: 1, w: 9 })

// ✅ ถูก — ต้องมี h เสมอ
slide.addText("Dynamic Template Selection", { x: 0.5, y: 1, w: 9, h: 1 })
```

**2. ใช้ `autoFit: true` ผิดวิธี**
```javascript
// ❌ ผิด — autoFit ไม่ใช่ boolean ใน pptxgenjs
slide.addText("...", { x: 0.5, y: 1, w: 9, h: 0, autoFit: true })

// ✅ ถูก — กำหนด h ชัดเจน + shrinkText
slide.addText("...", { x: 0.5, y: 1, w: 9, h: 0.6, shrinkText: false, fontSize: 16 })
```

**3. Text array แต่ dimension หาย**
```javascript
// ❌ ผิด — options ของกล่อง (x/y/w/h) หายไป
slide.addText([
  { text: "Item A", options: { fontSize: 16 } },
  { text: "Item B", options: { fontSize: 16 } },
])

// ✅ ถูก — dimension ต้องอยู่นอก array เสมอ
slide.addText(
  [
    { text: "Item A\n", options: { fontSize: 16 } },
    { text: "Item B",   options: { fontSize: 16 } },
  ],
  { x: 0.5, y: 1, w: 9, h: 2 }  // ← ตรงนี้
)
```

**✅ Template bullet list ที่ถูกต้อง**
```javascript
slide.addText(
  [
    { text: "Dynamic Template Selection\n",            options: { fontSize: 16, bullet: true } },
    { text: "Color Palette Enforcement (Orange/White)\n", options: { fontSize: 16, bullet: true } },
    { text: "Bulk Asset Generation",                   options: { fontSize: 16, bullet: true } },
  ],
  {
    x: 0.5,
    y: 1.0,
    w: 9.0,
    h: 2.0,      // ← ถ้าไม่แน่ใจ ให้ใส่ค่าเผื่อไว้ก่อน แล้วค่อยปรับ
    valign: "top",
    fontSize: 16,
  }
)
```

> **กฎง่ายๆ:** ทุก `addText()` ต้องมี `x`, `y`, `w`, `h` ครบ 4 ค่าเสมอ — ขาดตัวใดตัวหนึ่งไม่ได้

---

## Limitations & Gotchas

- Never use `pptx.ShapeType.XXX` — always use explicit string names like `"rect"`.
- Coordinates are in **inches**; colors are **hex without `#`**.
- Thai text renders correctly in `.pptx` without extra font embedding.

## Error Handling

```bash
node create.js 2>&1
node -e "const G = require('child_process').execSync('npm root -g').toString().trim() + '/'; require(G + 'pptxgenjs'); console.log('OK')"
```