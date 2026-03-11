# Estimation Rules & Guidelines

---

## กฎ 3 Scenarios (ต้องมีเสมอ)

| Scenario | Multiplier | ใช้เมื่อ |
|----------|-----------|--------|
| Optimistic | Base × 0.8 | ทุกอย่างราบรื่น ไม่มี Blocker |
| Realistic | Base × 1.0 | มี Minor Issues บ้าง (Default) |
| Pessimistic | Base × 1.4 | มี Scope Creep, Bug ซับซ้อน, ทีมใหม่ |

> **กฎทอง**: เสนอ Realistic ให้ลูกค้า แต่วางแผนด้วย Pessimistic เสมอ

---

## Buffer ที่ต้องบวกเสมอ

| ประเภท Buffer | % เพิ่ม | เหตุผล |
|-------------|--------|--------|
| Code Review + PR Process | +10% | ทุก Task ต้องผ่าน Review |
| Bug Fixing (during dev) | +15% | Bug ที่พบระหว่างพัฒนา |
| Integration & Testing | +20% | ทดสอบ End-to-End |
| Meetings & Communication | +10% | Daily standup, Planning, Review |
| Unexpected Requirements | +10% | Scope ที่เปลี่ยนระหว่างทาง |
| **รวม Recommended Buffer** | **+65%** | บวกทั้งหมดเข้าไปใน Estimate |

**ตัวอย่าง:**
```
Raw Dev Hours: 100 hrs
+ Buffer 65%:  +65 hrs
Total:         165 hrs
```

> สำหรับ MVP หรือทีมใหม่ ใช้ Buffer +80-100%

---

## Story Points → Hours Conversion

| Story Points | Realistic Hours | หมายเหตุ |
|-------------|----------------|---------|
| 1 | 2-3 hrs | งานเล็กมาก |
| 2 | 4-6 hrs | งานเล็ก |
| 3 | 6-10 hrs | งานปานกลาง |
| 5 | 12-20 hrs | งานใหญ่ |
| 8 | 24-40 hrs | งานซับซ้อน |
| 13 | ควรแตกก่อน | มักเป็น 40-80 hrs ถ้าบังคับ |

**Formula อย่างง่าย:**
```
Total Hours = Total Story Points × Avg Hours per Point
Avg Hours per Point (Mid complexity) ≈ 4-6 hrs
```

---

## Velocity Reference (ถ้าไม่มี Historical Data)

| ทีม | Sprint (2 สัปดาห์) | ชั่วโมงทำงาน/Sprint |
|-----|-------------------|-------------------|
| 1 Dev (Full-time) | 10-15 pts | 60-70 hrs |
| 2 Dev | 20-30 pts | 120-140 hrs |
| 3 Dev | 30-45 pts | 180-210 hrs |
| 4 Dev | 40-55 pts | 240-270 hrs |

> ลด 20% สำหรับ Sprint แรก (ทีมยังปรับตัว)
> ลด 30% สำหรับทีมที่ไม่เคยทำงานด้วยกันมาก่อน

---

## Task ที่มักถูกลืมใน Estimate

ให้ตรวจสอบว่า Estimate รวมสิ่งเหล่านี้ด้วย:

**Technical Tasks:**
- [ ] Environment Setup (Dev/Staging/Prod): 8-16 hrs
- [ ] CI/CD Pipeline Setup: 8-16 hrs
- [ ] Database Migration Scripts: 2-4 hrs per table
- [ ] Authentication & Authorization: 16-24 hrs
- [ ] Error Handling & Logging: 8-12 hrs
- [ ] API Documentation: 4-8 hrs

**Non-Technical Tasks:**
- [ ] Sprint Planning (ต่อ Sprint): 2-4 hrs
- [ ] Sprint Review/Demo (ต่อ Sprint): 1-2 hrs
- [ ] Code Review (ต่อ PR): 30-60 mins
- [ ] UAT Support: 8-16 hrs
- [ ] Deployment & Go-live Support: 4-8 hrs
- [ ] Knowledge Transfer / Documentation: 8-16 hrs

---

## Red Flags ที่ต้องแจ้ง User

แจ้ง Warning ถ้าพบสิ่งเหล่านี้:

🚩 **Task ที่ใหญ่เกินไป**: Task เดียว > 16 hrs → ควรแตกย่อย
🚩 **Sprint Overloaded**: Hours/Sprint > (Dev จำนวน × 60 hrs) → ต้อง Reschedule
🚩 **Dependency Risk**: หลาย Tasks depend กัน → เสี่ยง Bottleneck
🚩 **ไม่มี QA Time**: ทุก Sprint ต้องมี Testing Hours ≥ 15% ของ Dev Hours
🚩 **ไม่มี Buffer**: Total Hours = Raw Estimate → ต้องบวก Buffer

---

## สูตรคำนวณ Timeline

```
Total Hours → Working Weeks:
Working Weeks = Total Hours ÷ (Dev Count × 40 hrs/week)

Working Weeks → Calendar Weeks:
Calendar Weeks = Working Weeks × 1.2  (บวก Holiday/Leave ~20%)

Calendar Weeks → Sprints:
Sprints = ceil(Calendar Weeks ÷ 2)
```

**ตัวอย่าง:**
```
Total Realistic Hours: 400 hrs
Team: 2 Dev × 40 hrs/week = 80 hrs/week
Working Weeks: 400 ÷ 80 = 5 สัปดาห์
Calendar Weeks: 5 × 1.2 = 6 สัปดาห์
Sprints: ceil(6 ÷ 2) = 3 Sprints
```

---

## ROI Calculation (ถ้าต้องการ)

```
ROI = (Benefit - Cost) ÷ Cost × 100%

ตัวอย่าง:
- Project Cost: ฿500,000
- เวลาที่ประหยัดได้ต่อเดือน: 100 ชั่วโมง × ฿250/hr = ฿25,000/เดือน
- Break-even: 500,000 ÷ 25,000 = 20 เดือน
- ROI ปีที่ 2: (300,000 - 0) ÷ 500,000 = 60%
```
