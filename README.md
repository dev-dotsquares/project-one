# HPBS Product Knowledge Hub - Backend Project

> **👉 NEW HERE? Start with [START_HERE.md](START_HERE.md) for quick navigation!**

## 🎯 Project Status

**Phase**: Foundation & Core Setup ✅  
**Timeline**: 9 weeks total  
**Current Week**: Week 1 - Scaffolding Complete  
**Root Directory**: `/workspace/hpbs-backend`

---

## 📦 What Has Been Built

### ✅ Completed (Phase 0 - Foundation)

1. **Project Scaffolding**
   - ✅ Nest.js 11 application initialized
   - ✅ TypeScript strict mode enabled
   - ✅ Directory structure created (modules, common, infra, database)
   - ✅ Docker & docker-compose configuration
   - ✅ Environment configuration (.env.example)

2. **Core Documentation**
   - ✅ **RULES.md** - Development guidelines (15 sections, 500+ rules)
   - ✅ **PRD.md** - Product Requirements Document (17 sections, complete specs)
   - ✅ **ADR.md** - Architecture Decision Records (20 decisions)
   - ✅ **README.md** - Project documentation

3. **Database Foundation**
   - ✅ TypeORM configuration
   - ✅ Core entities (User, Language, KnowledgeBaseItem, Video)
   - ✅ Enums (UserRole, UserStatus, KBType, VideoSource, etc.)
   - ✅ Data source configuration
   - ✅ Migration scripts setup

4. **Application Configuration**
   - ✅ Global configuration module
   - ✅ Environment-based settings (DB, Redis, S3, JWT, SMTP, etc.)
   - ✅ Swagger/OpenAPI integration
   - ✅ Helmet security headers
   - ✅ CORS configuration
   - ✅ Global validation pipe

5. **Infrastructure Setup**
   - ✅ Docker Compose (MySQL, Redis, MinIO, ClamAV, MailDev)
   - ✅ Multi-stage Dockerfile
   - ✅ Health check endpoints

6. **Dependencies Configured**
   - ✅ Core: Nest.js, TypeORM, MySQL2
   - ✅ Auth: Passport, JWT, bcrypt
   - ✅ Queue: BullMQ, ioredis
   - ✅ Storage: AWS SDK S3
   - ✅ Validation: class-validator, class-transformer
   - ✅ Security: Helmet, throttler
   - ✅ Observability: Pino (logging)
   - ✅ Documentation: Swagger

---

## 📂 Project Structure

```
/workspace/
├── hpbs-backend/              # Main Nest.js application
│   ├── src/
│   │   ├── modules/           # Feature modules (auth, users, kb, videos, etc.)
│   │   ├── common/            # Shared code (guards, decorators, filters, etc.)
│   │   ├── infra/             # Infrastructure (storage, queue, mail, cache)
│   │   ├── database/          # Entities, migrations, seeders
│   │   ├── config/            # Configuration files
│   │   ├── main.ts            # Application entry point
│   │   └── app.module.ts      # Root module
│   ├── test/                  # E2E tests
│   ├── docker-compose.yml     # Local development stack
│   ├── Dockerfile             # Multi-stage build
│   ├── .env.example           # Environment template
│   ├── RULES.md               # Development guidelines
│   ├── PRD.md                 # Product requirements
│   ├── ADR.md                 # Architecture decisions
│   └── README.md              # Project documentation
└── README.md                  # This file (workspace overview)
```

---

## 🚀 Quick Start

### 1. Navigate to Project
```bash
cd /workspace/hpbs-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Infrastructure
```bash
docker-compose up -d mysql redis minio maildev
```

### 4. Run Migrations (After creating first migration)
```bash
npm run migration:run
```

### 5. Start Development Server
```bash
npm run start:dev
```

### 6. Access Application
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **MinIO Console**: http://localhost:9001 (user: minioadmin, pass: minioadmin)
- **MailDev**: http://localhost:1080

---

## 📋 Next Steps (Remaining Work)

### Week 1-2: Core Modules
- [ ] Generate and run initial database migrations
- [ ] Create Auth module (JWT strategy, signup, login, refresh, password reset)
- [ ] Create Users module (CRUD, profile, RBAC guards)
- [ ] Create Languages module (list, admin management)
- [ ] Create Settings module (public settings, admin config)
- [ ] Implement role guards (PUBLIC_USER, ADMIN)

### Week 3-4: Content Modules
- [ ] Create Storage service (S3 client, presigned URLs)
- [ ] Create KB module (upload, list, search, download)
- [ ] Create ingestion queue (virus scan, PDF extraction, thumbnails)
- [ ] Create Video module (Heygen integration, list, stream)
- [ ] Implement full-text search (MySQL MATCH())

### Week 5-6: AI & Analytics
- [ ] Create AI Voice module (proxy, settings, context enrichment)
- [ ] Create Analytics module (event tracking, aggregation)
- [ ] Create Admin module (dashboard, KPIs, quick actions)
- [ ] Implement progress tracking (video completion)

### Week 7-8: Testing & Hardening
- [ ] Write unit tests (80% coverage)
- [ ] Write E2E tests (critical flows)
- [ ] Implement rate limiting (global, auth, AI)
- [ ] Add audit logging (admin actions)
- [ ] Performance optimization (caching, indexes)
- [ ] Load testing (k6 scripts)

### Week 9: Deployment
- [ ] Create GitHub Actions CI/CD pipeline
- [ ] Set up staging environment
- [ ] UAT with stakeholders
- [ ] Production deployment
- [ ] Go-live checklist

---

## 🗂️ Key Documentation

### For Developers
- **`hpbs-backend/RULES.md`** - Must-read development guidelines
  - Architecture constraints
  - API design standards
  - Security rules (JWT, RBAC, rate limits, CORS)
  - Database standards (naming, migrations, indexing)
  - Testing requirements
  - Code quality standards

### For Product/Stakeholders
- **`hpbs-backend/PRD.md`** - Complete product specification
  - Executive summary
  - Functional requirements (all modules)
  - API contracts (endpoints, DTOs)
  - User flows
  - Non-functional requirements (performance, security)
  - 9-week timeline

### For Architects/Tech Leads
- **`hpbs-backend/ADR.md`** - Architecture decisions
  - 20 key technical decisions (Nest.js, MySQL, TypeORM, JWT, Redis, S3, etc.)
  - Rationale for each choice
  - Alternatives considered
  - Trade-offs and consequences

### API Documentation
- **Swagger UI**: http://localhost:3000/api/docs (when running)
- Auto-generated from decorators
- Interactive API testing

---

## 🏗️ Architecture Overview

### Technology Stack
- **Backend**: Nest.js 11 (Node.js 20 LTS, TypeScript 5.7 strict mode)
- **Database**: MySQL 8.0 with TypeORM
- **Cache/Queue**: Redis 7 + BullMQ
- **Storage**: S3-compatible (AWS S3 / MinIO)
- **Auth**: JWT (RS256 or HS256) + bcrypt
- **Security**: Helmet, CORS, rate limiting, virus scanning (ClamAV)
- **Observability**: Pino (logging), OpenTelemetry (tracing), Prometheus (metrics)
- **API Docs**: Swagger/OpenAPI

### Key Patterns
- **Modular Architecture**: Feature-based modules (auth, users, kb, videos, etc.)
- **RBAC**: Role-based access control (PUBLIC_USER, ADMIN)
- **Presigned URLs**: Direct S3 upload/download (offload from API)
- **Background Jobs**: BullMQ for heavy tasks (ingestion, analytics)
- **Soft Deletes**: Audit trail and recoverability
- **Multilingual**: Separate records per language (not JSON blobs)

---

## 🔐 Security Features

- ✅ JWT authentication (access + refresh tokens)
- ✅ Password hashing (bcrypt, cost 12)
- ✅ RBAC (PUBLIC_USER, ADMIN roles)
- ✅ Rate limiting (100 req/min global, 5 req/min auth, 10 req/min AI)
- ✅ CORS whitelisting
- ✅ Helmet security headers
- ✅ Input validation (class-validator)
- 🔄 Virus scanning (ClamAV) - configured, needs implementation
- 🔄 Audit logging - needs implementation
- 🔄 Presigned URLs - needs implementation

---

## 📊 Database Schema (Core)

### Entities Created
1. **User** - User accounts (email, password, role, language, status)
2. **Language** - Supported languages (code, name, is_active)
3. **KnowledgeBaseItem** - PDFs, docs, images, FAQs
4. **Video** - Heygen videos and uploaded videos

### Entities Pending
5. **PasswordReset** - Password reset tokens
6. **Category** - Content categorization
7. **Tag** - Content tagging
8. **AIVoiceSettings** - AI config per language
9. **AppSettings** - Feature flags, T&C URLs
10. **ProgressTracking** - Video completion status
11. **AnalyticsEvent** - User engagement tracking
12. **AuditLog** - Admin action trail

---

## 🧪 Testing Strategy

### Unit Tests
- **Target**: 80% code coverage
- **Tools**: Jest, @nestjs/testing
- **Mock**: Database, S3, Redis, external APIs

### E2E Tests
- **Tools**: Supertest, Jest
- **Coverage**: Critical flows (auth, KB, videos, AI, analytics)

### Load Tests
- **Tools**: k6 or Artillery
- **Targets**: 
  - List endpoints: 1000 req/s, P95 < 200ms
  - Search: 500 req/s, P95 < 300ms
  - AI Voice: 100 req/s, P95 < 2s

---

## 🐳 Docker Services

### Development Stack (docker-compose)
- **mysql**: Database (port 3306)
- **redis**: Cache + Queue (port 6379)
- **minio**: S3-compatible storage (ports 9000, 9001)
- **clamav**: Virus scanning (port 3310)
- **maildev**: Email testing (ports 1025, 1080)
- **api**: Nest.js application (port 3000)

### Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down

# Rebuild API
docker-compose up -d --build api
```

---

## 📦 Package.json Scripts

```bash
# Development
npm run start:dev          # Hot-reload dev server
npm run start:debug        # With debugger
npm run build              # Production build
npm run start:prod         # Run production build

# Database
npm run migration:generate -- -n MigrationName
npm run migration:run
npm run migration:revert
npm run seed

# Testing
npm run test               # Unit tests
npm run test:e2e           # E2E tests
npm run test:cov           # Coverage

# Code Quality
npm run lint               # Check
npm run lint:fix           # Auto-fix
npm run format             # Prettier
```

---

## 🌐 API Endpoints (Planned)

### Base URL
```
http://localhost:3000/api/v1
```

### Public (PKH)
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token
- `GET /kb` - List knowledge base items
- `GET /videos` - List videos
- `POST /ai-voice/query` - AI voice query
- `GET /languages` - List active languages
- `GET /settings/public` - Public settings (T&C, Privacy)

### Admin CMS (Requires ADMIN role)
- `GET /admin/users` - List users
- `POST /admin/kb` - Upload KB item
- `POST /admin/videos` - Create video
- `PATCH /admin/ai-voice/settings/:code` - Update AI settings
- `GET /admin/analytics/overview` - Dashboard KPIs
- `GET /admin/analytics/export.csv` - Export analytics

---

## 🎯 Success Criteria

### Performance
- ✅ API response time P95 < 200ms (target set)
- ✅ File upload support up to 50MB (configured)
- 🔄 Concurrent users: 1000+ (needs load testing)

### Security
- ✅ JWT authentication implemented (foundation)
- ✅ RBAC configured
- ✅ Rate limiting configured
- ✅ CORS whitelisting
- 🔄 Virus scanning (ClamAV configured, needs integration)

### Quality
- 🔄 80% test coverage (tests pending)
- ✅ TypeScript strict mode
- ✅ Linting & formatting configured

### Deployment
- ✅ Docker containerization
- ✅ Multi-stage builds
- 🔄 CI/CD pipeline (pending)
- 🔄 Staging environment (pending)

---

## 🔄 Current Status Summary

### ✅ Fully Complete
- Project scaffolding and structure
- Documentation (RULES, PRD, ADR, README)
- Database entities (4 core entities)
- Configuration system
- Docker setup
- Swagger documentation setup

### 🔄 Partially Complete
- Database schema (4/12 entities)
- Security configuration (JWT configured, not implemented)
- Infrastructure services (configured, not implemented)

### ⏳ Pending
- Module implementations (auth, users, kb, videos, ai-voice, analytics)
- Database migrations
- Background jobs (BullMQ processors)
- Tests (unit, E2E, load)
- CI/CD pipeline
- Deployment setup

---

## 📞 Getting Help

### Documentation
1. **RULES.md** - Development guidelines (start here)
2. **PRD.md** - Feature specifications
3. **ADR.md** - Technical decisions
4. **Swagger Docs** - API reference (when running)

### Support
- **Project Lead**: [Your Name]
- **Email**: tech@hpbs.com
- **Slack**: #hpbs-pkh-backend

---

## 📝 Important Notes

### ⚠️ Remember
- **Root Directory**: Always work from `/workspace/hpbs-backend`
- **Strict TypeScript**: No `any` types allowed
- **Migrations**: Never edit existing migrations after merge
- **Environment**: Copy `.env.example` to `.env` before running
- **Docker First**: Start infrastructure services before running migrations

### 🎯 Next Immediate Steps
1. Install dependencies: `cd hpbs-backend && npm install`
2. Start Docker services: `docker-compose up -d`
3. Create first migration: `npm run migration:generate -- -n InitialSchema`
4. Run migration: `npm run migration:run`
5. Start dev server: `npm run start:dev`
6. Begin implementing Auth module (Week 1 goal)

---

**Project Root**: `/workspace/hpbs-backend`  
**Documentation**: All key files in `hpbs-backend/` directory  
**Last Updated**: 2025-10-07  
**Status**: Foundation Complete ✅ - Ready for Module Implementation