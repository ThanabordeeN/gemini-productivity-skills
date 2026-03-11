---
name: discovery-agent
description: >
  Orchestrates the complete Phase 1: Product Discovery & Analysis pipeline — from raw idea
  to a structured, dev-ready handoff package. Use this skill whenever the user wants to:
  explore a product idea, analyze a problem space, gather and structure requirements,
  define project scope, create feasibility studies, produce BRD/PRD documents, analyze
  competitors, define MVPs, or prepare any discovery deliverables before development begins.
  Also triggers on: "วิเคราะห์โปรเจกต์", "สำรวจความต้องการ", "เขียน requirements",
  "ทำ discovery", "วิเคราะห์ปัญหา", "กำหนด scope", "เตรียมงานให้ dev", "ทำ BRD", "ทำ PRD",
  "วิเคราะห์ตลาด", "หา MVP", "product discovery", "requirements gathering".
  ALWAYS use this skill — not just docx/xlsx alone — when the goal is to go from a product
  idea or problem statement all the way to a structured dev-ready package.
---

# Discovery Agent — Phase 1 Orchestrator

รับ "ไอเดีย" หรือ "ปัญหา" แล้วผลิต Discovery Package ครบชุด
จากนั้น **ส่งต่อให้ `product-backlog-agent` โดยอัตโนมัติ**

---

## Pipeline Overview

```
[INPUT: ไอเดีย / ปัญหา / ไฟล์ Requirements]
                    ↓
         ┌──────────────────────┐
         │   discovery-agent    │  ← Skill นี้
         │   (Orchestrator)     │
         └──────────────────────┘
                    ↓
     ┌──────────────┬───────────────┬──────────────┐
     ▼              ▼               ▼              ▼
[docx skill]  [xlsx skill]   [docx skill]   [docx skill]
  Problem       Competitive     BRD/PRD        Feasibility
  Statement     Analysis        Document       Study
     └──────────────┴───────────────┴──────────────┘
                    ↓
         ✅ Discovery Package พร้อม
                    ↓
         🤖 product-backlog-agent
         (Sprint Plan + User Stories + Backlog)
```

---

## Deliverables ของ Phase 1

| # | ไฟล์ | Skill | เนื้อหา |
|---|------|-------|--------|
| 1 | `problem-statement.docx` | docx | Problem Definition, Target Users, Goals |
| 2 | `competitive-analysis.xlsx` | xlsx | คู่แข่ง, Feature Matrix, Positioning |
| 3 | `brd-requirements.docx` | docx | Business + Functional + Non-Functional Req |
| 4 | `feasibility-study.docx` | docx | Technical, Cost, Time Assessment + Go/No-Go |
| 5 | `requirements-summary.md` | (inline) | **Handoff Document สำหรับ product-backlog-agent** |

---

## Step-by-Step Workflow

---

### Step 0 — รับ Input และถาม Discovery Questions

เมื่อรับ Input มาแล้ว ให้ทำ **Structured Interview** กับผู้ใช้ก่อน
อ่าน `references/discovery-questions.md` เพื่อดู Question Bank

**ถามในรูปแบบกลุ่ม ไม่ถามทีละข้อ:**

```
กลุ่มที่ 1: ปัญหาและเป้าหมาย
กลุ่มที่ 2: ผู้ใช้และตลาด  
กลุ่มที่ 3: ข้อจำกัดและ Context
```

หากผู้ใช้บอกว่า "ข้ามไปเลย" หรือ "รู้อยู่แล้ว" → ใช้ข้อมูลที่มีและดำเนินการต่อ

---

### Step 1 — Problem Statement Document

**ใช้ docx skill** สร้าง `problem-statement.docx`

อ่าน `/mnt/skills/public/docx/SKILL.md` ก่อนเขียน

โครงสร้างเอกสาร:
```
1. Executive Summary (ปัญหาในภาพรวม 1 หน้า)
2. Problem Definition
   - Current Situation (สถานการณ์ปัจจุบัน)
   - Pain Points (ปัญหาที่พบ)
   - Root Cause Analysis (5 Whys)
   - Impact (ผลกระทบถ้าไม่แก้)
3. Target Users
   - User Personas (อย่างน้อย 2 Persona)
   - User Journey (Before Software)
4. Desired Outcome
   - Vision Statement
   - Success Metrics (KPIs ที่วัดได้)
5. Scope Boundaries
   - In Scope
   - Out of Scope
```

อ่าน `references/persona-template.md` สำหรับ format ของ User Persona

---

### Step 2 — Competitive Analysis

**ใช้ xlsx skill** สร้าง `competitive-analysis.xlsx`

อ่าน `/mnt/skills/public/xlsx/SKILL.md` ก่อนเขียน

**Sheet 1: Competitor Overview**
| Column | เนื้อหา |
|--------|--------|
| Competitor | ชื่อคู่แข่ง |
| Type | Direct / Indirect / Substitute |
| Market Position | Leader / Challenger / Niche |
| Pricing Model | Free / Freemium / Paid / Enterprise |
| Target Segment | กลุ่มเป้าหมายของคู่แข่ง |
| Strength | จุดแข็ง |
| Weakness | จุดอ่อน |
| URL | เว็บไซต์ |

**Sheet 2: Feature Matrix**
- แถวแนวตั้ง = Features สำคัญ
- แถวแนวนอน = คู่แข่ง + "Our Product"
- ค่า: ✅ มี / ❌ ไม่มี / ⚠️ บางส่วน

**Sheet 3: Positioning Map**
- แกน X = Price (Low → High)
- แกน Y = Complexity (Simple → Advanced)
- Plot แต่ละคู่แข่งและ "Our Product" target position

> หากไม่มีข้อมูลคู่แข่ง ให้แจ้ง User ขอข้อมูล หรือใช้ข้อมูลทั่วไปจาก knowledge และระบุว่า "ต้องยืนยัน"

---

### Step 3 — Business Requirements Document (BRD)

**ใช้ docx skill** สร้าง `brd-requirements.docx`

อ่าน `/mnt/skills/public/docx/SKILL.md` ก่อนเขียน
อ่าน `references/requirements-template.md` สำหรับ format

โครงสร้างเอกสาร:
```
1. Project Overview
   - Background
   - Objectives
   - Stakeholders

2. Business Requirements
   BR-001: [ความต้องการทางธุรกิจ]
   BR-002: ...

3. Functional Requirements
   FR-001: [สิ่งที่ระบบต้องทำได้]
   FR-002: ...
   (จัดกลุ่มตาม Module/Feature)

4. Non-Functional Requirements
   NFR-001: Performance — [spec]
   NFR-002: Security — [spec]
   NFR-003: Scalability — [spec]
   NFR-004: Availability — [spec]

5. Assumptions & Dependencies
6. Constraints (เวลา, งบ, เทคโนโลยี)
7. Glossary
```

---

### Step 4 — Feasibility Study

**ใช้ docx skill** สร้าง `feasibility-study.docx`

อ่าน `/mnt/skills/public/docx/SKILL.md` ก่อนเขียน

โครงสร้างเอกสาร:
```
1. Technical Feasibility
   - Stack ที่แนะนำ + เหตุผล
   - ความยากทางเทคนิค (High/Med/Low)
   - Risks และ Mitigation

2. Resource Feasibility
   - ทีมที่ต้องการ (Role + จำนวน)
   - Skills ที่จำเป็น

3. Timeline Feasibility
   - Rough Estimate (เป็น Sprint)
   - Milestone หลัก

4. Cost Feasibility (ถ้ามีข้อมูล)
   - Development Cost (ประมาณ)
   - Infrastructure Cost
   - Maintenance Cost

5. Risk Assessment
   | Risk | Probability | Impact | Mitigation |

6. Go / No-Go Recommendation
   ✅ Go: ระบุเหตุผล
   ❌ No-Go: ระบุเหตุผล
   ⚠️ Go with Conditions: ระบุเงื่อนไข
```

---

### Step 5 — สร้าง Requirements Summary (Handoff Document)

สร้าง `requirements-summary.md` เป็นไฟล์ Structured ที่ `product-backlog-agent` จะใช้เป็น Input

Format:
```markdown
# Requirements Summary — [Project Name]
_Generated by discovery-agent | Date: [date]_

## Project Context
- **Product:** [ชื่อ]
- **Problem:** [1-2 ประโยค]
- **Target Users:** [รายชื่อ Persona]
- **MVP Goal:** [เป้าหมาย MVP]
- **Timeline:** [จำนวน Sprints ที่แนะนำ]
- **Team Size:** [Dev กี่คน]

## Epics & Features

### Epic 1: [ชื่อ]
- Feature 1.1: [ชื่อ] — Priority: Must | ~X pts
- Feature 1.2: [ชื่อ] — Priority: Must | ~X pts

### Epic 2: [ชื่อ]
- Feature 2.1: [ชื่อ] — Priority: Should | ~X pts

## Non-Functional Requirements
- Performance: [spec]
- Security: [spec]
- Scalability: [spec]

## Constraints
- [ข้อจำกัด]

## Out of Scope
- [สิ่งที่ไม่ทำใน Phase นี้]
```

---

### Step 6 — Discovery Package Summary + Handoff

หลังสร้างครบทุกไฟล์ แสดงสรุป:

```
✅ Discovery Package พร้อมแล้ว

📄 problem-statement.docx    — Problem, Personas, Success Metrics
📊 competitive-analysis.xlsx — X คู่แข่ง, Feature Matrix
📋 brd-requirements.docx     — X Business Req, X Functional Req
🔍 feasibility-study.docx    — Recommendation: [Go/No-Go]

────────────────────────────────────
🚀 กำลังส่งต่อให้ product-backlog-agent...
────────────────────────────────────
```

จากนั้น **อ่าน `requirements-summary.md` ที่สร้างไว้** แล้ว **เรียก product-backlog-agent** โดย:

> ส่ง requirements-summary.md เป็น Input ให้ product-backlog-agent ดำเนินการ Phase ถัดไปทันที
> product-backlog-agent จะผลิต: product-backlog.xlsx, user-stories.docx, sprint-plan.xlsx

---

## Handling Special Cases

**ถ้าผู้ใช้มีไฟล์ Requirements อยู่แล้ว:**
→ อ่านไฟล์ → ข้าม Step 0 (Discovery Questions) → เริ่ม Step 1 ทันที

**ถ้าผู้ใช้ต้องการแค่บางเอกสาร:**
→ ทำเฉพาะที่ขอ แต่ยังต้องสร้าง requirements-summary.md เสมอ

**ถ้าผู้ใช้ไม่รู้จักคู่แข่ง:**
→ ใช้ความรู้ทั่วไปสร้าง Competitive Analysis เบื้องต้น + ระบุว่า "ต้องยืนยันเพิ่มเติม"

**ถ้าผู้ใช้บอกว่าไม่ต้องส่งต่อ product-backlog-agent:**
→ หยุดที่ Step 5 ไม่ต้อง trigger ต่อ

---

## Reference Files

- `references/discovery-questions.md` — Question Bank สำหรับ Structured Interview
- `references/persona-template.md` — Template User Persona + ตัวอย่าง
- `references/requirements-template.md` — Format มาตรฐาน BRD + ตัวอย่าง Requirements
