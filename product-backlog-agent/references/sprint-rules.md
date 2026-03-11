# Sprint Rules & Sizing Guidelines

## Default Sprint Configuration

| Setting | Default | ปรับได้ |
|---------|---------|--------|
| Sprint Duration | 2 สัปดาห์ | 1-4 สัปดาห์ |
| Max Story Points | 40 pts/sprint | ตาม Velocity ทีม |
| Working Days | 10 วัน | - |
| Buffer | 20% | สำหรับ Bug, Meeting, Review |

---

## Sprint Planning Rules

### Rule 1: Sprint Goal
ทุก Sprint ต้องมี Goal ที่วัดได้ เช่น:
- "ผู้ใช้ Login และ Register ได้"
- "แสดงรายการสินค้าและ Filter ได้"
- "ชำระเงินผ่าน Credit Card ได้"

### Rule 2: Story Priority Order
ใส่ Stories ใน Sprint ตามลำดับนี้:
1. Must Have ก่อนเสมอ
2. Dependencies ต้องเสร็จก่อน Stories ที่ depend
3. กระจาย Frontend + Backend ให้สมดุล

### Rule 3: Task Breakdown
แต่ละ User Story แตกเป็น Tasks ตามประเภทงาน:

```
Story: User Login
├── [BE] สร้าง POST /auth/login endpoint
├── [BE] เขียน JWT generation + validation
├── [DB] สร้าง users table + migration
├── [FE] สร้าง Login form component
├── [FE] เชื่อมต่อ API + handle error states
└── [QA] เขียน test cases + UAT checklist
```

### Rule 4: Task Estimate
| Task Type | Estimate Range |
|-----------|---------------|
| Simple API endpoint | 2-4 hrs |
| Complex business logic | 4-8 hrs |
| UI Component (simple) | 1-3 hrs |
| UI Component (complex) | 4-8 hrs |
| Database design + migration | 2-4 hrs |
| Integration (3rd party) | 4-12 hrs |
| Testing + QA | 20-30% ของ dev time |

---

## Sprint Schedule Template

```
Sprint X (วันที่ XX/XX - XX/XX)
Goal: [Sprint Goal]

Week 1:
- วันจันทร์: Sprint Planning (2 ชม.)
- วันอังคาร-พฤหัส: Development
- วันศุกร์: Mid-sprint check / code review

Week 2:
- วันจันทร์-พุธ: Development + Testing
- วันพฤหัส: UAT / Staging deployment
- วันศุกร์: Sprint Review + Retrospective (2 ชม.)
```

---

## Velocity คำนวณอย่างไร

**สำหรับทีมใหม่ (Sprint 1-2):**
ใช้ Conservative Estimate = 20-30 pts/sprint

**สำหรับทีมที่มี Data แล้ว:**
```
Velocity = Average(Story Points completed ใน 3 Sprints ล่าสุด)
```

**ตัวอย่าง:**
- Sprint 1: 28 pts completed
- Sprint 2: 32 pts completed  
- Sprint 3: 30 pts completed
- Velocity = (28+32+30)/3 = 30 pts

---

## Sprint Allocation ตามขนาดทีม

| ขนาดทีม | Dev | Points/Sprint | แนะนำ Sprint |
|---------|-----|--------------|-------------|
| Solo | 1 Dev | 15-20 pts | 2 สัปดาห์ |
| Small | 2-3 Dev | 30-50 pts | 2 สัปดาห์ |
| Medium | 4-6 Dev | 60-100 pts | 2 สัปดาห์ |
| Large | 7+ Dev | ควรแบ่ง Team | - |

---

## Task Assignment Strategy

หาก User ไม่ระบุ Assignee ให้ใช้ Pattern นี้:

```
ถ้ามี 1 Dev:
→ Assign ทุก Task ให้ Dev 1

ถ้ามี 2 Dev:
→ Dev 1 = Backend + Database
→ Dev 2 = Frontend + Integration

ถ้ามี 3 Dev:
→ Dev 1 = Backend/API
→ Dev 2 = Frontend
→ Dev 3 = DevOps + Testing + Full-stack support

ถ้าไม่ระบุจำนวน:
→ ใช้ TBD ใน column Assignee
→ แจ้ง User ให้เติมเอง
```

---

## Definition of Done (DoD)

Task ถือว่า "Done" เมื่อ:
- [ ] Code เขียนและ commit แล้ว
- [ ] Unit tests ผ่าน
- [ ] Code review ผ่าน (ถ้ามี reviewer)
- [ ] Deploy ขึ้น Staging แล้ว
- [ ] QA ทดสอบและยืนยันแล้ว
