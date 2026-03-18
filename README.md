# going-live
# Going Live

A full-stack team builder web application for managing roles, teams, and assignments during go-live events in healthcare settings.

## Overview

**Going Live** allows coordinators to:
- Manage a pool of roles (BioMed, Pharmacy, ZOLL Rep, etc.)
- Create teams with units, areas, and supply lists
- Drag-and-drop roles from the role pool onto teams
- Track per-team role assignments with custom notes

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Drag & Drop | dnd-kit |
| Forms | React Hook Form + Zod |
| Database | PostgreSQL |
| ORM | Prisma |
| API | tRPC |
| Containerization | Docker + Docker Compose |

## Local Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ (or use Docker)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set DATABASE_URL
```

### 3. Set up the database
```bash
npm run db:generate   # generate Prisma client
npm run db:push       # push schema to database
npm run db:seed       # seed default roles
```

### 4. Start development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Deployment

### Start all services (app + database)
```bash
docker-compose up -d
```

### Run database migrations inside Docker
```bash
docker-compose exec app npx prisma db push
docker-compose exec app npx prisma db seed
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (wipes database)
```bash
docker-compose down -v
```

## Project Structure

```
going-live/
├── app/                    # Next.js App Router pages
│   ├── api/trpc/          # tRPC API route handler
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page
│   └── providers.tsx      # React Query + tRPC providers
├── components/            # React components
│   ├── ui/                # shadcn/ui base components
│   ├── Header.tsx
│   ├── RoleCard.tsx
│   ├── RoleModal.tsx
│   ├── RolePool.tsx
│   ├── TeamCanvas.tsx
│   ├── TeamColumn.tsx
│   └── TeamModal.tsx
├── lib/                   # Shared utilities
│   ├── db.ts              # Prisma client singleton
│   ├── trpc.ts            # tRPC React client
│   └── utils.ts           # cn() helper
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── server/                # tRPC server
│   ├── trpc.ts            # tRPC instance
│   └── routers/           # Route handlers
│       ├── _app.ts
│       ├── role.ts
│       ├── team.ts
│       └── teamRole.ts
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with default data |
| `npm run db:migrate` | Run database migrations |
