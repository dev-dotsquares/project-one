# Base stage
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

# Development stage
FROM base AS development

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# Build stage
FROM base AS build

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache dumb-init

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=build /app/dist ./dist

USER node

EXPOSE 3000

CMD ["dumb-init", "node", "dist/main"]