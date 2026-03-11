---
name: estimation-agent
description: >
  Produces detailed Cost Estimation and Man Hours breakdown for software projects.
  Use this skill whenever the user wants to: estimate development cost, calculate man-hours
  per feature or sprint, produce a project budget, compare team configurations, create
  cost proposals for clients, or get ROI analysis. Triggers on: "ประเมิน cost",
  "คำนวณ man hours", "งบประมาณโปรเจกต์", "ค่าใช้จ่ายพัฒนา", "ราคาโปรเจกต์",
  "estimate", "how much will this cost", "how long will this take", "project budget",
  "cost breakdown", "resource planning", "เตรียม proposal ราคา".
  ALWAYS use this skill — not just xlsx/docx alone — when the goal is a complete,
  justified cost and timeline estimate for a software project.
---

# Estimation Agent

รับ Backlog / Sprint Plan แล้วผลิต Cost & Man Hours Package ครบชุด
ใช้เป็น Input สำหรับ Proposal ลูกค้า หรือวางแผน Resource ภายใน

---

## Deliverables

| # | ไฟล์ | Skill | เนื้อหา |
|---|------|-------|--------|
| 1 | `manhours-breakdown.xlsx` | xlsx | Hours ทุก Task แยกตาม Role / Sprint / Feature |
| 2 | `cost-estimation.xlsx` | xlsx | ต้นทุน Dev + Infra + Buffer + สรุปรวม |
| 3 | `project-proposal.docx` | docx | เอกสาร Proposal พร้อมส่งลูกค้าหรือ Management |

---

## Input ที่รับได้

- `sprint-plan.xlsx` จาก product-backlog-agent ← **แม่นยำที่สุด**
- `product-backlog.xlsx` จาก product-backlog-agent ← ประมาณจาก Story Points
- ข้อความบรรยาย Features ← rough estimate เท่านั้น

> ถ้าไม่มี sprint-plan ให้แจ้ง User และเสนอให้รัน product-backlog-agent ก่อน
> หรือถามขนาดโปรเจกต์และทำ rough estimate แทน

---

## Step-by-Step Workflow

---

### Step 0 — รับ Input และตั้งค่า Rate Card

ก่อนคำนวณ ถามผู้ใช้ (หรือใช้ค่า Default):

**ถามเป็นกลุ่มเดียว:**
```
1. อัตราค่าจ้าง Dev แต่ละ Role (ถ้าไม่มีใช้ค่า default)
2. จำนวน Dev แต่ละ Role ในทีม
3. ต้องการ 3 Scenarios ไหม? (Optimistic / Realistic / Pessimistic)
4. รวม Infrastructure Cost ด้วยไหม?
5. รูปแบบการคิดราคา: Internal Cost หรือ Client Proposal (+ Margin)?
```

อ่าน `references/rate-card.md` สำหรับค่า Default Rate ตามตลาดไทย

---

### Step 1 — Man Hours Breakdown (xlsx)

อ่าน `/mnt/skills/public/xlsx/SKILL.md` ก่อนสร้าง

สร้าง `manhours-breakdown.xlsx` ด้วย Structure ดังนี้:

**Sheet 1: Hours by Task**
| Column | เนื้อหา |
|--------|--------|
| Sprint | Sprint 1, 2, ... |
| Story ID | อ้างอิงจาก Backlog |
| Story Name | ชื่อ User Story |
| Task ID | TSK-001 |
| Task Name | ชื่องาน |
| Type | Frontend / Backend / DB / DevOps / Design / QA |
| Assignee | Role หรือชื่อ |
| Estimate (hrs) | ชั่วโมงประเมิน |
| Optimistic (hrs) | -20% |
| Pessimistic (hrs) | +40% |
| Notes | ความเสี่ยง / สมมติฐาน |

**Sheet 2: Summary by Role**
| Role | Total Tasks | Optimistic hrs | Realistic hrs | Pessimistic hrs |
|------|------------|----------------|--------------|-----------------|
| Frontend Dev | X | X | X | X |
| Backend Dev | X | X | X | X |
| DB/DevOps | X | X | X | X |
| QA | X | X | X | X |
| **Total** | | | | |

**Sheet 3: Summary by Sprint**
| Sprint | Goal | Start | End | Total hrs | FE hrs | BE hrs | QA hrs |
|--------|------|-------|-----|----------|--------|--------|--------|

**Sheet 4: Summary by Epic/Feature**
| Epic | Feature | Stories | Total hrs | % of Project |
|------|---------|---------|----------|-------------|

Apply:
- Conditional formatting: สีแดงถ้า Task > 16 hrs (ควรแตกย่อย)
- Chart: Pie chart แสดง % hours by Role
- Chart: Bar chart แสดง Hours per Sprint

---

### Step 2 — Cost Estimation (xlsx)

อ่าน `/mnt/skills/public/xlsx/SKILL.md` ก่อนสร้าง

สร้าง `cost-estimation.xlsx` ด้วย Structure ดังนี้:

**Sheet 1: Rate Card**
| Role | Headcount | Daily Rate (THB) | Hrs/Day | Hourly Rate |
|------|-----------|-----------------|---------|-------------|
| Senior Frontend Dev | X | X | 8 | =Daily/8 |
| Senior Backend Dev | X | X | 8 | =Daily/8 |
| Junior Dev | X | X | 8 | =Daily/8 |
| QA Engineer | X | X | 8 | =Daily/8 |
| DevOps / Infra | X | X | 8 | =Daily/8 |
| Project Manager | X | X | 8 | =Daily/8 |

> ทุก Rate ต้องอ้างอิงจาก `references/rate-card.md`
> ใส่เป็น Input cells (สีฟ้า) เพื่อให้ User แก้ไขได้

**Sheet 2: Development Cost**
| Category | Role | Hours | Rate/hr | Cost (THB) |
|----------|------|-------|---------|-----------|
| Sprint 1 | Frontend | X | X | =Hours*Rate |
| Sprint 1 | Backend | X | X | |
| ... | | | | |
| **Subtotal Dev** | | | | |
| + Buffer (20%) | | | | |
| **Total Dev Cost** | | | | |

**Sheet 3: Infrastructure Cost**
| Item | Type | Unit | Qty/Month | Cost/Unit | Monthly | 12 Months |
|------|------|------|-----------|-----------|---------|-----------|
| Cloud Server | AWS EC2 / GCP | Instance | 2 | X | | |
| Database | RDS / Cloud SQL | Instance | 1 | X | | |
| Storage | S3 / GCS | GB | 100 | X | | |
| CDN | CloudFront | GB Transfer | 50 | X | | |
| Domain + SSL | - | Year | 1 | X | | |
| Monitoring | Datadog/Sentry | Month | 12 | X | | |
| **Total Infra (Year 1)** | | | | | | |

อ่าน `references/infra-cost.md` สำหรับ Pricing Reference

**Sheet 4: Total Project Cost Summary**
```
┌─────────────────────────────────────────────────────┐
│              PROJECT COST SUMMARY                    │
├──────────────────────────┬──────────────────────────┤
│                          │  Optimistic │  Realistic  │  Pessimistic
├──────────────────────────┼─────────────────────────┤
│ Development Cost         │             │             │
│ + QA & Testing           │             │             │
│ + Infrastructure (Y1)    │             │             │
│ + Contingency Buffer     │             │             │
├──────────────────────────┼─────────────────────────┤
│ TOTAL PROJECT COST       │             │             │
├──────────────────────────┼─────────────────────────┤
│ Timeline (weeks)         │             │             │
│ Team Size                │             │             │
│ Cost per Sprint          │             │             │
└──────────────────────────┴─────────────────────────┘
```

**Sheet 5: Client Proposal Price (ถ้าเป็น Outsource)**
| Item | Cost | Margin % | Selling Price |
|------|------|---------|--------------|
| Development | | 30% | |
| Infrastructure Setup | | 20% | |
| Project Management | | 30% | |
| **Total Proposal Price** | | | |

---

### Step 3 — Project Proposal Document (docx)

อ่าน `/mnt/skills/public/docx/SKILL.md` ก่อนสร้าง

สร้าง `project-proposal.docx` — เอกสารส่งลูกค้าหรือ Management

โครงสร้าง:
```
[หน้าปก]
โครงการ: [ชื่อ]
เตรียมโดย: [ทีม]
วันที่: [วันที่]
เวอร์ชัน: 1.0

1. Executive Summary (1 หน้า)
   - โปรเจกต์นี้คืออะไร ทำไมต้องทำ
   - ผลลัพธ์ที่คาดหวัง
   - ต้นทุนและระยะเวลาโดยสรุป

2. Scope of Work
   - สิ่งที่รวมอยู่ในราคานี้
   - สิ่งที่ไม่รวม (Out of Scope)
   - Assumptions

3. Timeline & Milestones
   Sprint-by-Sprint Roadmap พร้อม Deliverable แต่ละ Sprint

4. Team Structure
   Role / จำนวน / ความรับผิดชอบ

5. Cost Breakdown
   ตารางสรุป 3 Scenarios
   (ดึงมาจาก cost-estimation.xlsx Sheet 4)

6. Payment Terms (ถ้าเป็น Client Proposal)
   - งวดที่ 1: X% เมื่อ Sign Contract
   - งวดที่ 2: X% เมื่อ UAT ผ่าน
   - งวดที่ 3: X% เมื่อ Go Live

7. Risks & Mitigation
   | Risk | Probability | Impact | Plan |

8. Terms & Conditions (ถ้าจำเป็น)
```

---

### Step 4 — Deliver + Summary

```
✅ Estimation Package พร้อมแล้ว

⏱️ manhours-breakdown.xlsx
   Realistic:    XXX hrs  (~XX สัปดาห์)
   Optimistic:   XXX hrs  (~XX สัปดาห์)
   Pessimistic:  XXX hrs  (~XX สัปดาห์)

💰 cost-estimation.xlsx
   Development:  ฿XXX,XXX
   Infrastructure: ฿XX,XXX/ปี
   Total (Realistic): ฿XXX,XXX

📄 project-proposal.docx
   พร้อมส่ง Management / ลูกค้า
```

---

## Estimation Rules

อ่าน `references/estimation-rules.md` สำหรับกฎการประมาณเวลาและ Buffer ที่ควรใช้

---

## Handling Special Cases

**ไม่มี Sprint Plan:**
→ ใช้ Story Points จาก Backlog × Velocity Rate จาก `references/estimation-rules.md`

**ต้องการเฉพาะ Rough Estimate:**
→ ทำแค่ Sheet Summary ของ cost-estimation.xlsx ไม่ต้องแตก Task

**โปรเจกต์เป็น Outsource / Client Proposal:**
→ เพิ่ม Margin Sheet และ Payment Schedule ใน cost-estimation.xlsx

**ผู้ใช้มี Rate Card ของตัวเอง:**
→ ใช้ Rate ที่รับมา แทนค่า Default ใน rate-card.md

---

## Reference Files

- `references/rate-card.md` — อัตราตลาด Dev ไทยแยกตาม Seniority และ Role
- `references/infra-cost.md` — ราคา Cloud / Infrastructure Reference
- `references/estimation-rules.md` — กฎ Buffer, Velocity, และวิธีคำนวณ
