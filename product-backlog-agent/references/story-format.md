# User Story Format Reference

## Standard Template

```
### User Story [EPIC-ID]-[FEAT-ID]-[STORY-NUM]: [Story Title]

**As a** [type of user / role]
**I want to** [perform some action]
**So that** [achieve some goal / benefit]

**Acceptance Criteria:**
- [ ] Given [initial context], When [action taken], Then [expected outcome]
- [ ] Given [initial context], When [action taken], Then [expected outcome]
- [ ] ...

**Story Points:** [1 / 2 / 3 / 5 / 8 / 13]
**Priority:** [Must Have / Should Have / Could Have / Won't Have]
**Dependencies:** [Story ID] or None
**Notes:** [ข้อมูลเพิ่มเติม หรือ edge cases]
```

---

## Story Point Reference (Fibonacci)

| Points | ความหมาย | ตัวอย่าง |
|--------|---------|---------|
| 1 | งานง่ายมาก < 2 ชม. | เปลี่ยนสี Button, แก้ Label |
| 2 | งานเล็ก 2-4 ชม. | สร้าง Form ง่าย ๆ |
| 3 | งานปานกลาง 4-8 ชม. | CRUD API 1 Resource |
| 5 | งานใหญ่ 1-2 วัน | Login + JWT + Refresh Token |
| 8 | งานซับซ้อน 2-3 วัน | ระบบ Payment Integration |
| 13 | งานใหญ่มาก 3-5 วัน | ควรแตกออกเป็น Stories ย่อย |

> **กฎ**: Story ที่มี > 8 points ควรแตกเป็น Stories ย่อยก่อนเสมอ

---

## ตัวอย่าง User Story ที่ดี

### ตัวอย่าง 1: ระบบ Authentication

**Epic:** Authentication  
**Feature:** Login

---

**User Story AUTH-001: Login ด้วย Email และ Password**

**As a** registered user  
**I want to** login with my email and password  
**So that** I can access my personal dashboard and data

**Acceptance Criteria:**
- [ ] Given valid email and password, When I click Login, Then I am redirected to Dashboard
- [ ] Given invalid password, When I click Login, Then I see "Email หรือ Password ไม่ถูกต้อง"
- [ ] Given 5 failed attempts, When I try again, Then account is locked for 15 minutes
- [ ] Given successful login, Then a JWT token is stored in httpOnly cookie

**Story Points:** 5  
**Priority:** Must Have  
**Dependencies:** None

---

### ตัวอย่าง 2: ระบบจัดการสินค้า

**Epic:** Product Management  
**Feature:** Product Listing

---

**User Story PROD-001: ดูรายการสินค้าทั้งหมด**

**As a** customer  
**I want to** browse all available products with filtering and sorting  
**So that** I can find products that match my needs quickly

**Acceptance Criteria:**
- [ ] Given I'm on product page, Then I see grid of products with image, name, price
- [ ] Given I select category filter, Then list updates to show only that category
- [ ] Given I click Sort by Price, Then products sort low-to-high by default
- [ ] Given no products in category, Then I see "ไม่พบสินค้าในหมวดนี้"
- [ ] Given slow connection, Then skeleton loading placeholder shows

**Story Points:** 3  
**Priority:** Must Have  
**Dependencies:** PROD-BE-001 (Product API)

---

## Epic Document Structure

```
[Project Name] — User Stories
Version: 1.0 | Date: [date] | Author: [name]

Table of Contents
1. Epic: [Name] ........... page X
2. Epic: [Name] ........... page X
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EPIC 1: [EPIC NAME]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overview: [2-3 บรรทัดอธิบาย Epic นี้]
Goal: [เป้าหมายของ Epic]
Total Stories: X | Total Points: Y

Feature 1.1: [Feature Name]
  Story 1.1.1: ...
  Story 1.1.2: ...

Feature 1.2: [Feature Name]
  ...
```
