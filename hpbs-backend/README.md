# HPBS Product Knowledge Hub (PKH) Backend

Production-ready Nest.js backend for the HPBS Product Knowledge Hub and Admin CMS.

## 📋 Project Overview

A comprehensive backend system powering:
- **PKH (Public)**: Multilingual product knowledge platform with Heygen videos, searchable KB, and AI voice assistant
- **Admin CMS**: Content management, user management, AI configuration, and analytics

### Key Features

- 🌐 **Multilingual Support**: 6 languages (EN, AR, Bahasa, Malay, Thai, German)
- 🎥 **Heygen Video Integration**: Avatar-based product education
- 📚 **Knowledge Base**: Searchable PDFs, docs, images, FAQs
- 🤖 **AI Voice Assistant**: Contextual product queries
- 📊 **Analytics**: User engagement tracking and reporting
- 🔐 **Security**: JWT auth, RBAC, rate limiting, virus scanning
- ⚡ **Performance**: Caching, CDN, async jobs, P95 < 200ms

## 🏗️ Architecture

### Tech Stack

- **Framework**: Nest.js 11 (Node.js 20 LTS, TypeScript 5.7)
- **Database**: MySQL 8.0 + TypeORM
- **Cache/Queue**: Redis 7 + BullMQ
- **Storage**: S3-compatible (AWS S3 / MinIO)
- **Security**: JWT RS256, bcrypt, Helmet
- **Observability**: Pino, OpenTelemetry, Prometheus
- **API Docs**: Swagger/OpenAPI

### Project Structure

```
hpbs-backend/
├── src/
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication & authorization
│   │   ├── users/         # User management
│   │   ├── languages/     # i18n & language management
│   │   ├── kb/            # Knowledge Base
│   │   ├── videos/        # Video management
│   │   ├── ai-voice/      # AI Voice assistant
│   │   ├── analytics/     # Event tracking & reporting
│   │   ├── admin/         # Admin dashboard
│   │   ├── settings/      # App configuration
│   │   └── search/        # Full-text search
│   ├── common/            # Shared code
│   │   ├── guards/        # Auth, role guards
│   │   ├── decorators/    # Custom decorators
│   │   ├── filters/       # Exception filters
│   │   ├── interceptors/  # Logging, transform
│   │   ├── pipes/         # Validation pipes
│   │   ├── middleware/    # CORS, rate-limit
│   │   └── enums/         # Enums (roles, statuses)
│   ├── infra/             # Infrastructure services
│   │   ├── storage/       # S3 client
│   │   ├── queue/         # BullMQ processors
│   │   ├── mail/          # Email service
│   │   ├── cache/         # Redis wrapper
│   │   └── observability/ # Logging, tracing
│   ├── database/          # Database layer
│   │   ├── entities/      # TypeORM entities
│   │   ├── migrations/    # Version-controlled migrations
│   │   └── seeders/       # Test data
│   ├── config/            # Configuration
│   ├── main.ts            # Application entry
│   └── app.module.ts      # Root module
├── test/                  # E2E tests
├── docker-compose.yml     # Local development stack
├── Dockerfile             # Multi-stage build
├── RULES.md               # Development guidelines
├── PRD.md                 # Product requirements
└── ADR.md                 # Architecture decisions
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20 LTS
- Docker & Docker Compose
- MySQL 8.0 (or use Docker)
- Redis 7 (or use Docker)

### Installation

1. **Clone & Install**
   ```bash
   cd hpbs-backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Infrastructure (Docker)**
   ```bash
   docker-compose up -d mysql redis minio maildev clamav
   ```

4. **Run Migrations**
   ```bash
   npm run migration:run
   ```

5. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

6. **Start Development Server**
   ```bash
   npm run start:dev
   ```

7. **Access Application**
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api/docs
   - MinIO Console: http://localhost:9001
   - MailDev: http://localhost:1080

## 📜 Available Scripts

### Development
```bash
npm run start:dev      # Start with hot-reload
npm run start:debug    # Start with debugger
npm run build          # Production build
npm run start:prod     # Run production build
```

### Database
```bash
npm run migration:generate -- -n MigrationName  # Generate migration
npm run migration:create -- MigrationName       # Create empty migration
npm run migration:run                            # Run pending migrations
npm run migration:revert                         # Revert last migration
npm run seed                                     # Seed database
```

### Testing
```bash
npm run test           # Unit tests
npm run test:watch     # Watch mode
npm run test:cov       # Coverage report
npm run test:e2e       # E2E tests
```

### Code Quality
```bash
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix linting issues
npm run format         # Prettier format
```

## 🗄️ Database Schema

### Core Tables

- **users**: User accounts (PUBLIC_USER, ADMIN)
- **languages**: Supported languages (en, ar, id, ms, th, de)
- **knowledge_base_items**: PDFs, docs, images, FAQs
- **videos**: Heygen videos and uploaded videos
- **ai_voice_settings**: AI config per language
- **analytics_events**: User engagement tracking
- **progress_tracking**: Video completion status

See `src/database/entities/` for full schema.

## 🔐 Authentication & Authorization

### JWT Strategy
- **Access Token**: 15 minutes (RS256 or HS256)
- **Refresh Token**: 7 days, rotation on use
- **Password Hashing**: bcrypt (cost factor 12)

### Roles
- **PUBLIC_USER**: Access to PKH (KB, videos, AI voice)
- **ADMIN**: Full access to Admin CMS

### Protected Routes
```typescript
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(UserRole.ADMIN)
async adminEndpoint() { ... }
```

## 🌐 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Public Endpoints
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token
- `GET /kb` - List knowledge base items
- `GET /videos` - List videos
- `POST /ai-voice/query` - AI voice query

### Admin Endpoints (Require ADMIN role)
- `GET /admin/users` - List users
- `POST /admin/kb` - Upload KB item
- `POST /admin/videos` - Create video
- `GET /admin/analytics/overview` - Dashboard KPIs

### Swagger Documentation
Full API documentation available at: http://localhost:3000/api/docs

## 🐳 Docker

### Development (All Services)
```bash
docker-compose up -d
```

### Production Build
```bash
docker build -t hpbs-backend:latest .
docker run -p 3000:3000 --env-file .env hpbs-backend:latest
```

### Services
- **api**: Nest.js application
- **mysql**: Database
- **redis**: Cache + Queue
- **minio**: S3-compatible storage
- **clamav**: Virus scanning
- **maildev**: Email testing (dev only)

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available options.

**Critical Settings:**
- `DATABASE_URL`: MySQL connection string
- `REDIS_URL`: Redis connection
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: JWT signing keys
- `S3_*`: S3 storage configuration
- `SMTP_*`: Email service

### Feature Flags
```env
FEATURE_AI_VOICE_ENABLED=true
FEATURE_VIDEO_PROGRESS_TRACKING=true
FEATURE_ANALYTICS_ENABLED=true
```

## 📊 Observability

### Logging (Pino)
- Format: JSON
- Levels: error, warn, info, debug
- Development: Pretty-printed
- Production: JSON to stdout → CloudWatch / Elasticsearch

### Tracing (OpenTelemetry)
- Auto-instrumentation: HTTP, DB, Redis
- Export: Jaeger (dev), AWS X-Ray (prod)
- Sampling: 100% (dev), 10% (prod)

### Metrics (Prometheus)
- Endpoint: `/metrics`
- Metrics: request duration, error rate, queue jobs
- Dashboards: Grafana

### Health Checks
- `/health` - Liveness check
- `/health/ready` - Readiness check (DB, Redis, S3)

## 🧪 Testing

### Unit Tests
```bash
npm run test
npm run test:cov  # With coverage (target: 80%)
```

### E2E Tests
```bash
npm run test:e2e
```

Critical flows covered:
- Auth: signup, login, refresh, password reset
- KB: upload, list, search, download
- Videos: list, filter
- AI Voice: query proxy
- Analytics: event tracking

### Load Testing
```bash
# Coming soon: k6 scripts
```

## 🚢 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets (or RS256 keys)
- [ ] Configure database backups
- [ ] Set up Redis cluster (HA)
- [ ] Enable CloudWatch / X-Ray
- [ ] Configure S3 bucket policies
- [ ] Set CORS origins (production domains)
- [ ] Run migrations on staging first
- [ ] Load test before go-live

### CI/CD (GitHub Actions)
- **On PR**: Lint → Test → Build → Migration dry-run
- **On Merge to Main**: Deploy to staging
- **Manual**: Promote to production

## 📚 Documentation

- **RULES.md**: Development guidelines and standards
- **PRD.md**: Product requirements document
- **ADR.md**: Architecture decision records
- **API Docs**: `/api/docs` (Swagger)

## 🛠️ Troubleshooting

### Database Connection Failed
```bash
# Check MySQL is running
docker-compose ps mysql

# Check credentials in .env
cat .env | grep DATABASE
```

### Redis Connection Failed
```bash
# Check Redis is running
docker-compose ps redis

# Test connection
redis-cli -h localhost -p 6379 ping
```

### Migration Errors
```bash
# Drop schema (⚠️ DEV ONLY)
npm run schema:drop

# Recreate from migrations
npm run migration:run
```

### TypeScript Path Aliases Not Working
```bash
# Update tsconfig.json paths
# Restart IDE
# Clean build: rm -rf dist && npm run build
```

## 🤝 Contributing

### Code Standards
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier
- **Commits**: Conventional Commits format
- **Testing**: 80% coverage target

### Pull Request Process
1. Create feature branch: `feature/your-feature`
2. Write tests (unit + E2E)
3. Run linter: `npm run lint:fix`
4. Commit: `git commit -m "feat: add feature"`
5. Push and create PR
6. Await CI checks + peer review

## 📈 Roadmap

### Phase 1 (Weeks 1-2) ✅
- ✅ Project scaffolding
- ✅ Database schema & entities
- ✅ Core configuration
- 🔄 Auth module (JWT, signup, login)
- 🔄 Users module (CRUD, RBAC)

### Phase 2 (Weeks 3-4)
- Storage service (S3)
- KB module (upload, search)
- Video module (Heygen integration)

### Phase 3 (Weeks 5-6)
- AI Voice proxy
- Analytics tracking
- Admin dashboard

### Phase 4 (Weeks 7-8)
- Background jobs (ingestion, aggregation)
- E2E tests
- Performance optimization

### Phase 5 (Week 9)
- UAT on staging
- Production deployment
- Go-live

## 📞 Support

- **Project Lead**: [Your Name]
- **Email**: tech@hpbs.com
- **Slack**: #hpbs-pkh-backend

## 📄 License

UNLICENSED - Proprietary software for HPBS internal use only.

---

**Built with ❤️ by the HPBS Development Team**

**Last Updated**: 2025-10-07  
**Version**: 1.0.0  
**Node.js**: 20 LTS  
**Nest.js**: 11.0