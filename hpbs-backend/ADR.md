# Architecture Decision Record (ADR)
## HPBS Product Knowledge Hub (PKH) + Admin CMS Backend

**Status:** Approved  
**Date:** 2025-10-07  
**Decision Makers:** Tech Lead, Backend Team, DevOps  
**Root Directory:** `/workspace`

---

## Context

HPBS requires a production-ready backend to power:
1. **PKH (Public):** Multilingual product knowledge platform with Heygen videos, searchable KB, and AI voice assistant
2. **Admin CMS:** Content management, user management, AI configuration, and analytics

**Key Requirements:**
- 6 languages (EN, AR, Bahasa, Malay, Thai, German)
- Heygen avatar video integration
- AI voice assistant (client-provided API)
- Secure, scalable, performant (P95 < 200ms)
- 9-week development timeline

---

## Decision Summary

| Domain | Decision | Alternatives Considered |
|--------|----------|-------------------------|
| **Backend Framework** | Nest.js (Express) | Fastify, Koa, raw Express |
| **Language** | TypeScript (strict) | JavaScript, Python (FastAPI) |
| **Database** | MySQL 8.0+ | PostgreSQL, MongoDB |
| **ORM** | TypeORM | Prisma, Sequelize, Knex |
| **Authentication** | JWT (RS256) + bcrypt | Passport.js (OAuth), Auth0 |
| **Authorization** | RBAC (guards) | ABAC, CASL |
| **Caching** | Redis 7.x | Memcached, in-memory |
| **Queue** | BullMQ (Redis) | RabbitMQ, AWS SQS |
| **Storage** | S3-compatible | Local filesystem, GridFS |
| **Search** | MySQL full-text | Elasticsearch, Algolia |
| **Logging** | Pino (JSON) | Winston, Bunyan |
| **Tracing** | OpenTelemetry | Zipkin, Jaeger (standalone) |
| **Metrics** | Prometheus | Datadog, New Relic |
| **Email** | SMTP/SendGrid/SES | Mailgun, Postmark |
| **Containerization** | Docker + Compose | Kubernetes (overkill for MVP) |
| **CI/CD** | GitHub Actions | GitLab CI, CircleCI |

---

## ADR-001: Nest.js as Backend Framework

### Status: ✅ Accepted

### Context
- Need rapid development with strong TypeScript support
- Team familiar with Node.js ecosystem
- Require modular, testable architecture
- Client specified Node.js

### Decision
Use **Nest.js** (Express adapter) as the backend framework.

### Rationale
**Pros:**
- First-class TypeScript support with decorators
- Dependency injection (IoC) for testability
- Modular architecture aligns with domain boundaries
- Rich ecosystem (TypeORM, Bull, Passport, Swagger)
- Built-in support for pipes, guards, interceptors
- Active community, excellent documentation
- Faster development vs raw Express (9-week timeline)

**Cons:**
- Slightly higher learning curve than Express
- Opinionated structure (but aids consistency)

**Alternatives:**
- **Fastify:** Faster performance, but less mature ecosystem for our use case
- **Raw Express:** More control, but requires more boilerplate (time constraint)
- **Python (FastAPI):** Not Node.js per client requirement

### Consequences
- Team must learn Nest.js conventions (1 week ramp-up)
- Standardized module structure across codebase
- Easier testing with dependency injection
- Swagger auto-generation from decorators

---

## ADR-002: MySQL as Primary Database

### Status: ✅ Accepted

### Context
- Structured data (users, KB items, videos, analytics)
- Need ACID compliance, relational integrity
- Client specified MySQL
- Team has MySQL expertise

### Decision
Use **MySQL 8.0+** as the primary database.

### Rationale
**Pros:**
- Mature, battle-tested RDBMS
- Strong full-text search support (MATCH() with InnoDB)
- JSON column support for flexible metadata
- TypeORM has excellent MySQL support
- Cost-effective (RDS, managed services)
- Team expertise reduces risk

**Cons:**
- Full-text search not as powerful as Elasticsearch (acceptable for MVP)
- Scaling writes requires sharding (not needed initially)

**Alternatives:**
- **PostgreSQL:** Better full-text search (tsvector), but client specified MySQL
- **MongoDB:** NoSQL flexibility, but lacks relational integrity for this use case

### Consequences
- Schema migrations via TypeORM CLI
- Index strategy critical for performance (full-text, foreign keys)
- Future: Consider read replicas for scaling

---

## ADR-003: TypeORM as ORM

### Status: ✅ Accepted

### Context
- Need type-safe database access
- Migration management required
- Nest.js has first-class TypeORM integration

### Decision
Use **TypeORM** as the ORM layer.

### Rationale
**Pros:**
- TypeScript decorators for entities
- Migration generation and execution
- Repository pattern fits Nest.js services
- Active Record and Data Mapper patterns
- Supports MySQL, PostgreSQL, SQLite (flexibility)
- Query builder for complex queries

**Cons:**
- Migration API less polished than Prisma
- Performance overhead vs raw SQL (mitigated by caching)

**Alternatives:**
- **Prisma:** Better DX, but migrations less flexible, newer to Nest.js ecosystem
- **Sequelize:** Mature, but JavaScript-first (weaker TypeScript support)
- **Knex:** More control, but no entity decorators

### Consequences
- Entities defined with `@Entity()`, `@Column()` decorators
- Migrations run via `npm run migration:run`
- Repository injection: `@InjectRepository(User)`
- Team must learn TypeORM query builder for complex queries

---

## ADR-004: JWT (RS256) for Authentication

### Status: ✅ Accepted

### Context
- Stateless authentication required (horizontal scaling)
- Access + refresh token pattern
- Need asymmetric keys for security

### Decision
Use **JWT with RS256** (RSA signatures) for authentication.

### Rationale
**Pros:**
- Stateless (no session storage)
- RS256 prevents token forgery (private key server-side, public key for verification)
- Refresh token rotation enhances security
- Standard, interoperable (RFC 7519)

**Cons:**
- Token revocation requires blacklist (Redis)
- Larger token size vs HS256 (acceptable overhead)

**Alternatives:**
- **HS256 (symmetric):** Simpler, but less secure (shared secret)
- **OAuth 2.0 (Auth0, Keycloak):** Overkill for MVP, adds external dependency
- **Session-based:** Requires sticky sessions, doesn't scale horizontally

### Consequences
- Generate RSA key pair (4096-bit) for production
- Access token: 15-min expiry (claims: userId, role)
- Refresh token: 7-day expiry, stored hashed in DB, rotation on use
- Logout: blacklist refresh token in Redis

---

## ADR-005: RBAC with Role Guards

### Status: ✅ Accepted

### Context
- Two user roles: PUBLIC_USER, ADMIN
- Admin endpoints require strict access control
- Entity-level permissions (users can only modify own data)

### Decision
Implement **Role-Based Access Control (RBAC)** using Nest.js guards.

### Rationale
**Pros:**
- Simple role model fits requirements (no complex permissions matrix)
- Guards declarative: `@UseGuards(JwtAuthGuard, RoleGuard)`
- Easily testable
- Performance: role check in-memory (from JWT claims)

**Cons:**
- Less flexible than ABAC (Attribute-Based Access Control)
- Future: Fine-grained permissions require CASL or similar

**Alternatives:**
- **ABAC (CASL):** More flexible, but adds complexity for simple role model
- **Custom middleware:** Less idiomatic, harder to test

### Consequences
- Role stored in JWT claims: `{ userId: 123, role: 'ADMIN' }`
- Route guards: `@Roles('ADMIN')` decorator + RoleGuard
- Entity-level checks in services: `if (user.id !== resource.ownerId && user.role !== 'ADMIN') throw Forbidden`

---

## ADR-006: Redis for Caching and Queues

### Status: ✅ Accepted

### Context
- Need caching for expensive queries (list, search)
- Background jobs for file processing, analytics
- Horizontal scaling requires distributed cache

### Decision
Use **Redis 7.x** for both caching and BullMQ queues.

### Rationale
**Pros:**
- Single dependency for cache + queue (operational simplicity)
- BullMQ (Bull v4) leverages Redis for job persistence
- Fast in-memory cache (P95 < 1ms latency)
- Supports TTL, LRU eviction
- Cluster mode for high availability

**Cons:**
- Single point of failure (mitigated by Redis Cluster / ElastiCache)
- Memory-bound (requires sizing, eviction policies)

**Alternatives:**
- **Memcached:** No persistence (bad for queues), less feature-rich
- **RabbitMQ (queue):** Separate dependency, more complex setup
- **In-memory cache:** Doesn't share across instances

### Consequences
- Cache strategy: Cache-aside pattern, 5-min TTL for lists
- Invalidation: On write operations (create, update, delete)
- Queue: BullMQ processors for `ingestion`, `analytics`, `email` queues
- Redis cluster mode for production (HA)

---

## ADR-007: S3-Compatible Storage for Files

### Status: ✅ Accepted

### Context
- Need to store PDFs, images, videos (up to 50MB)
- Presigned URL pattern for direct upload/download
- Scalable, durable storage
- Cost-effective

### Decision
Use **S3-compatible object storage** (AWS S3, MinIO, DigitalOcean Spaces).

### Rationale
**Pros:**
- Unlimited scalability, 99.999999999% durability (AWS S3)
- Presigned URLs offload upload/download from API servers
- Versioning, lifecycle policies (auto-archive old files)
- CDN-friendly (CloudFront integration)
- MinIO compatible for local development

**Cons:**
- Egress costs (mitigated by CDN)
- Eventual consistency (rare issue)

**Alternatives:**
- **Local filesystem:** Doesn't scale, hard to backup
- **GridFS (MongoDB):** Adds NoSQL dependency, less performant
- **Cloud provider-specific (GCS, Azure Blob):** Vendor lock-in

### Consequences
- Presigned URL flow: client requests → server generates → client uploads directly → server confirms
- File keys: `kb/{language}/{year}/{month}/{uuid}.{ext}`
- CDN: CloudFront for video streaming
- Local dev: MinIO container in docker-compose

---

## ADR-008: MySQL Full-Text Search (MVP)

### Status: ✅ Accepted (with caveat)

### Context
- Need to search KB items and videos by title, summary, extracted text
- Budget and timeline constraints
- Team has MySQL expertise

### Decision
Use **MySQL full-text search** (MATCH() AGAINST()) for MVP.

### Rationale
**Pros:**
- No additional infrastructure (already using MySQL)
- InnoDB full-text indexes performant for <100K records
- Boolean mode supports AND, OR, NOT, wildcards
- Simple to implement and maintain

**Cons:**
- Limited relevance ranking vs Elasticsearch
- No faceted search, aggregations
- Performance degrades with >1M records

**Alternatives:**
- **Elasticsearch:** Best-in-class search, but adds operational complexity, cost, and timeline risk
- **Algolia:** Managed search, but external dependency + cost

### Consequences
- Create FULLTEXT indexes: `FULLTEXT(title, summary, extracted_text)`
- Query: `MATCH(title, summary, extracted_text) AGAINST(:query IN BOOLEAN MODE)`
- Future migration path: Abstract search behind `SearchService` interface
- **Pluggable adapter:** If Elasticsearch needed, swap implementation without changing API

---

## ADR-009: BullMQ for Background Jobs

### Status: ✅ Accepted

### Context
- File processing (virus scan, PDF text extraction, thumbnails) too slow for HTTP request
- Analytics aggregation runs nightly
- Email sending should be async

### Decision
Use **BullMQ** (Bull v4) for background job processing.

### Rationale
**Pros:**
- Redis-backed (already using Redis)
- Job persistence, retries with exponential backoff
- Priority queues, delayed jobs
- Built-in Nest.js integration (`@nestjs/bull`)
- Dashboard UI (Bull Board) for monitoring

**Cons:**
- Single Redis instance is SPOF (use cluster)
- Requires worker processes (horizontal scaling)

**Alternatives:**
- **RabbitMQ:** More features, but heavier setup
- **AWS SQS:** Managed, but vendor lock-in, higher latency
- **Kafka:** Overkill for this use case

### Consequences
- Queues: `ingestion`, `analytics`, `email`
- Processors: Separate Nest.js modules (`IngestionProcessor`, etc.)
- Retry strategy: 3 retries, exponential backoff (1s, 2s, 4s)
- Failed jobs: Log to `failed_jobs` table, alert admins

---

## ADR-010: Pino for Logging

### Status: ✅ Accepted

### Context
- Need structured logging for debugging, monitoring
- JSON format for log aggregation (ELK, CloudWatch)
- Performance-critical (low overhead)

### Decision
Use **Pino** for logging.

### Rationale
**Pros:**
- Fastest Node.js logger (benchmarked)
- JSON output (structured logs)
- Low overhead (<1ms per log)
- Child loggers (context: requestId, userId)
- Nest.js integration (`nestjs-pino`)

**Cons:**
- Less human-readable in console (use `pino-pretty` in dev)

**Alternatives:**
- **Winston:** More features, but slower
- **Bunyan:** Similar to Pino, less active

### Consequences
- Log format: `{"level":30,"time":1696704000000,"msg":"User logged in","userId":123,"requestId":"abc"}`
- Log levels: `error`, `warn`, `info`, `debug`
- Middleware: Inject `requestId` into all logs
- Production: Ship logs to CloudWatch / Elasticsearch

---

## ADR-011: OpenTelemetry for Tracing

### Status: ✅ Accepted

### Context
- Need distributed tracing for debugging latency
- Multiple services (API, workers, external APIs)
- Vendor-neutral standard

### Decision
Use **OpenTelemetry** (OTel) for distributed tracing.

### Rationale
**Pros:**
- Vendor-neutral (export to Jaeger, Zipkin, AWS X-Ray, Datadog)
- Auto-instrumentation for HTTP, DB, Redis
- W3C Trace Context standard (cross-service tracing)
- Active CNCF project

**Cons:**
- Overhead (mitigated by sampling: trace 10% in prod)
- Requires backend (Jaeger, X-Ray)

**Alternatives:**
- **Jaeger SDK:** Vendor lock-in
- **AWS X-Ray SDK:** AWS-only
- **Zipkin:** Less feature-rich

### Consequences
- Instrument HTTP requests, DB queries, Redis, external API calls
- Sampling: 100% in dev/staging, 10% in production
- Export to Jaeger (dev), AWS X-Ray (prod)
- Include traceId in logs for correlation

---

## ADR-012: Prometheus for Metrics

### Status: ✅ Accepted

### Context
- Need real-time metrics (request rate, latency, errors)
- SLO monitoring (P95 < 200ms, error rate < 1%)
- Alerting (PagerDuty, Slack)

### Decision
Use **Prometheus** for metrics collection and alerting.

### Rationale
**Pros:**
- Industry standard (CNCF)
- Pull-based (no client config)
- PromQL for queries
- Alertmanager integration
- Grafana dashboards

**Cons:**
- Requires Prometheus server
- Storage limited (use Thanos for long-term)

**Alternatives:**
- **Datadog, New Relic:** Managed, but expensive
- **CloudWatch:** AWS-only, less flexible

### Consequences
- Expose `/metrics` endpoint (Prometheus format)
- Metrics:
  - `http_request_duration_seconds` (histogram)
  - `http_requests_total` (counter)
  - `queue_job_duration_seconds` (histogram)
  - `db_query_duration_seconds` (histogram)
- Alerts:
  - `P95 > 500ms` → warn
  - `Error rate > 1%` → critical

---

## ADR-013: Docker + docker-compose for Local Dev

### Status: ✅ Accepted

### Context
- Developers need consistent environment (API, MySQL, Redis, MinIO, ClamAV)
- Easy onboarding for new team members
- CI needs reproducible builds

### Decision
Use **Docker** for containerization and **docker-compose** for local orchestration.

### Rationale
**Pros:**
- Consistent dev environment (eliminates "works on my machine")
- Fast onboarding (one command: `docker-compose up`)
- Mirrors production (same base images)
- CI uses same Dockerfile (build once, deploy everywhere)

**Cons:**
- Initial setup overhead
- macOS Docker Desktop performance (use volumes carefully)

**Alternatives:**
- **Kubernetes (minikube):** Overkill for local dev
- **Vagrant:** Heavier, slower than Docker

### Consequences
- **Dockerfile:** Multi-stage build (build → production)
- **docker-compose.yml:** Services: api, mysql, redis, minio, clamav
- **Dev workflow:** `docker-compose up -d` → `docker-compose logs -f api`
- **Hot reload:** Mount `src/` as volume

---

## ADR-014: GitHub Actions for CI/CD

### Status: ✅ Accepted

### Context
- Need automated testing, linting, builds
- Deploy to staging on merge to main
- Client uses GitHub for source control

### Decision
Use **GitHub Actions** for CI/CD pipeline.

### Rationale
**Pros:**
- Native GitHub integration
- Free for public repos, generous limits for private
- Matrix builds (test on multiple Node versions)
- Secrets management
- Large marketplace (actions)

**Cons:**
- Vendor lock-in to GitHub
- Less powerful than Jenkins (acceptable for our needs)

**Alternatives:**
- **GitLab CI:** Requires GitLab migration
- **CircleCI:** External service, cost
- **Jenkins:** Self-hosted, maintenance overhead

### Consequences
- **On PR:** Lint → Test → Build → Migration dry-run
- **On merge to main:** Deploy to staging → E2E tests → (manual) deploy to prod
- **Secrets:** `DATABASE_URL`, `JWT_PRIVATE_KEY`, etc. stored in GitHub Secrets
- **Artifacts:** Docker images pushed to GitHub Container Registry (GHCR)

---

## ADR-015: TypeScript Strict Mode

### Status: ✅ Accepted

### Context
- Type safety reduces runtime errors
- Catch bugs early in development
- Improves code readability and maintainability

### Decision
Enable **TypeScript strict mode** (`strict: true` in `tsconfig.json`).

### Rationale
**Pros:**
- Prevents `null`/`undefined` errors (`strictNullChecks`)
- Enforces type annotations (`noImplicitAny`)
- Catches property access errors (`strictPropertyInitialization`)
- Improves IDE autocomplete

**Cons:**
- Steeper learning curve for junior devs
- More verbose code (explicit types)

**Alternatives:**
- Relaxed mode: Faster development, but more runtime errors

### Consequences
- All functions must have return type annotations
- No `any` type (use `unknown` or specific types)
- Null checks required: `if (user?.email) { ... }`
- Team training on strict TypeScript patterns

---

## ADR-016: Presigned URLs for File Upload/Download

### Status: ✅ Accepted

### Context
- Large files (up to 50MB) would timeout HTTP upload
- API servers shouldn't proxy file transfers (bandwidth, latency)
- Need secure, time-limited access to S3 objects

### Decision
Use **presigned URLs** for direct client-to-S3 upload and download.

### Rationale
**Pros:**
- Offloads file transfer from API servers (saves bandwidth, CPU)
- Scalable (S3 handles throughput)
- Secure (time-limited, signed URLs, no public access)
- Faster uploads (client → S3 direct)

**Cons:**
- Two-step flow (request URL → upload → confirm)
- Expiry requires careful timing (5 min upload, 1 hour download)

**Alternatives:**
- **Direct API upload:** Simple, but doesn't scale, timeouts
- **Multipart upload (API-proxied):** Complex, still bandwidth-heavy

### Consequences
- **Upload flow:**
  1. `POST /admin/kb` → server validates, returns presigned PUT URL
  2. Client uploads to S3 using presigned URL
  3. `PUT /admin/kb/:id/file` → server confirms, triggers ingestion job
- **Download flow:**
  1. `GET /kb/:id/download` → server checks auth, returns presigned GET URL
  2. Client downloads from S3 using presigned URL
- **Expiry:** Upload 5 min, download 1 hour
- **Security:** No public bucket access, all access via presigned URLs

---

## ADR-017: Virus Scanning with ClamAV

### Status: ✅ Accepted

### Context
- User-uploaded files (PDFs, images) could contain malware
- Protect end users and admins
- Compliance requirement (data security)

### Decision
Integrate **ClamAV** for virus scanning of all uploaded files.

### Rationale
**Pros:**
- Open-source, widely trusted
- Docker container available (easy integration)
- Fast scanning (<1s for typical PDFs)
- Low resource overhead

**Cons:**
- Requires virus database updates (nightly cron)
- False positives (manual review process)

**Alternatives:**
- **VirusTotal API:** Cloud-based, but cost + external dependency
- **AWS GuardDuty:** AWS-specific, less granular control
- **No scanning:** Unacceptable security risk

### Consequences
- **Flow:** File uploaded → Ingestion job → ClamAV scan → If clean: process, else: quarantine + alert admin
- **Deployment:** ClamAV container in docker-compose, sidecar in ECS
- **Database updates:** Cron job updates virus definitions daily
- **Quarantine:** Move infected files to `quarantine/` S3 prefix, notify admins

---

## ADR-018: Multi-Language Content via Separate Records

### Status: ✅ Accepted

### Context
- Need to support 6 languages (EN, AR, Bahasa, Malay, Thai, German)
- Content (KB, videos, AI settings) must be language-specific
- Translations may not be 1:1 (different content per language)

### Decision
Store **separate database records per language** (not JSON blobs).

### Rationale
**Pros:**
- Simple queries: `WHERE language_code = 'ar'`
- Indexing works naturally (per-language full-text search)
- Different content per language (not just translations)
- Easier to manage in Admin CMS (edit one language at a time)

**Cons:**
- Duplicate metadata (category, tags) across languages
- More records (6x for full coverage)

**Alternatives:**
- **JSON column:** `{ "en": "Title", "ar": "العنوان" }` → Complex queries, poor indexing
- **Translation table:** `content_translations(content_id, language_code, title, ...)` → Joins add complexity

### Consequences
- **Schema:** `knowledge_base_items.language_code`, `videos.language_code`
- **Queries:** Always filter by language: `WHERE language_code = :code AND is_published = true`
- **Admin UI:** Language selector, "duplicate to another language" feature
- **Future:** Translation service API (Google Translate) to auto-fill missing languages

---

## ADR-019: Soft Deletes for Users and Content

### Status: ✅ Accepted

### Context
- Need audit trail (who deleted what, when)
- GDPR right to be forgotten (but with record of request)
- Accidental deletes should be recoverable

### Decision
Use **soft deletes** (`deleted_at` timestamp) for users and content.

### Rationale
**Pros:**
- Preserves historical data for analytics
- Recoverable (admin can "undelete")
- Audit trail compliance
- Foreign key integrity maintained

**Cons:**
- Queries must filter `WHERE deleted_at IS NULL`
- Unique constraints tricky (email on non-deleted users)

**Alternatives:**
- **Hard deletes:** Data loss, no recovery
- **Archive table:** Moves deleted records to `users_deleted` → Complicates foreign keys

### Consequences
- **Schema:** Add `deleted_at TIMESTAMP NULL DEFAULT NULL` to `users`, `knowledge_base_items`, `videos`
- **Queries:** Global scope in repositories: `.where('deleted_at IS NULL')`
- **TypeORM:** Use `@DeleteDateColumn()` decorator
- **Admin UI:** "Show deleted" filter, "Restore" button

---

## ADR-020: Heygen Integration via Metadata Import

### Status: ✅ Accepted (MVP)

### Context
- Heygen hosts avatar videos on their CDN
- Need to display Heygen videos in PKH
- Programmatic video generation is future scope

### Decision
**Admin manually inputs Heygen video ID/URL** → Backend fetches metadata (title, thumbnail, CDN URL) → Stores in `videos` table.

### Rationale
**Pros:**
- Simple, low-risk integration
- No Heygen API dependency (just CDN playback)
- Fast to implement (9-week timeline)

**Cons:**
- Manual process (admin must copy-paste Heygen ID)
- No programmatic generation (future requirement)

**Alternatives:**
- **Heygen API (programmatic generation):** Complex, requires API access, longer timeline
- **Embed Heygen iframe:** Less control over UX, analytics

### Consequences
- **Admin flow:** Admin creates Heygen video → Copies video ID → Pastes into Admin CMS → Backend fetches metadata from Heygen CDN (or API if available)
- **Playback:** Frontend embeds Heygen player or uses CDN URL
- **Future:** Abstract behind `VideoService` → Swap implementation for API-based generation

---

## Summary of Key Trade-offs

| Decision | Trade-off | Justification |
|----------|-----------|---------------|
| MySQL full-text search | Simplicity vs power | MVP speed, pluggable for future |
| TypeORM | DX vs raw SQL perf | Type safety, maintainability |
| Presigned URLs | Two-step flow vs simplicity | Scalability, performance |
| Soft deletes | Query complexity vs audit | Compliance, recoverability |
| Separate language records | Duplication vs simplicity | Query performance, clarity |
| Heygen metadata import | Manual vs automated | Timeline, low risk |

---

## Review & Updates

- **Review Cycle:** Monthly during development, quarterly post-launch
- **Update Process:** New ADR for significant changes, append to existing for clarifications
- **Ownership:** Tech Lead maintains, team reviews in weekly sync

---

**Last Updated:** 2025-10-07  
**Version:** 1.0  
**Contact:** Tech Lead (tech@hpbs.com)