# Product Requirements Document (PRD)
## HPBS Product Knowledge Hub (PKH) + Admin CMS Backend

**Version:** 1.0  
**Date:** 2025-10-07  
**Status:** Approved for Development  
**Timeline:** 9 weeks  
**Root Directory:** `/workspace`

---

## 1. Executive Summary

### 1.1 Vision
Build a production-ready backend for HPBS Product Knowledge Hub (PKH) - a multilingual, AI-powered product education platform with Heygen avatar videos, searchable knowledge base, and AI voice assistant, managed via a comprehensive Admin CMS.

### 1.2 Objectives
- Enable HPBS customers to access product information in 6 languages
- Provide AI-driven assistance via Heygen avatar videos and voice assistant
- Empower HPBS admins to manage multilingual content efficiently
- Track user engagement and content effectiveness via analytics
- Deliver secure, scalable, performant backend infrastructure

### 1.3 Success Metrics
- **Performance:** P95 API response time < 200ms for list/search endpoints
- **Availability:** 99.9% uptime target
- **Engagement:** Track video views, KB searches, AI queries per user
- **Multilingual Adoption:** Content available in all 6 languages within 3 months post-launch
- **Admin Efficiency:** Content upload-to-publish time < 5 minutes

---

## 2. Stakeholders

| Role | Responsibility |
|------|----------------|
| **Product Owner** | Requirements, prioritization, acceptance |
| **Backend Team** | Nest.js API, database, integrations |
| **Frontend Team** | PKH web/mobile, Admin CMS web |
| **DevOps** | Infrastructure, CI/CD, monitoring |
| **QA** | Testing, UAT, performance validation |
| **HPBS Admins** | Content management, user support |
| **End Users (PKH)** | Product knowledge consumers |

---

## 3. Product Scope

### 3.1 In Scope

#### 3.1.1 PKH (Public-Facing)
- **Landing Page** with Privacy, Terms, Contact links
- **User Authentication** (signup, login, forgot password, profile)
- **Product Knowledge Videos** (Heygen avatar integration)
- **Knowledge Base** (PDFs, docs, images, FAQs) with search
- **AI Voice Assistant** (multilingual queries, contextual responses)
- **Multilingual UI** (English, Arabic, Bahasa, Malay, Thai, German)
- **Basic Progress Tracking** for video completion status

#### 3.1.2 Admin CMS (Web-Only)
- **Dashboard** with KPIs (active users, recent uploads, alerts)
- **User Management** (CRUD, language preferences, status control)
- **Knowledge Base Management** (upload PDFs/images, categorize, publish)
- **Video Management** (upload/Heygen links, metadata, publish)
- **AI Voice Configuration** (per-language intro messages, FAQs)
- **Analytics & Reporting** (most viewed, search trends, AI usage, CSV export)
- **Multilingual Tools** (default language per region, content translation tracking)
- **Settings** (T&C, Privacy, feature flags)

### 3.2 Out of Scope
- ❌ LMS features (courses, certifications, gradebooks)
- ❌ Employee onboarding workflows
- ❌ Quizzes and assessments (beyond simple video progress)
- ❌ Real-time chat or messaging
- ❌ E-commerce / payment processing
- ❌ Social features (comments, likes, shares)
- ❌ Native mobile app backend (web-responsive only)

---

## 4. User Personas

### 4.1 Public User (PKH)
**Name:** Maria, HPBS Product Customer  
**Goals:**
- Quickly find product manuals and guides in her language (Spanish/English)
- Watch short avatar-explained videos on product features
- Ask AI voice assistant specific questions
- Track her learning progress

**Pain Points:**
- Traditional manuals are too long and hard to navigate
- Needs instant answers, not browsing PDFs
- Prefers visual + audio learning over reading

---

### 4.2 HPBS Admin
**Name:** Ahmed, Content Manager  
**Goals:**
- Upload and publish multilingual product documentation efficiently
- Configure AI assistant responses per language
- Monitor which content is most viewed/searched
- Manage user accounts and preferences
- Export analytics for monthly reports

**Pain Points:**
- Manual content translation is time-consuming
- No visibility into content effectiveness
- Scattered tools for video, docs, and AI config

---

## 5. Functional Requirements

### 5.1 Authentication & Authorization

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| AUTH-1 | User signup with email, password, name, language preference | P0 | `POST /api/v1/auth/signup` |
| AUTH-2 | User login with email + password, returns JWT access + refresh tokens | P0 | `POST /api/v1/auth/login` |
| AUTH-3 | Forgot password sends email with reset token (1-hour expiry, single-use) | P0 | `POST /api/v1/auth/forgot-password` |
| AUTH-4 | Reset password via token | P0 | `POST /api/v1/auth/reset-password` |
| AUTH-5 | Refresh access token using refresh token (rotation on use) | P0 | `POST /api/v1/auth/refresh` |
| AUTH-6 | Logout invalidates refresh token | P1 | `POST /api/v1/auth/logout` |
| AUTH-7 | Role-based access control (PUBLIC_USER, ADMIN) | P0 | N/A (guards) |

**Security:**
- Passwords hashed with bcrypt (cost 12)
- JWT signed with RS256 (asymmetric keys)
- Access token: 15min expiry
- Refresh token: 7 days expiry

---

### 5.2 User Management

#### 5.2.1 Public User (Self-Service)

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| USER-1 | View own profile | P0 | `GET /api/v1/me` |
| USER-2 | Update profile (name, contact, address, password, default language) | P0 | `PATCH /api/v1/me` |
| USER-3 | Upload avatar image | P1 | `POST /api/v1/me/avatar` |

#### 5.2.2 Admin User Management

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| USER-4 | List all users with filters (status, language, search query) | P0 | `GET /api/v1/admin/users` |
| USER-5 | Create user manually (admin can set language, role) | P1 | `POST /api/v1/admin/users` |
| USER-6 | Edit user (language, status, reset password) | P0 | `PATCH /api/v1/admin/users/:id` |
| USER-7 | Deactivate/activate user (soft delete) | P1 | `DELETE /api/v1/admin/users/:id` |
| USER-8 | View user activity history (last login, content viewed) | P2 | `GET /api/v1/admin/users/:id/activity` |

---

### 5.3 Languages & Internationalization

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| LANG-1 | List active languages (code, name) | P0 | `GET /api/v1/languages` |
| LANG-2 | Admin list all languages (including inactive) | P1 | `GET /api/v1/admin/languages` |
| LANG-3 | Admin activate/deactivate language | P1 | `PATCH /api/v1/admin/languages/:code` |
| LANG-4 | Server negotiates language via Accept-Language header | P0 | N/A (middleware) |
| LANG-5 | User's default language stored in profile | P0 | DB field |

**Supported Languages:**
- `en` - English
- `ar` - Arabic
- `id` - Bahasa Indonesia
- `ms` - Malay
- `th` - Thai
- `de` - German

---

### 5.4 Knowledge Base (KB)

#### 5.4.1 Public KB Access

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| KB-1 | List KB items with filters (language, category, type, search query) | P0 | `GET /api/v1/kb` |
| KB-2 | View single KB item metadata | P0 | `GET /api/v1/kb/:id` |
| KB-3 | Download KB file (presigned URL, 1-hour expiry) | P0 | `GET /api/v1/kb/:id/download` |
| KB-4 | Search KB by keyword (full-text search on title, summary, extracted text) | P0 | Query param `?q=` |

#### 5.4.2 Admin KB Management

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| KB-5 | Upload KB item (metadata + presigned upload URL) | P0 | `POST /api/v1/admin/kb` |
| KB-6 | Confirm file upload (triggers ingestion job) | P0 | `PUT /api/v1/admin/kb/:id/file` |
| KB-7 | Update KB metadata (title, summary, tags, category) | P0 | `PATCH /api/v1/admin/kb/:id` |
| KB-8 | Publish/unpublish KB item | P0 | `POST /api/v1/admin/kb/:id/publish` |
| KB-9 | Delete KB item (soft delete) | P1 | `DELETE /api/v1/admin/kb/:id` |
| KB-10 | List KB with admin filters (unpublished, draft, all languages) | P0 | `GET /api/v1/admin/kb` |

**File Types:**
- `pdf` - Product manuals, guides
- `doc` - Text documents (converted to PDF)
- `image` - Diagrams, infographics
- `faq` - Text-based Q&A (no file)

**Ingestion Pipeline (Background Job):**
1. Virus scan (ClamAV)
2. PDF text extraction (pdftotext)
3. Generate thumbnail preview
4. Update search index
5. Mark as processed

---

### 5.5 Videos (Heygen Integration)

#### 5.5.1 Public Video Access

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| VID-1 | List videos with filters (language, category, search query) | P0 | `GET /api/v1/videos` |
| VID-2 | View single video metadata + stream URL | P0 | `GET /api/v1/videos/:id` |
| VID-3 | Track video progress (last second watched, completion status) | P1 | `POST /api/v1/videos/:id/progress` |

#### 5.5.2 Admin Video Management

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| VID-4 | Add video from Heygen (metadata: title, language, heygen_video_id) | P0 | `POST /api/v1/admin/videos` |
| VID-5 | Upload custom video (presigned URL flow) | P1 | `POST /api/v1/admin/videos/upload` |
| VID-6 | Update video metadata | P0 | `PATCH /api/v1/admin/videos/:id` |
| VID-7 | Publish/unpublish video | P0 | `POST /api/v1/admin/videos/:id/publish` |
| VID-8 | Delete video | P1 | `DELETE /api/v1/admin/videos/:id` |

**Heygen Integration:**
- Admin inputs Heygen video ID or URL
- Backend stores metadata (title, language, duration, thumbnail)
- Playback uses Heygen CDN (no re-encoding)
- Optional: Proxy Heygen API for programmatic video generation (future)

---

### 5.6 AI Voice Assistant

#### 5.6.1 Public AI Voice

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| AI-1 | Query AI voice with text input (returns text + optional audio URL) | P0 | `POST /api/v1/ai-voice/query` |
| AI-2 | Query AI voice with audio input (speech-to-text → response) | P1 | `POST /api/v1/ai-voice/query-audio` |
| AI-3 | AI responses enriched with PKH context (top KB items, FAQs) | P0 | Backend logic |

**Request:**
```json
{
  "language_code": "en",
  "text": "How do I reset my HPBS device?"
}
```

**Response:**
```json
{
  "reply_text": "To reset your device, press and hold...",
  "audio_url": "https://s3.../audio/response.mp3",
  "related_kb_items": [
    { "id": 123, "title": "Device Reset Guide" }
  ]
}
```

#### 5.6.2 Admin AI Voice Configuration

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| AI-4 | View AI voice settings per language | P0 | `GET /api/v1/admin/ai-voice/settings` |
| AI-5 | Update intro message per language | P0 | `PATCH /api/v1/admin/ai-voice/settings/:language_code` |
| AI-6 | Manage FAQ pool per language (Q&A pairs) | P0 | `PATCH /api/v1/admin/ai-voice/settings/:language_code/faqs` |
| AI-7 | View AI usage stats (queries per day, language breakdown) | P1 | `GET /api/v1/admin/ai-voice/analytics` |

**Integration:**
- Client-provided AI Voice API (vendor TBD)
- Backend acts as proxy: adds user context, logs queries, enforces rate limits
- Settings stored per language: intro, FAQs, vendor config

---

### 5.7 Analytics & Reporting

#### 5.7.1 Event Tracking (Public)

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| ANLY-1 | Track events (view_kb, play_video, search, ai_query) | P0 | `POST /api/v1/analytics/event` |
| ANLY-2 | Events include user_id (if logged in), session_id, language, metadata | P0 | Backend logic |

**Event Types:**
- `view_kb` - User views KB item
- `play_video` - User starts video
- `search` - User performs search (query logged)
- `ai_query` - User sends AI voice query
- `download_kb` - User downloads KB file

#### 5.7.2 Admin Analytics & Reports

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| ANLY-3 | Dashboard overview (active users today/week, recent uploads, alerts) | P0 | `GET /api/v1/admin/analytics/overview` |
| ANLY-4 | Most viewed KB items (date range, language filter) | P0 | `GET /api/v1/admin/analytics/top-kb` |
| ANLY-5 | Most viewed videos (date range, language filter) | P0 | `GET /api/v1/admin/analytics/top-videos` |
| ANLY-6 | Search trends (top queries, zero-result searches) | P1 | `GET /api/v1/admin/analytics/search-trends` |
| ANLY-7 | AI usage stats (queries per day, language breakdown) | P1 | `GET /api/v1/admin/analytics/ai-usage` |
| ANLY-8 | Export analytics to CSV/Excel (date range, language filter) | P0 | `GET /api/v1/admin/analytics/export.csv` |

**Aggregation:**
- Background job runs nightly to aggregate daily stats
- Materialized views for dashboard KPIs
- Raw events retained for 12 months, aggregates long-term

---

### 5.8 Settings & Configuration

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| SET-1 | Public settings (Privacy URL, T&C URL, Contact email) | P0 | `GET /api/v1/settings/public` |
| SET-2 | Admin manage settings (landing page links, feature flags) | P0 | `GET/PATCH /api/v1/admin/settings` |
| SET-3 | Feature flags (enable/disable AI voice, video progress tracking) | P1 | DB config |

---

### 5.9 Search

| ID | Requirement | Priority | Endpoint |
|----|-------------|----------|----------|
| SRCH-1 | Full-text search across KB and videos (title, summary, extracted text) | P0 | `GET /api/v1/search?q=&language=&type=` |
| SRCH-2 | Search results ranked by relevance (MySQL full-text score) | P0 | Backend logic |
| SRCH-3 | Pluggable search adapter (future: Elasticsearch) | P2 | Architecture |

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **API Response Time:** P95 < 200ms for list/search endpoints
- **File Upload:** Support 50MB PDFs, 10MB images
- **Video Streaming:** CDN-delivered, < 2s to first frame
- **AI Voice Query:** P95 < 2s response time
- **Concurrent Users:** Support 1000 concurrent users
- **Database:** Query optimization, indexing strategy

### 6.2 Scalability
- **Horizontal Scaling:** Stateless API servers behind load balancer
- **Database:** Connection pooling, read replicas (future)
- **Storage:** S3-compatible object storage, unlimited capacity
- **Queue:** BullMQ with Redis, auto-scaling workers

### 6.3 Availability
- **Uptime Target:** 99.9% (8.76 hours downtime/year)
- **Health Checks:** `/health` (liveness), `/health/ready` (readiness)
- **Graceful Degradation:** AI voice failures don't block KB/videos
- **Failover:** Multi-AZ database, S3 cross-region replication

### 6.4 Security
- **Authentication:** JWT RS256, bcrypt password hashing
- **Authorization:** RBAC (PUBLIC_USER, ADMIN), entity-level checks
- **Input Validation:** class-validator on all DTOs
- **Rate Limiting:** 100 req/min global, 10 req/min AI voice
- **CORS:** Whitelist PKH + Admin CMS origins
- **Secrets:** AWS Secrets Manager / Vault (production)
- **Audit Trail:** Log all admin write operations
- **Virus Scanning:** ClamAV on file uploads
- **Signed URLs:** Presigned S3 URLs with short expiry

### 6.5 Observability
- **Logging:** Pino (JSON format), structured logs
- **Tracing:** OpenTelemetry, Jaeger (dev), AWS X-Ray (prod)
- **Metrics:** Prometheus (request duration, error rate, queue length)
- **Monitoring:** Alerts on error rate > 1%, P95 latency > 500ms
- **Dashboards:** Grafana for ops, Admin CMS for business metrics

### 6.6 Data Integrity
- **Backups:** Nightly MySQL backups, retained 30 days
- **Migrations:** Version-controlled, tested before production
- **Soft Deletes:** Preserve user/content data on delete
- **Audit Trail:** Immutable logs of admin actions

### 6.7 Compliance
- **GDPR:** Right to access, rectify, delete user data
- **Data Retention:** Analytics raw 12 months, aggregates long-term
- **Privacy:** User passwords never logged, stored hashed only
- **Terms of Service:** Linked on PKH landing, required on signup

---

## 7. Technical Architecture

### 7.1 Technology Stack
- **Backend:** Nest.js (Node.js v20 LTS, TypeScript 5.x)
- **Database:** MySQL 8.0+ (TypeORM)
- **Cache:** Redis 7.x (caching + BullMQ)
- **Storage:** S3-compatible (AWS S3, MinIO)
- **Queue:** BullMQ
- **Email:** SMTP / SendGrid / SES
- **Observability:** Pino, OpenTelemetry, Prometheus
- **Security:** Helmet, CORS, bcrypt, JWT

### 7.2 Database Schema (Core Tables)

#### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | PRIMARY KEY |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| name | VARCHAR(255) | NOT NULL |
| role | ENUM('PUBLIC_USER','ADMIN') | DEFAULT 'PUBLIC_USER' |
| default_language | CHAR(2) | DEFAULT 'en' |
| status | ENUM('active','inactive') | DEFAULT 'active' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | ON UPDATE NOW() |

#### languages
| Column | Type | Constraints |
|--------|------|-------------|
| code | CHAR(2) | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| is_active | BOOLEAN | DEFAULT true |

#### knowledge_base_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | PRIMARY KEY |
| title | VARCHAR(500) | NOT NULL |
| type | ENUM('pdf','doc','image','faq') | NOT NULL |
| language_code | CHAR(2) | FK → languages.code |
| summary | TEXT | NULL |
| file_key | VARCHAR(500) | NULL (S3 key) |
| file_mime | VARCHAR(100) | NULL |
| bytes | BIGINT | NULL |
| checksum | VARCHAR(64) | NULL (SHA-256) |
| extracted_text | TEXT | NULL (for search) |
| is_published | BOOLEAN | DEFAULT false |
| published_at | TIMESTAMP | NULL |
| created_by | INT | FK → users.id |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | ON UPDATE NOW() |

**Indexes:**
- FULLTEXT(title, summary, extracted_text)
- INDEX(language_code, is_published)

#### videos
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | PRIMARY KEY |
| title | VARCHAR(500) | NOT NULL |
| language_code | CHAR(2) | FK → languages.code |
| source | ENUM('heygen','upload') | NOT NULL |
| heygen_video_id | VARCHAR(255) | NULL |
| file_key | VARCHAR(500) | NULL (S3 key if uploaded) |
| duration_sec | INT | NULL |
| thumbnail_url | VARCHAR(500) | NULL |
| is_published | BOOLEAN | DEFAULT false |
| published_at | TIMESTAMP | NULL |
| created_by | INT | FK → users.id |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | ON UPDATE NOW() |

#### ai_voice_settings
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | PRIMARY KEY |
| language_code | CHAR(2) | UNIQUE, FK → languages.code |
| intro_message | TEXT | NULL |
| faq_blob | JSON | NULL |
| vendor | VARCHAR(100) | NULL |
| api_endpoint | VARCHAR(500) | NULL |
| updated_by | INT | FK → users.id |
| updated_at | TIMESTAMP | ON UPDATE NOW() |

#### analytics_events
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT AUTO_INCREMENT | PRIMARY KEY |
| user_id | INT | NULL, FK → users.id |
| session_id | VARCHAR(100) | NULL |
| event | ENUM('view_kb','play_video','search','ai_query','download_kb') | NOT NULL |
| ref_type | ENUM('kb','video','none') | DEFAULT 'none' |
| ref_id | INT | NULL |
| language_code | CHAR(2) | NULL |
| meta | JSON | NULL |
| occurred_at | TIMESTAMP | DEFAULT NOW() |

**Indexes:**
- INDEX(event, occurred_at)
- INDEX(user_id, occurred_at)
- INDEX(language_code, occurred_at)

#### progress_tracking
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | PRIMARY KEY |
| user_id | INT | FK → users.id |
| content_type | ENUM('video','kb') | NOT NULL |
| content_id | INT | NOT NULL |
| status | ENUM('in_progress','completed') | DEFAULT 'in_progress' |
| last_second | INT | NULL (for videos) |
| updated_at | TIMESTAMP | ON UPDATE NOW() |

**Unique:** (user_id, content_type, content_id)

### 7.3 API Versioning
- All endpoints: `/api/v1/*`
- Breaking changes → `/api/v2/*`
- Maintain previous version for 6 months

### 7.4 Environment Configuration
- **Development:** `.env` file
- **Staging/Production:** AWS Secrets Manager / Vault
- **Required Vars:**
  - `DATABASE_URL`, `REDIS_URL`, `S3_ENDPOINT`, `S3_BUCKET`
  - `JWT_PUBLIC_KEY`, `JWT_PRIVATE_KEY`
  - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
  - `AI_VOICE_API_URL`, `AI_VOICE_API_KEY`

---

## 8. Integration Points

### 8.1 Heygen (Video Platform)
- **Integration Type:** Metadata import (video ID, title, thumbnail, CDN URL)
- **Authentication:** API key (admin-configurable)
- **Flow:** Admin inputs Heygen video ID → Backend fetches metadata → Stores in `videos` table
- **Future:** Programmatic video generation via Heygen API

### 8.2 AI Voice API (Client-Provided)
- **Integration Type:** REST API proxy
- **Authentication:** API key per language
- **Flow:** PKH user query → Backend enriches with KB context → Proxy to AI API → Return response
- **Rate Limiting:** 10 req/min per user
- **Timeout:** 5s max response time

### 8.3 Email Service (SMTP/SendGrid/SES)
- **Use Cases:** Password reset emails, admin notifications
- **Templates:** Handlebars (.hbs) templates
- **Languages:** All email templates multilingual

### 8.4 S3-Compatible Storage (AWS S3/MinIO)
- **Use Cases:** KB files, videos, user avatars, thumbnails
- **Authentication:** Access key + secret key
- **Presigned URLs:** Upload (5-min expiry), download (1-hour expiry)

### 8.5 ClamAV (Virus Scanning)
- **Use Cases:** Scan all uploaded files before processing
- **Deployment:** Docker container in same network
- **Action on Virus:** Quarantine file, alert admin, reject upload

---

## 9. User Flows

### 9.1 PKH User: Find Product Manual
1. User lands on PKH, selects language (Arabic)
2. User navigates to Knowledge Base
3. User searches "device reset"
4. System returns KB items + videos matching query (Arabic only)
5. User clicks PDF manual
6. System generates presigned download URL
7. User downloads PDF

### 9.2 PKH User: Ask AI Voice Question
1. User navigates to AI Voice Assistant
2. User types "How do I connect Bluetooth?" (English)
3. System proxies query to AI API with PKH context (top KB items)
4. AI returns text + audio response
5. System logs event (`ai_query`)
6. User plays audio, sees related KB items

### 9.3 Admin: Upload Multilingual Content
1. Admin logs into CMS
2. Admin navigates to KB Management
3. Admin clicks "Upload New"
4. Admin fills form: title, language (German), type (PDF), tags
5. Admin uploads PDF (presigned URL flow)
6. System triggers ingestion job (virus scan, text extraction, thumbnail)
7. Admin reviews extracted text
8. Admin clicks "Publish"
9. Content now visible to PKH users filtering German language

### 9.4 Admin: View Analytics
1. Admin navigates to Analytics Dashboard
2. Admin selects date range (last 30 days) and language (All)
3. Dashboard shows:
   - Active users: 1,245
   - Most viewed KB: "Quick Start Guide (EN)" - 3,421 views
   - Top search: "reset" - 567 queries
   - AI usage: 2,134 queries across 6 languages
4. Admin clicks "Export CSV"
5. System generates CSV with raw event data
6. Admin downloads for offline analysis

---

## 10. Testing Strategy

### 10.1 Unit Testing
- **Coverage Target:** 80%
- **Tools:** Jest, @nestjs/testing
- **Scope:** Services, guards, pipes, utilities
- **Mocks:** Database, S3, Redis, external APIs

### 10.2 E2E Testing
- **Tools:** Supertest, Jest
- **Scope:** Critical user flows
  - Auth: signup, login, refresh, password reset
  - KB: upload, list, search, download
  - Videos: list, filter, progress tracking
  - AI Voice: query proxy
  - Analytics: event ingest, CSV export
- **Environment:** Isolated test database, reset between tests

### 10.3 Load Testing
- **Tools:** k6, Artillery
- **Scenarios:**
  - 1000 concurrent users listing KB items
  - 500 concurrent search queries
  - 100 concurrent AI voice queries
- **Acceptance Criteria:**
  - P95 < 200ms for list/search
  - P95 < 2s for AI voice
  - Error rate < 0.1%

### 10.4 Security Testing
- **OWASP Top 10:** Penetration testing checklist
- **Tools:** OWASP ZAP, Burp Suite
- **Scope:** SQL injection, XSS, CSRF, JWT validation, rate limit bypass

### 10.5 UAT (User Acceptance Testing)
- **Participants:** 5 HPBS admins, 10 PKH users
- **Duration:** 2 weeks (Week 8-9)
- **Environment:** Staging with production-like data
- **Acceptance:** All P0/P1 features working, no P0 bugs

---

## 11. Deployment Architecture

### 11.1 Infrastructure (AWS Example)
- **Compute:** ECS Fargate (API containers)
- **Database:** RDS MySQL (Multi-AZ)
- **Cache/Queue:** ElastiCache Redis (cluster mode)
- **Storage:** S3 (versioned buckets)
- **CDN:** CloudFront (video streaming)
- **Secrets:** AWS Secrets Manager
- **Monitoring:** CloudWatch, Prometheus, Grafana

### 11.2 CI/CD Pipeline (GitHub Actions)
1. **On PR:** Lint → Test → Build → Migration dry-run
2. **On Merge to Main:** Deploy to staging → Run E2E tests
3. **Manual Approval:** Promote staging to production
4. **Rollback:** Revert to previous Docker image tag

### 11.3 Environments
- **Development:** Local (docker-compose)
- **Staging:** AWS (production-like, seeded data)
- **Production:** AWS (high availability, backups)

---

## 12. Data Migration & Seeding

### 12.1 Initial Data
- **Languages:** Insert 6 supported languages (en, ar, id, ms, th, de)
- **Admin User:** Seed admin account (email: `admin@hpbs.com`, password: temp)
- **Settings:** Default Privacy/T&C URLs
- **AI Settings:** Default intro messages per language

### 12.2 Migration Strategy
- TypeORM migrations version-controlled
- Rollback plan for every migration
- Dry-run on staging before production

---

## 13. Milestones & Timeline (9 Weeks)

| Week | Milestone | Deliverables |
|------|-----------|--------------|
| **W1** | Foundation | Scaffolding, Auth, Users, Languages, Settings modules |
| **W2** | Content (KB) | Storage service, KB upload/ingestion, search |
| **W3** | Content (Videos) | Video model, Heygen integration, streaming |
| **W4** | AI Integration | AI Voice proxy, settings, context enrichment |
| **W5** | Analytics | Event tracking, admin dashboards (basic) |
| **W6** | Admin Tooling | User/content CRUD, multilingual tools |
| **W7** | Reports & Tracking | CSV exports, progress tracking, profile |
| **W8** | Hardening | Rate limits, AV scan, audit trail, E2E tests |
| **W9** | UAT & Launch | Staging UAT, bug fixes, go-live checklist |

---

## 14. Success Criteria

### 14.1 Launch Readiness Checklist
- [ ] All P0 features implemented and tested
- [ ] E2E test suite passing (>95% pass rate)
- [ ] Load test passing (P95 < 200ms)
- [ ] Security audit completed (no critical findings)
- [ ] Database migrations tested on staging
- [ ] CI/CD pipeline operational
- [ ] Monitoring dashboards configured
- [ ] Backup/restore tested
- [ ] UAT sign-off from stakeholders
- [ ] Rollback plan documented

### 14.2 Post-Launch Metrics (30 days)
- **Performance:** P95 < 200ms maintained
- **Availability:** 99.9% uptime achieved
- **Engagement:** 500+ active users, 2000+ KB views, 1000+ AI queries
- **Content:** 50+ KB items, 20+ videos across 6 languages
- **Zero P0 bugs** in production

---

## 15. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Heygen API changes** | High | Medium | Abstract integration, version API calls |
| **AI Voice API downtime** | Medium | Low | Graceful degradation, cache recent responses |
| **Large file uploads timeout** | Medium | Medium | Presigned URLs (direct S3), increase timeout |
| **Multilingual content gaps** | High | High | Seed initial content per language, translation service |
| **Performance under load** | High | Medium | Load testing, caching, CDN, horizontal scaling |
| **Security breach** | Critical | Low | Security audit, penetration testing, WAF |

---

## 16. Open Questions

1. **AI Voice Vendor:** Which provider? (Impact: integration timeline)
2. **Heygen API Access:** Do we have API credentials? (Impact: programmatic video generation)
3. **Email Service:** SMTP, SendGrid, or SES? (Impact: cost, deliverability)
4. **Hosting:** AWS, DigitalOcean, or on-prem? (Impact: infra setup)
5. **Translation Service:** Manual or automated (Google Translate API)? (Impact: content velocity)

---

## 17. Approval & Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | _______________ | _______________ | _______ |
| Tech Lead | _______________ | _______________ | _______ |
| DevOps Lead | _______________ | _______________ | _______ |
| QA Lead | _______________ | _______________ | _______ |

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-07  
**Next Review:** Weekly during development  
**Contact:** Product Team (product@hpbs.com)