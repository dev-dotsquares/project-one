# HPBS PKH Backend - Development Rules & Guidelines

## Project Context

**Root Directory:** `/workspace`  
**Project:** HPBS Product Knowledge Hub (PKH) + Admin CMS Backend  
**Framework:** Nest.js with TypeScript  
**Database:** MySQL with TypeORM  
**Timeline:** 9 weeks development cycle

---

## Core Principles

### 1. Architecture Constraints

- **Framework:** Nest.js (Express adapter) - NO deviations
- **ORM:** TypeORM exclusively - migrations via TypeORM CLI
- **Database:** MySQL 8.0+ - no NoSQL unless explicitly approved for caching
- **Node Version:** LTS (v20.x recommended)
- **TypeScript:** Strict mode enabled

### 2. Module Boundaries

Each module MUST be self-contained with clear responsibilities:

```
src/
├── modules/
│   ├── auth/          # Authentication & authorization only
│   ├── users/         # User management (public + admin)
│   ├── kb/            # Knowledge Base (documents, PDFs, FAQs)
│   ├── videos/        # Video management (Heygen integration)
│   ├── ai-voice/      # AI Voice assistant proxy
│   ├── analytics/     # Event tracking & reporting
│   ├── languages/     # i18n & language management
│   ├── settings/      # App configuration & feature flags
│   ├── admin/         # Admin dashboard aggregations
│   └── search/        # Full-text search abstraction
├── common/
│   ├── guards/        # Auth, role, permission guards
│   ├── decorators/    # Custom decorators
│   ├── filters/       # Exception filters
│   ├── interceptors/  # Logging, transform, cache
│   ├── pipes/         # Validation pipes
│   └── middleware/    # CORS, helmet, rate-limit
├── infra/
│   ├── storage/       # S3-compatible storage service
│   ├── queue/         # BullMQ job processors
│   ├── mail/          # Email service (password reset)
│   ├── cache/         # Redis cache wrapper
│   └── observability/ # Pino, OpenTelemetry, Prometheus
└── database/
    ├── entities/      # TypeORM entities
    ├── migrations/    # Version-controlled migrations
    └── seeders/       # Test data for staging
```

### 3. API Design Standards

#### Versioning
- **Base Path:** `/api/v1`
- All endpoints MUST be versioned
- Breaking changes require new version (`/api/v2`)

#### Response Format
```typescript
// Success (200, 201)
{
  "data": { ... },
  "meta": { "total": 100, "page": 1, "limit": 20 } // for paginated
}

// Error (4xx, 5xx)
{
  "error": {
    "code": "KB_ITEM_NOT_FOUND",
    "message": "Knowledge base item not found",
    "details": { "itemId": 123 }
  }
}
```

#### Authentication
- **Public endpoints:** `/api/v1/auth/*`, `/api/v1/settings/public`, `/api/v1/languages`
- **User endpoints:** Require valid JWT (role: PUBLIC_USER or ADMIN)
- **Admin endpoints:** `/api/v1/admin/*` - Require role: ADMIN

#### Pagination
- Query params: `?page=1&limit=20` (default: page=1, limit=20, max=100)
- Response includes `meta.total`, `meta.page`, `meta.limit`

#### Filtering & Search
- Query params: `?language=en&category=manuals&q=search+term`
- Boolean filters: `?is_published=true`
- Date ranges: `?from=2025-01-01&to=2025-12-31`

### 4. Security Rules (NON-NEGOTIABLE)

#### Authentication
- **Password Hashing:** bcrypt with cost factor 12
- **JWT:** RS256 algorithm (asymmetric keys)
- **Access Token:** 15 minutes expiry
- **Refresh Token:** 7 days expiry, rotation on refresh
- **Password Reset:** Signed token via email, 1-hour expiry, single-use

#### Authorization (RBAC)
- Roles: `PUBLIC_USER`, `ADMIN`
- Route-level guards: `@UseGuards(JwtAuthGuard, RoleGuard)`
- Entity-level checks: Users can only modify their own data unless ADMIN

#### Input Validation
- All DTOs use `class-validator` decorators
- File uploads: whitelist MIME types, size limits (PDF: 50MB, images: 10MB)
- Sanitize all user input before storage

#### Rate Limiting
- Global: 100 req/min per IP
- Auth endpoints: 5 req/min per IP
- AI Voice: 10 req/min per user
- Admin: 200 req/min per user

#### CORS
- PKH Frontend: `https://pkh.hpbs.com`
- Admin CMS: `https://admin.hpbs.com`
- Local dev: `http://localhost:3000`, `http://localhost:3001`

#### Secrets Management
- Development: `.env` file (git-ignored)
- Production: AWS Secrets Manager / HashiCorp Vault
- Never commit API keys, database credentials, or JWT secrets

#### Content Security
- **Virus Scanning:** ClamAV on all file uploads
- **PDF Sanitization:** Strip embedded scripts
- **Signed URLs:** Presigned S3 URLs with 5-minute expiry for uploads, 1-hour for downloads

#### Audit Trail
- Log all admin write operations: `{ userId, action, entityType, entityId, changes, timestamp }`
- Store in `audit_logs` table, export monthly

### 5. Database Rules

#### Naming Conventions
- Tables: `snake_case` (e.g., `knowledge_base_items`)
- Columns: `snake_case` (e.g., `language_code`)
- Indexes: `idx_<table>_<column>` (e.g., `idx_users_email`)
- Foreign keys: `fk_<table>_<referenced_table>` (e.g., `fk_videos_users`)

#### Migration Discipline
- **NEVER** edit existing migrations after merge to main
- **ALWAYS** run migrations via CLI: `npm run migration:run`
- **ALWAYS** generate migrations: `npm run migration:generate -- -n MigrationName`
- Include rollback logic in every migration
- Test migrations on staging before production

#### Schema Standards
- All tables have `id` (UUID or auto-increment primary key)
- All tables have `created_at`, `updated_at` (timestamps)
- Soft deletes: `deleted_at` column where applicable
- Language references: `language_code` (char(2), e.g., 'en', 'ar')
- Enums: stored as VARCHAR with CHECK constraints

#### Indexing Strategy
- Primary key on `id`
- Unique index on `users.email`, `languages.code`
- Full-text index on `knowledge_base_items(title, summary)`, `videos(title)`
- Composite indexes for common queries: `(language_code, is_published)`

### 6. Multilingual (i18n) Rules

#### Language Codes (ISO 639-1)
- English: `en`
- Arabic: `ar`
- Bahasa Indonesia: `id`
- Malay: `ms`
- Thai: `th`
- German: `de`

#### Content Storage
- ALL user-facing content (KB items, videos, AI settings) MUST have `language_code` column
- Translations are separate records, NOT JSON blobs
- Query pattern: `WHERE language_code = :code AND is_published = true`

#### Language Negotiation
- Middleware reads `Accept-Language` header
- Falls back to user's `default_language` from profile
- System default: `en`

#### Server-Side Messages
- Use `nestjs-i18n` for error messages, validation messages
- Message catalogs: `src/i18n/[locale].json`
- Example: `t('errors.KB_ITEM_NOT_FOUND', { lang: 'en' })`

### 7. File Storage Rules

#### Storage Provider
- S3-compatible API (AWS S3, MinIO, DigitalOcean Spaces)
- Environment-based configuration: `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`

#### Upload Flow (Presigned URLs)
1. Client requests upload URL: `POST /api/v1/admin/kb`
2. Server validates, generates presigned PUT URL (5-min expiry)
3. Client uploads directly to S3
4. Client confirms: `PUT /api/v1/admin/kb/:id/file`
5. Server triggers ingestion job

#### File Keys (Paths)
```
kb/{language_code}/{year}/{month}/{uuid}.{ext}
videos/{language_code}/{year}/{month}/{uuid}.{ext}
avatars/users/{userId}.{ext}
```

#### Download Flow
- Public content: presigned GET URL (1-hour expiry)
- Private content: check user authorization, then presigned URL

### 8. Background Jobs (BullMQ)

#### Queue Names
- `ingestion` - File processing (virus scan, text extraction, thumbnails)
- `analytics` - Event aggregation (nightly job)
- `email` - Transactional emails (password reset, notifications)

#### Job Retry Strategy
- Default: 3 retries with exponential backoff
- Permanent failures: log to `failed_jobs` table

#### Job Processors
```typescript
@Processor('ingestion')
export class IngestionProcessor {
  @Process('process-pdf')
  async processPDF(job: Job<{ kbItemId: number }>) {
    // 1. Virus scan
    // 2. Extract text (pdftotext)
    // 3. Generate thumbnail
    // 4. Update search index
    // 5. Mark as processed
  }
}
```

### 9. Testing Requirements

#### Unit Tests
- Target: 80% code coverage
- Mock all external dependencies (DB, S3, Redis, external APIs)
- Test file naming: `*.spec.ts` (alongside source)

#### E2E Tests
- Critical flows MUST have E2E tests:
  - Auth: signup, login, refresh, password reset
  - KB: upload, list, search, download
  - Videos: list, filter by language
  - AI Voice: query proxy
  - Analytics: event ingest, export CSV
- Test database: separate MySQL container, reset between tests

#### Load Testing
- Tools: k6 or Artillery
- Targets:
  - List endpoints: 1000 req/s, P95 < 200ms
  - Search: 500 req/s, P95 < 300ms
  - AI Voice proxy: 100 req/s, P95 < 2s

### 10. Observability Rules

#### Logging (Pino)
- Format: JSON
- Levels: `error`, `warn`, `info`, `debug`
- Include: `requestId`, `userId`, `timestamp`, `context`
- Rotate logs daily, retain 30 days

#### Tracing (OpenTelemetry)
- Trace all HTTP requests
- Trace database queries (slow query threshold: 500ms)
- Trace external API calls (Heygen, AI Voice)
- Export to Jaeger (dev/staging) or AWS X-Ray (production)

#### Metrics (Prometheus)
- HTTP request duration histogram
- Active connections gauge
- Queue job processing time
- S3 upload/download latency
- Error rate counter

#### Health Checks
- `/health` - Simple liveness check (200 OK)
- `/health/ready` - Readiness check (DB, Redis, S3 connectivity)

### 11. Error Handling Standards

#### Exception Filters
```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    
    response.status(status).json({
      error: {
        code: exception.message,
        message: this.i18n.t(`errors.${exception.message}`),
        timestamp: new Date().toISOString()
      }
    });
  }
}
```

#### Custom Exceptions
```typescript
export class KBItemNotFoundException extends NotFoundException {
  constructor(itemId: number) {
    super('KB_ITEM_NOT_FOUND');
  }
}
```

### 12. Code Quality Standards

#### Linting & Formatting
- **ESLint:** `@typescript-eslint/recommended`
- **Prettier:** 2-space indent, single quotes, trailing commas
- Pre-commit hooks: lint + format
- CI fails on lint errors

#### TypeScript Standards
- **Strict mode:** enabled
- **No `any`:** Use `unknown` or proper types
- **Interfaces over types:** for DTOs and entities
- **Enums:** Use string enums for readability

#### Git Workflow
- **Branch naming:** `feature/<feature-name>`, `fix/<bug-name>`
- **Commit messages:** Conventional Commits format
  - `feat: add KB upload endpoint`
  - `fix: resolve JWT refresh token rotation`
  - `docs: update API documentation`
- **Pull requests:** Require 1 approval, all CI checks pass

### 13. Performance Rules

#### Caching Strategy
- **Redis:** Cache expensive queries (list, search results)
- **TTL:** 5 minutes for dynamic lists, 1 hour for static settings
- **Invalidation:** On write operations (create, update, delete)

#### Database Optimization
- Use eager/lazy loading appropriately (avoid N+1)
- Paginate all list queries
- Use `SELECT` specific columns, avoid `SELECT *`
- Index foreign keys and frequently queried columns

#### CDN for Static Assets
- Serve videos, PDFs, images via CDN
- CloudFront (AWS) or equivalent
- Cache headers: `Cache-Control: public, max-age=31536000` for immutable files

### 14. DevOps Rules

#### Docker
- **Base image:** `node:20-alpine`
- **Multi-stage builds:** Build → Production (minimal image)
- **docker-compose.yml:** Includes API, MySQL, Redis, MinIO, ClamAV

#### CI/CD (GitHub Actions)
- **On PR:** Lint, test, build, migration dry-run
- **On merge to main:** Deploy to staging
- **Manual:** Promote staging to production
- **Rollback:** Keep last 3 container images

#### Environment Variables
- `.env.example` - Template with dummy values
- `.env` - Git-ignored, local development
- Staging/Production: Injected via CI/CD secrets

### 15. Scope Boundaries (What NOT to Build)

❌ **Out of Scope:**
- LMS features (courses, certifications)
- Employee onboarding modules
- Quizzes and assessments (except basic video progress tracking)
- Real-time chat or messaging
- Mobile app backend (web-only for MVP)
- E-commerce / payments
- Social features (comments, likes, sharing)

✅ **In Scope:**
- Product Knowledge Hub (public)
- Admin CMS (web)
- Heygen video integration
- Knowledge Base (PDFs, docs, FAQs)
- Multilingual AI Voice assistant
- Basic analytics & reporting
- User profiles & preferences
- RBAC (PUBLIC_USER, ADMIN)

---

## Development Checklist

Before marking a module complete:

- [ ] All DTOs have validation decorators
- [ ] All endpoints have auth guards
- [ ] All database queries are indexed
- [ ] Unit tests written (80% coverage)
- [ ] E2E tests for critical paths
- [ ] API documentation updated (Swagger)
- [ ] Error messages internationalized
- [ ] Logging and tracing instrumented
- [ ] Rate limits configured
- [ ] RBAC permissions verified
- [ ] Migration tested on clean database
- [ ] Code reviewed by peer
- [ ] Merged to main after CI passes

---

## Quick Reference Commands

```bash
# Development
npm run start:dev          # Start with hot-reload
npm run migration:generate -- -n MigrationName
npm run migration:run
npm run migration:revert

# Testing
npm run test               # Unit tests
npm run test:e2e           # E2E tests
npm run test:cov           # Coverage report

# Linting
npm run lint               # Check
npm run lint:fix           # Auto-fix

# Build
npm run build              # Production build
npm run start:prod         # Run production build

# Docker
docker-compose up -d       # Start all services
docker-compose logs -f api # View API logs
docker-compose down        # Stop all services
```

---

**Last Updated:** 2025-10-07  
**Maintained By:** Development Team  
**Review Cycle:** Weekly during development, monthly post-launch