# Beginner Fitness App (Phase 3: Guided home workouts)

This is an MVP fitness web app for total beginners, built with **Next.js 14 + TypeScript**, **PostgreSQL + Prisma**, **Tailwind CSS**, and **custom email/password auth**.

Phase 1 delivered a clean foundation:

- Project skeleton with App Router
- PostgreSQL + Prisma setup
- Secure email/password authentication (bcrypt, HttpOnly cookie session)
- Simple, motivational landing page
- Signup + login forms
- Authenticated dashboard placeholder for future workout plans, habits, and weight tracking

Phase 2 adds beginner workout planning:

- Users can generate a simple 4-week beginner plan (home or gym)
- Option to pick a pre-made starter plan or answer 2 quick questions
- See today&apos;s planned session and a scrollable upcoming schedule on the dashboard

Phase 3 adds guided home workouts:

- Each scheduled session can be opened as a simple "follow along" page
- Clear, beginner-friendly instructions grouped into warm-up, main block, and cool-down
- Basic text-based timers on key exercises so users can count down without extra apps

Later phases (not implemented yet) will add habits and weight / body metrics.

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
