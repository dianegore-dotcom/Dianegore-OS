# Diane OS Build Ledger

## Build identity

- Product: Diane OS
- Increment: Phase 0 architecture + Phase 1 working foundation
- Build date: July 12, 2026
- Default timezone: America/Montreal
- Deployment target: Netlify

## Selected stack

- Next.js 16.2.10
- React 19.2.4
- TypeScript
- Tailwind CSS 4.3.2
- Supabase JS 2.110.2
- `@supabase/ssr` 0.12.0
- Zod 4.4.3
- Vitest 4.1.10

## Decisions made

1. Use stable Next.js 16 and the `proxy.ts` convention.
2. Keep authorization close to the database with Supabase RLS.
3. Use one owner workspace now and retain `workspace_id` for future trusted users.
4. Keep keyword and tag search independent of AI.
5. Store quick captures separately until deliberately processed.
6. Use polymorphism only for shared tags in Phase 1; add a documented general relationship model in Phase 2.
7. Do not expose unfinished navigation or fake AI features.
8. Use an npm override for PostCSS 8.5.10 to clear the advisory in the stable Next.js dependency tree.

## Completed features

- [x] Environment contract
- [x] Netlify configuration
- [x] Auth clients and callback
- [x] Protected-route proxy
- [x] Owner workspace provisioning
- [x] Default vault provisioning
- [x] Phase 1 relational schema
- [x] RLS policies
- [x] Home dashboard
- [x] Today view
- [x] Projects and detail
- [x] Areas
- [x] Tasks and status changes
- [x] Waiting and delegated fields
- [x] Quick capture
- [x] Inbox conversion to task/project
- [x] Vault creation
- [x] Tag creation and linking
- [x] PostgreSQL search RPC
- [x] Match explanations
- [x] Responsive desktop/mobile navigation
- [x] Command palette
- [x] Security headers
- [x] Example seed data
- [x] Architecture, setup, deployment, security, testing and user documentation

## Database changes

Migration:

```text
supabase/migrations/202607120001_phase1_foundation.sql
```

Creates:

- seven enums
- eleven tables
- indexes including four GIN search indexes
- updated-at triggers
- workspace authorization helper functions
- RLS and policies
- auth-user provisioning trigger
- search RPC

## Environment variables

Required now:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_ALLOW_SIGN_UP`

Reserved for future server-only features:

- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_RESPONSE_MODEL`
- `OPENAI_EXTRACTION_MODEL`
- `OPENAI_EMBEDDING_MODEL`
- `CRON_SECRET`
- `APP_ENCRYPTION_SECRET`
- `SENTRY_DSN`

## Verification performed

- `npm run typecheck`: passed
- `npm run lint`: passed after removing one unused import
- `npm run test`: 4 tests passed
- `npm run build`: passed using non-secret placeholder public Supabase build values
- `npm audit --audit-level=moderate`: zero vulnerabilities after PostCSS override

The SQL migration was reviewed and packaged but was not executed against a live Supabase project in this environment. RLS and database behavior therefore still require hosted or local Supabase verification.

## Open issues and limits

- No live Supabase integration test was possible here.
- No end-to-end browser test is included yet.
- No document upload or private Storage policy yet.
- No edit screens for existing projects, areas or tasks yet.
- No soft archive/restore UI yet, although schema fields exist.
- Activity log is event-level, not field-level audit history.
- Task assignee, waiting and delegation use names until the People module exists.
- Phase 1 search has text and tag filters but not the full filter interface or saved searches.
- No AI key is used and no AI result is simulated.

## Next increment

Build Phase 2 foundations in this order:

1. `people` and `organizations`
2. `sources`, documents and private Storage
3. `decisions` and `knowledge_records`
4. `record_relationships` and source citations
5. review-queue generalization
6. edit, archive and restore flows
7. JSON and Markdown export foundation

Only after these destinations and provenance controls exist should pasted-conversation extraction be enabled.
