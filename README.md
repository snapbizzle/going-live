# Going Live

A full-stack team builder and org management tool for live events. Assign roles to teams, manage supplies, and coordinate responsibilities — all with an intuitive drag-and-drop interface.

---

## Screenshots

> _(Add screenshots here after first run)_

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Drag & Drop | dnd-kit |
| Forms | React Hook Form + Zod |
| Database | PostgreSQL |
| ORM | Prisma |
| API | tRPC |
| Containerization | Docker + Docker Compose |

---

## Local Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL (or use Docker Compose)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/snapbizzle/going-live.git
cd going-live

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and update DATABASE_URL if needed

# 4. Run database migrations
npx prisma migrate dev --name init

# 5. Seed default roles
npx prisma db seed

# 6. Start the development server
npm run dev
```

Visit `http://localhost:3000`

---

## Docker Deployment (Self-Hosted)

```bash
# Build and start all services
docker compose up -d --build

# Run migrations inside the container
docker compose exec app npx prisma migrate deploy

# Seed the database
docker compose exec app npx prisma db seed
```

The app will be available on port `3000`.

---

## Nginx Proxy Manager Configuration

1. Log into your Nginx Proxy Manager dashboard
2. Go to **Proxy Hosts** → **Add Proxy Host**
3. Configure:
   - **Domain Names:** your domain (e.g. `goinglive.yourdomain.com`)
   - **Scheme:** `http`
   - **Forward Hostname/IP:** `localhost` (or your server's LAN IP)
   - **Forward Port:** `3000`
4. Under **SSL**, request a Let's Encrypt certificate if desired
5. Save and test

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://admin:secret@localhost:5432/goinglive` |
| `NEXTAUTH_SECRET` | Secret for session signing (future auth) | `changeme` |

---

## Features

- 🎯 **Role Pool** — View and manage all available roles
- 🏗️ **Team Canvas** — Side-by-side team columns
- 🖱️ **Drag & Drop** — Drag roles from the pool onto any team
- 📋 **Role Details** — View/edit name, description, category, and default notes
- 🏷️ **Team Details** — Manage team name, responsible units, areas, and supplies
- 🌱 **Seed Data** — Pre-loaded with default hospital roles
