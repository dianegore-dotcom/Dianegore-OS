# Diane OS

**Your projects, knowledge, decisions, and next actions in one place.**

Diane OS is a private, authenticated, personally owned operating system and second brain. This repository contains the Phase 0 architecture and the first working Phase 1 foundation.

## What works in this increment

- Supabase email/password authentication with current SSR cookie handling
- Protected Next.js App Router pages using `proxy.ts`
- Single-owner workspace provisioning with future trusted-user support
- Row-level security on every exposed Phase 1 table
- Responsive desktop, iPad and mobile application shell
- Home and Today dashboards
- Projects and project detail pages
- Areas of responsibility
- Tasks, next actions, due dates, waiting items and delegated-to fields
- Universal quick capture into an inbox/review queue
- Inbox conversion into a task or project
- Flexible vaults and confidentiality labels
- Shared tags attached to projects, tasks and captures
- PostgreSQL full-text and tag-aware search that explains why a result matched
- Soft-archive-ready schema
- Activity logging for important application actions
- Netlify configuration and security headers
- Example seed data marked `[Example]`
- Strict TypeScript, linting, validator tests and a verified production build

## Deliberately not included yet

The first increment does not pretend that later systems are complete. Conversation import, documents, source records, decisions, knowledge records, AI extraction, internal assistant, agent runs, advanced exports, notifications, recurring automation, field-level version restoration and personal specialist modules are planned in the next increments.

## Technology

- Next.js 16 with App Router, React 19 and strict TypeScript
- Tailwind CSS 4 with small accessible reusable components
- Supabase PostgreSQL, Auth and future private Storage
- Netlify hosting
- Zod validation
- Vitest tests

## 1. Create the Supabase project

Follow [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md).

The short sequence is:

1. Create a new personal Supabase project.
2. Open the SQL Editor.
3. Run `supabase/migrations/202607120001_phase1_foundation.sql`.
4. Copy the project URL and publishable key.
5. Create `.env.local` from `.env.example`.
6. Start the app and create the owner account.
7. Set `NEXT_PUBLIC_ALLOW_SIGN_UP=false` after the owner account is working.
8. Optionally run `supabase/seed.sql` for clearly marked example records.

## 2. Configure local environment

```bash
cp .env.example .env.local
```

Set at minimum:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_ALLOW_SIGN_UP=true
```

The service-role and OpenAI secrets are listed for future phases but are not required by the Phase 1 screens. Never expose them with a `NEXT_PUBLIC_` prefix.

## 3. Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Expected result: the private Diane OS sign-in page appears. After account creation and confirmation, sign in and the migration trigger creates the owner profile, workspace, default vaults and starter areas.

## 4. Verify before deployment

```bash
npm run verify
```

This runs linting, TypeScript, tests and the production build.

## 5. Deploy to Netlify

Follow [docs/NETLIFY_DEPLOYMENT.md](docs/NETLIFY_DEPLOYMENT.md).

Typical settings are already in `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `.next`
- Node: 22

Add the same environment variables in Netlify before the first production deploy. Set `NEXT_PUBLIC_APP_URL` to the actual Netlify or custom-domain URL. Add that URL to the Supabase Auth redirect allow-list.

## Repository map

```text
src/
  actions/              Secure server actions
  app/
    (auth)/             Sign-in flow
    (app)/              Authenticated application routes
    auth/callback/      Supabase email confirmation callback
  components/
    forms/              Validated record forms
    layout/             Responsive shell and navigation
    records/            Record cards
    ui/                 Small accessible UI components
  lib/
    supabase/            Browser, server and proxy clients
    validators/          Zod schemas
    auth.ts              Server-side workspace authorization
    data.ts              Phase 1 data-access layer
  types/                 Domain types
supabase/
  migrations/           SQL schema and RLS
  seed.sql               Optional example data
docs/                    Architecture, setup, security and operations
```

## Important privacy note

Diane OS can store highly sensitive personal and company-confidential information. A personal deployment does not remove the obligation to follow employer policy, privacy law, contractual terms or record-retention rules. The confidentiality labels and future redaction controls help operationally, but they are not legal determinations.

## Current verification status

See [docs/BUILD_LEDGER.md](docs/BUILD_LEDGER.md) for the exact tests run, open issues and next increment.
