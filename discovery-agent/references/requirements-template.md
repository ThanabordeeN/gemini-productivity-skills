# Requirements Template — BRD Format

## Requirement ID Convention

```
BR-001   Business Requirement
FR-001   Functional Requirement (จัดกลุ่มตาม Module)
  FR-AUTH-001  Functional → Authentication Module
  FR-PROD-001  Functional → Product Module
NFR-001  Non-Functional Requirement
```

---

## Business Requirement Format

```
BR-[NNN]: [ชื่อ Requirement]
Priority: [Must / Should / Could / Won't]
Description: [อธิบายว่าธุรกิจต้องการอะไร]
Rationale: [ทำไมถึงต้องการสิ่งนี้]
Success Metric: [วัดได้อย่างไร]
```

**ตัวอย่าง:**
```
BR-001: ลดเวลาการ Approve คำขอลา
Priority: Must
Description: ระบบต้องช่วยให้ HR สามารถ Approve คำขอลาได้ภายใน 24 ชั่วโมง
Rationale: ปัจจุบันใช้เวลาเฉลี่ย 3-5 วัน ทำให้พนักงานวางแผนลำบาก
Success Metric: Average approval time < 24 ชั่วโมง ภายใน 3 เดือนหลัง launch
```

---

## Functional Requirement Format

```
FR-[MODULE]-[NNN]: [ชื่อ Requirement]
Priority: [Must / Should / Could / Won't]
Description: ระบบต้อง [action] เพื่อให้ [actor] สามารถ [outcome]
Input: [ข้อมูล input ที่ต้องการ]
Output: [ผลลัพธ์ที่คาดหวัง]
Business Rule: [กฎเกณฑ์ทางธุรกิจที่เกี่ยวข้อง]
Dependencies: [FR ที่ต้องทำก่อน]
```

**ตัวอย่าง:**
```
FR-AUTH-001: Login ด้วย Email และ Password
Priority: Must
Description: ระบบต้อง Authenticate ผู้ใช้ เพื่อให้ผู้ใช้ที่ลงทะเบียนแล้ว
             สามารถเข้าถึง Dashboard ส่วนตัวได้
Input: Email, Password
Output: JWT Token + Redirect to Dashboard
Business Rule:
  - Password ต้องมีอย่างน้อย 8 ตัวอักษร มีตัวพิมพ์ใหญ่และตัวเลข
  - Login ผิด 5 ครั้ง → Lock 15 นาที
  - Token หมดอายุใน 24 ชั่วโมง
Dependencies: FR-AUTH-000 (User Registration)
```

---

## Non-Functional Requirement Format

```
NFR-[NNN]: [Category] — [ชื่อ]
Category: [Performance / Security / Scalability / Availability / Usability / Compliance]
Requirement: [ค่า spec ที่วัดได้]
Rationale: [ทำไมถึงต้องการ spec นี้]
```

**ตัวอย่าง:**
```
NFR-001: Performance — Page Load Time
Requirement: หน้าแรกต้องโหลดภายใน 3 วินาที บน 3G connection
Rationale: ผู้ใช้ส่วนใหญ่อยู่ในพื้นที่ที่ Internet ไม่เสถียร

NFR-002: Security — Data Encryption
Requirement: ข้อมูลทั้งหมดต้อง Encrypted ด้วย AES-256 at rest และ TLS 1.3 in transit
Rationale: ระบบเก็บข้อมูลส่วนบุคคลของพนักงาน ต้องปฏิบัติตาม PDPA

NFR-003: Availability — Uptime
Requirement: System Uptime ≥ 99.5% (ยกเว้น Scheduled Maintenance)
Rationale: ใช้งาน Business Hours จันทร์-ศุกร์ downtime กระทบการทำงาน

NFR-004: Scalability — Concurrent Users
Requirement: รองรับ 500 Concurrent Users โดยไม่ degradation
Rationale: บริษัทมีพนักงาน 400 คน + growth 25% ต่อปี
```

---

## Checklist BRD ที่ดี

ก่อนส่ง BRD ให้ตรวจว่า:
- [ ] ทุก Requirement มี ID ที่ไม่ซ้ำ
- [ ] ทุก Requirement มี Priority ชัดเจน
- [ ] ไม่มี Requirement ที่วัดไม่ได้ (เช่น "ระบบต้องเร็ว" → ต้องระบุว่าเร็วแค่ไหน)
- [ ] ไม่มี Requirement ที่ขัดแย้งกัน
- [ ] ทุก FR มี Business Requirement รองรับ (traceability)
- [ ] Out of Scope ระบุชัดเจน
- [ ] Glossary ครอบคลุม Term ที่อาจตีความต่างกัน
