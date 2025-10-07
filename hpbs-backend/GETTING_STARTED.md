# Getting Started with HPBS PKH Backend

**Quick Start Guide for Developers**  
**Root Directory**: `/workspace/hpbs-backend`

---

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd /workspace/hpbs-backend
npm install
```

### Step 2: Configure Environment
```bash
# .env is already created from .env.example
# Review and update if needed:
cat .env
```

### Step 3: Start Infrastructure Services
```bash
docker-compose up -d mysql redis minio
```

Wait for services to be healthy (30 seconds):
```bash
docker-compose ps
```

### Step 4: Create Database Schema
```bash
# Generate initial migration (after all entities are complete)
npm run migration:generate -- -n InitialSchema

# Run migration
npm run migration:run
```

### Step 5: Start Development Server
```bash
npm run start:dev
```

### Step 6: Verify Setup
- Open http://localhost:3000 - Should see "HPBS Product Knowledge Hub API - v1.0"
- Open http://localhost:3000/api/docs - Swagger documentation
- Open http://localhost:3000/api/v1/health - Health check

---

## 📂 Project Navigation

### Key Directories
```bash
cd src/modules/auth        # Authentication module
cd src/modules/users       # User management
cd src/modules/kb          # Knowledge Base
cd src/database/entities   # Database models
cd src/common/guards       # Security guards
```

### Key Files
```bash
# Documentation
cat RULES.md              # Development guidelines (MUST READ)
cat PRD.md                # Product requirements
cat ADR.md                # Architecture decisions
cat PROJECT_SUMMARY.md    # Project status

# Configuration
cat .env                  # Environment variables
cat src/config/configuration.ts  # App configuration

# Entry Points
cat src/main.ts           # Application bootstrap
cat src/app.module.ts     # Root module
```

---

## 🛠️ Common Tasks

### Database Operations

**Create a New Entity**
1. Create file: `src/database/entities/my-entity.entity.ts`
2. Define entity with decorators:
   ```typescript
   import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

   @Entity('my_table')
   export class MyEntity {
     @PrimaryGeneratedColumn()
     id!: number;

     @Column()
     name!: string;
   }
   ```
3. Export from `src/database/entities/index.ts`
4. Generate migration: `npm run migration:generate -- -n AddMyEntity`
5. Run migration: `npm run migration:run`

**Run Migrations**
```bash
npm run migration:run         # Apply pending migrations
npm run migration:revert      # Rollback last migration
npm run migration:show        # Show migration status
```

**Seed Database**
```bash
npm run seed                  # Run all seeders
```

### Module Development

**Create a New Module**
```bash
# Using Nest CLI
npx nest generate module modules/my-module
npx nest generate service modules/my-module
npx nest generate controller modules/my-module

# Or manually create:
# - src/modules/my-module/my-module.module.ts
# - src/modules/my-module/my-module.service.ts
# - src/modules/my-module/my-module.controller.ts
# - src/modules/my-module/dto/create-my-entity.dto.ts
```

**Implement CRUD Endpoints**
1. Create DTOs in `dto/` folder
2. Implement service methods
3. Add controller endpoints
4. Add Swagger decorators
5. Add guards for authentication/authorization
6. Write tests

### Testing

**Run Tests**
```bash
npm run test              # All unit tests
npm run test:watch        # Watch mode
npm run test:cov          # With coverage
npm run test:e2e          # E2E tests
```

**Write a Unit Test**
```typescript
// my-service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MyService } from './my-service';

describe('MyService', () => {
  let service: MyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyService],
    }).compile();

    service = module.get<MyService>(MyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

**Write an E2E Test**
```typescript
// my-endpoint.e2e-spec.ts
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('My Endpoint', () => {
  let app;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET /api/v1/my-endpoint', () => {
    return request(app.getHttpServer())
      .get('/api/v1/my-endpoint')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

---

## 🔍 Debugging

### View Logs
```bash
# API logs (if running in Docker)
docker-compose logs -f api

# Database logs
docker-compose logs -f mysql

# Redis logs
docker-compose logs -f redis
```

### Inspect Database
```bash
# Connect to MySQL
docker-compose exec mysql mysql -u hpbs_user -phpbs_password hpbs_pkh

# Run queries
SHOW TABLES;
DESCRIBE users;
SELECT * FROM users;
```

### Inspect Redis
```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Commands
KEYS *
GET some-key
```

### Debug with VS Code
1. Add breakpoint in code
2. Run: `npm run start:debug`
3. Attach debugger (F5)

---

## 📋 Development Workflow

### Daily Workflow
1. **Pull latest code** (if working in team)
   ```bash
   git pull origin main
   npm install  # If package.json changed
   npm run migration:run  # If new migrations
   ```

2. **Start development environment**
   ```bash
   docker-compose up -d
   npm run start:dev
   ```

3. **Make changes**
   - Edit code in `src/`
   - Hot-reload auto-restarts server

4. **Test changes**
   ```bash
   npm run test
   npm run test:e2e
   npm run lint
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/my-feature
   ```

### Feature Development Workflow
1. **Create feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Implement feature**
   - Create entities (if needed)
   - Generate migration
   - Implement service
   - Implement controller
   - Add DTOs with validation
   - Add Swagger docs
   - Add guards for security

3. **Write tests**
   - Unit tests for service
   - E2E tests for controller
   - Aim for 80% coverage

4. **Code review checklist**
   - [ ] All tests pass
   - [ ] Linting passes
   - [ ] Swagger docs added
   - [ ] Security guards applied
   - [ ] DTOs have validation
   - [ ] Error handling added
   - [ ] Logging added
   - [ ] Code follows RULES.md

5. **Create PR**
   ```bash
   git push origin feature/my-feature
   # Open PR on GitHub
   ```

---

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Check if MySQL is running
docker-compose ps mysql

# Check logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql

# Verify credentials in .env
cat .env | grep DATABASE
```

### "Port 3000 already in use"
```bash
# Find process using port
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or change port in .env
echo "PORT=3001" >> .env
```

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install

# Rebuild
npm run build
```

### "TypeScript compilation errors"
```bash
# Check TypeScript version
npx tsc --version

# Clean and rebuild
rm -rf dist
npm run build
```

### "Migration failed"
```bash
# Check migration file
cat src/database/migrations/*.ts

# Rollback and retry
npm run migration:revert
npm run migration:run

# If stuck, drop schema (⚠️ DEV ONLY)
npm run schema:drop
npm run migration:run
```

---

## 📚 Learning Path

### Week 1: Foundation (Current)
- [ ] Read RULES.md (all sections)
- [ ] Read PRD.md (understand requirements)
- [ ] Read ADR.md (understand decisions)
- [ ] Set up local environment
- [ ] Run the application
- [ ] Explore Swagger docs
- [ ] Review existing entities
- [ ] Complete Auth module

### Week 2-3: Core Modules
- [ ] Understand TypeORM (entities, relations, queries)
- [ ] Learn Nest.js modules, services, controllers
- [ ] Implement Users module
- [ ] Implement KB module
- [ ] Write first E2E tests

### Week 4-5: Advanced Features
- [ ] Understand BullMQ (background jobs)
- [ ] Implement file upload (S3 presigned URLs)
- [ ] Implement search (MySQL full-text)
- [ ] Implement Video module
- [ ] Implement AI Voice module

### Week 6-7: Testing & Optimization
- [ ] Write comprehensive tests
- [ ] Optimize database queries
- [ ] Implement caching (Redis)
- [ ] Add logging and tracing
- [ ] Performance testing

### Week 8-9: Deployment
- [ ] CI/CD pipeline
- [ ] Staging deployment
- [ ] Production hardening
- [ ] Monitoring setup
- [ ] Go-live

---

## 🎯 Your First Task

### Implement Auth Module (2-3 days)

**Files to Create:**
1. `src/modules/auth/auth.module.ts`
2. `src/modules/auth/auth.service.ts`
3. `src/modules/auth/auth.controller.ts`
4. `src/modules/auth/dto/signup.dto.ts`
5. `src/modules/auth/dto/login.dto.ts`
6. `src/modules/auth/dto/refresh.dto.ts`
7. `src/modules/auth/strategies/jwt.strategy.ts`
8. `src/modules/auth/strategies/local.strategy.ts`
9. `src/common/guards/jwt-auth.guard.ts`
10. `src/common/guards/local-auth.guard.ts`
11. `test/auth.e2e-spec.ts`

**Endpoints to Implement:**
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Invalidate refresh token
- `POST /api/v1/auth/forgot-password` - Send reset email
- `POST /api/v1/auth/reset-password` - Reset password

**Acceptance Criteria:**
- [ ] All endpoints working
- [ ] JWT tokens generated correctly
- [ ] Passwords hashed with bcrypt
- [ ] Refresh token rotation implemented
- [ ] E2E tests pass
- [ ] Swagger docs complete

**Reference:**
- See PRD.md Section 5.1 (Authentication & Authorization)
- See RULES.md Section 4 (Security Rules)
- See ADR.md ADR-004 (JWT Strategy)

---

## 🤝 Getting Help

### Documentation
1. **Quick Questions**: Check RULES.md
2. **Feature Specs**: Check PRD.md
3. **Design Rationale**: Check ADR.md
4. **API Reference**: http://localhost:3000/api/docs

### External Resources
- [Nest.js Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [Nest.js JWT Guide](https://docs.nestjs.com/security/authentication#jwt-functionality)

### Support Channels
- **Team Slack**: #hpbs-pkh-backend
- **Email**: tech@hpbs.com

---

## ✅ Pre-flight Checklist

Before starting development, ensure:

- [ ] Node.js 20 LTS installed
- [ ] Docker and Docker Compose installed
- [ ] Dependencies installed (`npm install`)
- [ ] Docker services running (`docker-compose ps`)
- [ ] Environment configured (`.env` exists)
- [ ] Migrations applied (`npm run migration:run`)
- [ ] Dev server starts (`npm run start:dev`)
- [ ] Health check passes (http://localhost:3000/api/v1/health)
- [ ] Swagger loads (http://localhost:3000/api/docs)
- [ ] Read RULES.md (at least Sections 1-5)
- [ ] Read PRD.md (at least Executive Summary)

---

**Ready to Code!** 🚀

Start with: `npm run start:dev` and open http://localhost:3000/api/docs

**Next**: Implement Auth Module (see "Your First Task" above)