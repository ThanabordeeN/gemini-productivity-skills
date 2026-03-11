---
name: product-backlog-agent
description: >
  Orchestrates the full Product Backlog → Sprint Planning → Dev Task Assignment pipeline.
  Use this skill whenever the user wants to: convert requirements into a product backlog,
  create user stories from a feature list, plan sprints and assign tasks to developers,
  break down a project into actionable dev work, or produce sprint planning documents.
  Triggers on phrases like "สร้าง backlog", "แตก user story", "วางแผน sprint", "จ่ายงาน dev",
  "product backlog", "sprint planning", "แตกงาน", or any request to turn requirements into
  structured development tasks. Always use this skill — not just docx/xlsx alone — when
  the goal is to produce a complete, multi-document dev planning package.
---

# Product Backlog Agent

An orchestrator skill that transforms Requirements into a full dev-ready planning package
by coordinating the **xlsx** and **docx** skills.

---

## What This Skill Produces

| Output | Skill Used | Description |
|--------|-----------|-------------|
| `product-backlog.xlsx` | xlsx | Feature list with MoSCoW priority, Story Points, Status |
| `user-stories.docx` | docx | User Stories with Acceptance Criteria per Epic |
| `sprint-plan.xlsx` | xlsx | Sprint breakdown with Task → Assignee → Estimate |

---

## Step-by-Step Workflow

### Step 0 — Understand the Input

Accept any of these input forms:
- **Free text** in chat describing the product/features
- **Uploaded file** (.docx, .pdf, .txt) containing requirements
- **Existing backlog** the user wants to reformat or expand

If input is unclear, ask:
> "ช่วยเล่าให้ฟังหน่อยได้ไหมว่าซอฟต์แวร์นี้ทำอะไร และกลุ่มเป้าหมายคือใคร?"

---

### Step 1 — Extract & Structure Requirements

Parse the input and identify:
- **Epics** (กลุ่มใหญ่ของ Feature เช่น Authentication, Dashboard, Payment)
- **Features** (สิ่งที่ระบบต้องทำ)
- **Users / Roles** (ใครใช้ระบบนี้)
- **Constraints** (เวลา, เทคโนโลยี, ข้อจำกัด)

Structure internally as:
```
Epic → [Feature 1, Feature 2, ...]
Feature → [User Story 1, User Story 2, ...]
User Story → [Task 1, Task 2, ...]
```

Read reference file for templates:
→ `references/story-format.md`

---

### Step 2 — Produce Product Backlog (xlsx)

Read `/mnt/skills/public/xlsx/SKILL.md` then create `product-backlog.xlsx` with:

**Sheet 1: Backlog**
| Column | Content |
|--------|---------|
| ID | EPIC-001, FEAT-001 |
| Epic | ชื่อ Epic |
| Feature / Story | ชื่อ Feature หรือ User Story |
| Type | Epic / Feature / Story / Bug |
| Priority | Must / Should / Could / Won't (MoSCoW) |
| Story Points | 1, 2, 3, 5, 8, 13 (Fibonacci) |
| Status | Backlog / In Progress / Done |
| Sprint | Sprint 1 / Sprint 2 / ... |
| Assignee | ชื่อ Dev หรือ TBD |
| Notes | ข้อมูลเพิ่มเติม |

**Sheet 2: Epic Summary**
| Epic | # Stories | Total Points | Priority |
|------|-----------|-------------|---------|

Apply conditional formatting:
- Must = แดง, Should = ส้ม, Could = เหลือง, Won't = เทา

---

### Step 3 — Produce User Stories Document (docx)

Read `/mnt/skills/public/docx/SKILL.md` then create `user-stories.docx` with:

**Structure per Epic:**
```
# [Epic Name]
## Feature: [Feature Name]
### User Story [ID]: [Story Title]

**As a** [role]
**I want to** [action]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] Given [context], When [action], Then [outcome]
- [ ] ...

**Story Points:** X
**Priority:** Must/Should/Could/Won't
**Dependencies:** [Story ID] or None
```

Read `references/story-format.md` for full template and examples.

---

### Step 4 — Produce Sprint Plan (xlsx)

Read `/mnt/skills/public/xlsx/SKILL.md` then create `sprint-plan.xlsx` with:

**Sheet per Sprint (Sprint 1, Sprint 2, ...):**
| Column | Content |
|--------|---------|
| Task ID | TSK-001 |
| Story ID | Reference to backlog |
| Task Name | งานย่อยที่ต้องทำ |
| Type | Frontend / Backend / DB / DevOps / Design |
| Assignee | ชื่อ Dev หรือ TBD |
| Estimate (hrs) | จำนวนชั่วโมงประเมิน |
| Status | To Do / In Progress / Done / Blocked |
| Due Date | วันที่คาดว่าเสร็จ |
| Notes | ข้อมูลเพิ่มเติม |

**Sprint Summary Sheet:**
| Sprint | # Tasks | Total Hours | Start Date | End Date | Goal |
|--------|---------|------------|-----------|---------|------|

Sprint sizing rule (default):
- Sprint = 2 สัปดาห์
- ไม่เกิน 40 Story Points ต่อ Sprint (ปรับได้ตามทีม)

Read `references/sprint-rules.md` for sizing guidelines.

---

### Step 5 — Deliver All Files

After all three files are created, present them together and give a summary:

```
✅ สร้างเสร็จแล้ว 3 ไฟล์:

📊 product-backlog.xlsx  — X epics, Y stories, Z total points
📝 user-stories.docx    — X user stories พร้อม acceptance criteria
📅 sprint-plan.xlsx     — X sprints, Y tasks, พร้อม assign

Sprint 1 Focus: [สรุปเป้าหมาย Sprint แรก]
```

---

## Handling Special Cases

**ถ้า Input เป็นไฟล์ Requirements:**
→ อ่านไฟล์ก่อน แล้ว Extract Epics/Features ใน Step 1

**ถ้าไม่มีรายชื่อ Dev:**
→ ใช้ "Dev 1", "Dev 2" หรือ "TBD" ใน Assignee column แจ้งผู้ใช้ให้เติมเอง

**ถ้ามีแค่ Feature list สั้น ๆ (< 5 items):**
→ ถามว่า "มี Feature อื่นอีกไหม?" ก่อนดำเนินการ

**ถ้าผู้ใช้ต้องการเฉพาะบางไฟล์:**
→ ผลิตแค่ไฟล์ที่ขอ ไม่ต้องทำครบทั้ง 3

---

## Reference Files

- `references/story-format.md` — Template และตัวอย่าง User Story แบบสมบูรณ์
- `references/sprint-rules.md` — กฎการแบ่ง Sprint, Story Point guidelines, Velocity คำนวณอย่างไร
