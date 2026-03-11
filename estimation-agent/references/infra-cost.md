# Infrastructure Cost Reference (2024-2025)

> ราคาเป็น USD/เดือน ถ้าไม่ระบุ
> แปลงเป็น THB: × 35 (ใช้ค่า Conservative)

---

## Cloud Server (Compute)

### AWS EC2

| Instance | vCPU | RAM | Use Case | $/month |
|----------|------|-----|----------|---------|
| t3.micro | 2 | 1GB | Dev/Test | $8 |
| t3.small | 2 | 2GB | Staging | $17 |
| t3.medium | 2 | 4GB | Small Prod | $33 |
| t3.large | 2 | 8GB | Mid Prod | $67 |
| t3.xlarge | 4 | 16GB | Large Prod | $134 |
| c5.xlarge | 4 | 8GB | CPU-intensive | $154 |

### GCP Compute Engine (เทียบเท่า)

| Instance | vCPU | RAM | $/month |
|----------|------|-----|---------|
| e2-micro | 2 | 1GB | $7 |
| e2-small | 2 | 2GB | $14 |
| e2-medium | 2 | 4GB | $27 |
| n1-standard-2 | 2 | 7.5GB | $49 |

---

## Database

### AWS RDS

| Engine | Instance | Storage | $/month |
|--------|----------|---------|---------|
| MySQL/PostgreSQL | db.t3.micro | 20GB | $15 |
| MySQL/PostgreSQL | db.t3.small | 20GB | $30 |
| MySQL/PostgreSQL | db.t3.medium | 50GB | $65 |
| MySQL/PostgreSQL | db.m5.large | 100GB | $150 |

### Managed Database Alternatives

| Service | Plan | $/month |
|---------|------|---------|
| PlanetScale (MySQL) | Hobby | Free |
| PlanetScale (MySQL) | Scaler | $29 |
| Supabase (PostgreSQL) | Free | Free |
| Supabase (PostgreSQL) | Pro | $25 |
| MongoDB Atlas | M10 | $57 |
| MongoDB Atlas | M30 | $189 |

---

## Storage

| Service | Price | Unit |
|---------|-------|------|
| AWS S3 | $0.023 | per GB/month |
| GCP Cloud Storage | $0.020 | per GB/month |
| Cloudflare R2 | $0.015 | per GB/month |
| Backblaze B2 | $0.006 | per GB/month |

**ตัวอย่าง**: 100GB S3 = $2.30/เดือน

---

## CDN

| Service | Price | Unit |
|---------|-------|------|
| AWS CloudFront | $0.085 | per GB transfer (Asia) |
| Cloudflare (Free) | $0 | First 100GB/month |
| Cloudflare Pro | $20/month | Unlimited |

---

## Container & Orchestration

| Service | Plan | $/month |
|---------|------|---------|
| AWS ECS (Fargate) | 0.5vCPU, 1GB RAM | ~$15 |
| GCP Cloud Run | Pay-per-request | ~$5-30 |
| Railway | Hobby | $5 |
| Render | Starter | $7 |
| Fly.io | Shared CPU | $5-10 |

---

## Monitoring & Observability

| Service | Plan | $/month |
|---------|------|---------|
| Sentry | Developer (Free) | $0 |
| Sentry | Team | $26 |
| Datadog | Infrastructure | $15/host |
| New Relic | Free (100GB) | $0 |
| Grafana Cloud | Free | $0 |
| UptimeRobot | Free | $0 |
| Better Uptime | Starter | $20 |

---

## Email Service

| Service | Free Tier | Paid |
|---------|-----------|------|
| AWS SES | 62,000 emails/month | $0.10/1000 |
| SendGrid | 100 emails/day | $19.95/month |
| Postmark | 100 emails/month | $15/month |
| Resend | 3,000 emails/month | $20/month |

---

## Other Services

| Service | $/month | หมายเหตุ |
|---------|---------|---------|
| Domain (.com) | ~$1 | ÷12 จาก $12/year |
| SSL (Let's Encrypt) | $0 | ฟรี |
| Cloudflare (Free) | $0 | DNS + Basic DDoS |
| GitHub | $0-$4/user | Actions minutes included |
| Vercel (Frontend) | $0-$20 | Hobby ฟรี |
| Netlify | $0-$19 | Starter ฟรี |

---

## Typical Infrastructure Budget ตามขนาดโปรเจกต์

| ขนาด | รายละเอียด | $/month | THB/month |
|------|-----------|---------|-----------|
| **MVP / Startup** | 1 Server + DB + Basic Monitor | $50-80 | 1,750-2,800 |
| **Small Product** | 2 Server + DB + CDN + Monitor | $150-250 | 5,250-8,750 |
| **Mid Product** | 3-4 Server + RDS + Cache + Full Monitor | $400-700 | 14,000-24,500 |
| **Large Product** | Multi-region + K8s + Full Stack | $1,000+ | 35,000+ |

---

## One-time Setup Costs

| Item | ค่าใช้จ่าย |
|------|-----------|
| Domain Registration (3 ปี) | ~$36 |
| SSL Wildcard (ถ้าต้องการ) | $70-$150/year |
| CI/CD Setup (ชั่วโมง DevOps) | ขึ้นกับ Rate |
| Initial Server Configuration | 4-8 ชั่วโมง DevOps |
