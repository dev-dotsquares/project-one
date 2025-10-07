#!/bin/bash

# HPBS PKH Backend - Setup Verification Script
# Run this to verify your development environment is properly configured

set -e

echo "🔍 HPBS PKH Backend - Setup Verification"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Check function
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "📋 Checking Prerequisites..."
echo ""

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Node.js not found"
    ((FAILED++))
fi

# npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm: $NPM_VERSION"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} npm not found"
    ((FAILED++))
fi

# Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
    echo -e "${GREEN}✓${NC} Docker: $DOCKER_VERSION"
    ((PASSED++))
else
    warn "Docker not found (optional for local development)"
fi

# Docker Compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version | awk '{print $4}' | sed 's/,//')
    echo -e "${GREEN}✓${NC} Docker Compose: $COMPOSE_VERSION"
    ((PASSED++))
else
    warn "Docker Compose not found (optional for local development)"
fi

echo ""
echo "📂 Checking Project Files..."
echo ""

# Check key files
files=(
    "package.json:Package definition"
    "tsconfig.json:TypeScript config"
    ".env.example:Environment template"
    ".env:Environment file"
    "docker-compose.yml:Docker services"
    "Dockerfile:Container definition"
    "RULES.md:Development guidelines"
    "PRD.md:Product requirements"
    "ADR.md:Architecture decisions"
    "README.md:Project documentation"
    "GETTING_STARTED.md:Quick start guide"
    "PROJECT_SUMMARY.md:Project status"
)

for file_info in "${files[@]}"; do
    IFS=':' read -r file desc <<< "$file_info"
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $desc ($file)"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $desc ($file) not found"
        ((FAILED++))
    fi
done

echo ""
echo "📁 Checking Directory Structure..."
echo ""

# Check key directories
dirs=(
    "src:Source code"
    "src/modules:Feature modules"
    "src/common:Shared code"
    "src/infra:Infrastructure"
    "src/database:Database layer"
    "src/database/entities:TypeORM entities"
    "src/config:Configuration"
    "test:E2E tests"
    "docker:Docker configs"
)

for dir_info in "${dirs[@]}"; do
    IFS=':' read -r dir desc <<< "$dir_info"
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $desc ($dir/)"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $desc ($dir/) not found"
        ((FAILED++))
    fi
done

echo ""
echo "📦 Checking Dependencies..."
echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules installed"
    ((PASSED++))
    
    # Count packages
    PKG_COUNT=$(ls -1 node_modules | wc -l)
    echo -e "  └─ Packages: $PKG_COUNT"
else
    warn "node_modules not found - run 'npm install'"
fi

echo ""
echo "🗄️  Checking Database Entities..."
echo ""

# Check entities
entities=(
    "user.entity.ts:User"
    "language.entity.ts:Language"
    "knowledge-base-item.entity.ts:Knowledge Base Item"
    "video.entity.ts:Video"
)

for entity_info in "${entities[@]}"; do
    IFS=':' read -r file desc <<< "$entity_info"
    if [ -f "src/database/entities/$file" ]; then
        echo -e "${GREEN}✓${NC} $desc entity"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $desc entity not found"
        ((FAILED++))
    fi
done

echo ""
echo "🐳 Checking Docker Services..."
echo ""

if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    # Check if docker daemon is running
    if docker info &> /dev/null; then
        echo -e "${GREEN}✓${NC} Docker daemon is running"
        ((PASSED++))
        
        # Check for running containers
        RUNNING=$(docker-compose ps --services --filter "status=running" 2>/dev/null | wc -l)
        if [ "$RUNNING" -gt 0 ]; then
            echo -e "${GREEN}✓${NC} Docker Compose services running: $RUNNING"
            ((PASSED++))
        else
            warn "No Docker Compose services running - run 'docker-compose up -d'"
        fi
    else
        warn "Docker daemon not running - start Docker Desktop"
    fi
else
    warn "Docker/Docker Compose not available - skipping container checks"
fi

echo ""
echo "========================================"
echo "📊 Verification Results"
echo "========================================"
echo ""
echo -e "${GREEN}Passed:${NC}   $PASSED"
echo -e "${RED}Failed:${NC}   $FAILED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Setup verification complete - All critical checks passed!${NC}"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Install dependencies (if not done): npm install"
    echo "   2. Start Docker services: docker-compose up -d"
    echo "   3. Generate first migration: npm run migration:generate -- -n InitialSchema"
    echo "   4. Run migration: npm run migration:run"
    echo "   5. Start dev server: npm run start:dev"
    echo "   6. Open Swagger docs: http://localhost:3000/api/docs"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Setup verification failed - $FAILED critical issues found${NC}"
    echo ""
    echo "Please fix the issues above before proceeding."
    echo "Refer to GETTING_STARTED.md for setup instructions."
    echo ""
    exit 1
fi