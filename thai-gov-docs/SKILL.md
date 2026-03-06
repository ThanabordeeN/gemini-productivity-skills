---
name: thai-gov-docs
description: สร้างและจัดการเอกสารราชการไทย (บันทึกข้อความ) ตามระเบียบสำนักนายกรัฐมนตรีโดยใช้ docxjs
---

# Thai Government Documents (บันทึกข้อความ)

Skill สำหรับสร้างเอกสารราชการไทย (บันทึกข้อความ) ให้ถูกต้องตามระเบียบงานสารบรรณ โดยใช้ Library `docx` (docxjs)

## 🎯 ความสามารถหลัก
- ตั้งค่าหน้ากระดาษ (Margins) และฟอนต์ (TH Sarabun New) ตามมาตรฐาน
- จัดวางตราครุฑและหัวข้อ "บันทึกข้อความ" ในตำแหน่งที่ถูกต้อง
- สร้างโครงสร้างส่วนราชการ, ที่, วันที่ และเรื่อง อย่างเป็นระเบียบ
- จัดการส่วนเนื้อหาและการย่อหน้า (Indent) ตามระเบียบ
- วางตำแหน่งส่วนลงนามให้เหมาะสม

## 📋 ระเบียบมาตรฐาน
ดูรายละเอียดระเบียบสารบรรณฉบับย่อได้ที่ [references/thai_gov_standards.md](references/thai_gov_standards.md)

## 🛠️ วิธีการใช้งาน (Workflow)

### 1. การสร้างบันทึกข้อความใหม่
เมื่อผู้ใช้ต้องการสร้างบันทึกข้อความ ให้ใช้สคริปต์ `scripts/generate_memo.cjs` เป็นต้นแบบ:
```javascript
// ตัวอย่างการเรียกใช้ฟังก์ชันแปลงหน่วย
const cmToTwip = (cm) => Math.round(cm * 566.9);
const ptToHalfPt = (pt) => pt * 2;
```

### 2. การตั้งค่าหน้ากระดาษ
```javascript
margin: {
    top: cmToTwip(2.5),
    bottom: cmToTwip(2.0),
    left: cmToTwip(3.0),
    right: cmToTwip(2.0)
}
```

### 3. การจัดการรูปภาพตราครุฑ
หากมีไฟล์ `krut.png` ใน `assets/` ให้แทรกโดยใช้ `ImageRun` แบบ `floating`

## ⚠️ ข้อควรระวัง
- **Fonts:** เครื่องที่เปิดไฟล์ต้องติดตั้งฟอนต์ **TH Sarabun New**
- **Units:** `docxjs` ใช้หน่วย TWIP (1 cm ≈ 567 TWIP) และ Half-points (16pt = 32)
