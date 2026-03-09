---
name: document-generator
description: Generate professional business documents (.docx) in Thai with TH Sarabun New font. Supports Quotations, Invoices, Billing Notes, Receipts, and Purchase Orders (PO). Use this skill whenever the user asks to create any of these business documents. It reads details from a JSON file and outputs a cleanly formatted docx.
---

# Document Generator

This skill generates professional business documents in .docx format, suitable for Thai businesses. It automatically calculates totals, VAT, and formats the document with corporate colors and "TH Sarabun New" font.

## Supported Document Types

You can specify the document type in the JSON under `document.type`. Supported types are:
- `QUOTATION` (ใบเสนอราคา) - Default
- `INVOICE` (ใบแจ้งหนี้)
- `BILLING_NOTE` (ใบวางบิล)
- `RECEIPT` (ใบเสร็จรับเงิน)
- `PURCHASE_ORDER` or `PO` (ใบสั่งซื้อ)
- `PURCHASE_REQUISITION` or `PR` (ใบขออนุมัติสั่งซื้อ)
- `PRICE_COMPARISON` (จดหมายเปรียบเทียบราคาซัพพลายเออร์)

## How to use

1. Read the user's request to understand the document details (type, company info, customer info, items, prices).
2. If the user hasn't provided all the details, you can use placeholder data or ask them for more info.
3. Create a JSON file in the user's current directory (e.g. `document-data.json`) using the format shown in `assets/document-template.json`. Be sure to set `document.type` correctly!
4. Ensure `docx` is installed in the workspace (`npm install docx`).
5. Run the generator script passing the JSON file path:
   `node <path_to_this_skill>/scripts/create-document.js document-data.json`
6. The script will generate a `.docx` file (default name `Document_Output.docx` or as specified in the JSON `settings.outputFileName`).

## JSON Data Structure

See `assets/document-template.json` for the exact schema. Make sure to fill out:
- `company`: The issuing company's details
- `customer`: The receiving customer's details (or vendor if PO)
- `document`: type, docNo, date, issuer, paymentTerms
- `items`: Array of items with `description`, `qty`, `price`
- `taxRate`: Number (e.g., 7 for 7% VAT)
- `notes`: Array of string notes
- `settings`: Color and font preferences.
