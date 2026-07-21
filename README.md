# Beginner Fitness App (Phase 1: Core skeleton & auth)

This is an MVP fitness web app for total beginners, built with **Next.js 14 + TypeScript**, **PostgreSQL + Prisma**, **Tailwind CSS**, and **custom email/password auth**.

Phase 1 delivers a clean foundation:

- Project skeleton with App Router
- PostgreSQL + Prisma setup
- Secure email/password authentication (bcrypt, HttpOnly cookie session)
- Simple, motivational landing page
- Signup + login forms
- Authenticated dashboard placeholder for future workout plans, habits, and weight tracking

Later phases (not implemented yet) will add beginner workout plans, guided home sessions, habits, and weight / body metrics.

## Tech stack

- **Framework:** Next.js 14 (App Router, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** Custom email + password with bcrypt hashing and session cookies
- **Hosting target:** Vercel (no special config needed)

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   # or pnpm install / yarn
   ```

2. **Configure environment**

   Copy the example env file and set your Postgres URL:

   ```bash
   cp .env.example .env
   # edit .env and set DATABASE_URL
   ```

3. **Run Prisma migrations & generate client**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Then open http://localhost:3000

## Auth flow

- Users can **sign up** with email + password (passwords hashed with bcrypt, 12 rounds)
- On successful signup or login, a **session row** is created in the `Session` table and a random token is stored in an **HttpOnly, SameSite=Lax cookie**
- Protected routes (like `/dashboard`) call `requireAuth()` server-side to redirect unauthenticated users to `/login`
- Users can log out from the dashboard, which deletes the session and clears the cookie

This foundation is intentionally small and focused so later phases can plug in workout planning, guided workouts, habit tracking, and weight / body measurement features.
