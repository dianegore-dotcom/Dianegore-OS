# Diane OS Architecture Decision

## A. Product understanding

Diane OS is a private operational system that converts Diane's work and personal material into connected, searchable records. It is intended to become the daily place for capture, next actions, project status, waiting items, decisions, source history, reusable knowledge, meeting preparation and personal planning.

It is not:

- a public personal website
- a decorative dashboard
- a generic notes application with a new name
- a fully autonomous agent
- an employer-owned knowledge base
- a claim of direct access to ChatGPT account history
- a system that silently promotes AI suggestions into confirmed facts

The system is designed around a small number of durable concepts: workspace, vault, area, project, task, source, conversation, decision, knowledge record, person, relationship and review item.

## B. Architecture decision

### Selected stack

- **Application:** Next.js 16 App Router, React 19, TypeScript
- **UI:** Tailwind CSS 4 and small accessible components owned by the repository
- **Hosting:** Netlify using its current Next.js adapter
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth with cookie-based SSR via `@supabase/ssr`
- **Files:** private Supabase Storage in the document increment
- **AI:** OpenAI Responses API through server-only code in the AI increment
- **Validation:** Zod at the server boundary
- **Search:** PostgreSQL full-text search and metadata/tag filters first, pgvector later
- **Testing:** Vitest now, Playwright after a test Supabase project is available

### Why this fits

1. The App Router supports server-rendered private pages and server actions without creating a separate API for every form.
2. Supabase keeps the source of truth in portable PostgreSQL and provides Auth, RLS and private Storage within one coherent backend.
3. Netlify supports the selected Next.js architecture and deploy previews.
4. PostgreSQL full-text search keeps core retrieval working when AI is disabled.
5. The workspace identifier on major tables creates a clean path to future trusted users without prioritizing collaboration now.
6. OpenAI calls will stay server-side and use structured output contracts. Model names remain environment-driven.

### Important architecture constraint

`proxy.ts` refreshes authentication and redirects obvious unauthenticated requests, but it is not the main authorization boundary. Each server action derives the current user and workspace from the verified Supabase session, and PostgreSQL RLS independently limits data access.

## C. MVP boundary

### First deployed release

The complete MVP target remains the master prompt's 25 acceptance checks. It will include:

- secure owner login
- responsive application shell
- Home and Today
- quick capture and inbox review
- projects, areas, tasks and waiting items
- vaults and tags
- people, decisions and knowledge records
- source references and private document upload
- global keyword search
- soft archive and restore
- pasted-conversation import
- one-conversation AI extraction
- approval of proposed tasks and decisions
- source-grounded internal assistant
- JSON and Markdown export
- Netlify deployment and setup documentation

### Included in this first working increment

- authentication and protected routing
- owner workspace provisioning
- Home, Today, capture, inbox, projects, project detail, areas, tasks, vaults and search
- task waiting/delegation fields
- inbox-to-task/project conversion
- confidentiality levels and tags
- Phase 1 schema, indexes, RLS, search RPC and seed data
- build, lint and unit-test foundation
- Netlify configuration

### Waiting for later increments

- Phase 2 entities: people, meetings, decisions, knowledge, sources, documents, templates and relationships
- ChatGPT export parser and conversation message model
- OpenAI extraction and approval queue
- internal assistant and source citations
- agents, notifications and scheduled automations
- version restore, complete audit diffs, exports and backup UI
- recipe, health, medication, finance and travel specialist modules

## D. System map

### Full navigation map

```text
Home
Today
Projects
Areas
Tasks
Knowledge
Conversations
Decisions
Meetings
People
Documents & Sources
Templates & Prompts
Inbox & Review
Archive
Settings & Administration
```

The first increment exposes only implemented routes. It does not present non-working navigation.

### Route map

Current:

```text
/login                 Private sign-in and owner creation during setup
/auth/callback         Supabase confirmation callback
/home                  Operational dashboard
/today                 Focused priorities and follow-ups
/capture               Universal quick capture
/inbox                 Review and convert captures
/projects              Project list and creation
/projects/[id]         Project context and tasks
/areas                 Ongoing responsibilities
/tasks                 Open, overdue, week, waiting and completed views
/vaults                Vault list and creation
/search                Full-text and tag-aware search
```

Planned:

```text
/knowledge
/conversations
/conversations/[id]/review
/decisions
/meetings
/people
/documents
/templates
/archive
/assistant
/agents
/automations
/settings/*
/exports
/backups
```

### Major workflows

1. **Capture:** mobile or desktop capture → inbox → convert or later AI classify → approved permanent record.
2. **Operate:** Home/Today → select next action → complete, wait, delegate or reschedule.
3. **Project control:** project → desired outcome → tasks → waiting/blockers → health review → completion and lessons.
4. **Source-aware knowledge:** source/document/conversation → extraction suggestions → human review → linked decisions, knowledge and tasks.
5. **Ask Diane OS:** user question → metadata and text retrieval → confidentiality filter → model response → internal citations.
6. **Review:** pending AI output, duplicates, expired knowledge and unresolved decisions → approve, edit, merge, reject or defer.

### Initial AI workflows

The AI layer will be added after source and review records exist:

- conversation extraction using strict JSON Schema
- task and decision proposal, never silent creation
- grounded assistant using approved chunks and record metadata
- duplicate candidate comparison
- project health recommendations
- weekly review draft

## E. Database plan

### Phase 1 tables implemented

- `profiles`
- `workspaces`
- `workspace_members`
- `vaults`
- `areas`
- `projects`
- `tasks`
- `inbox_items`
- `tags`
- `record_tags`
- `activity_log`

### Phase 2 tables planned

- `people`
- `organizations`
- `record_people`
- `meetings`
- `decisions`
- `knowledge_records`
- `sources`
- `documents`
- `document_versions`
- `attachments`
- `templates`
- `prompts`
- `record_relationships`
- `record_versions`
- `audit_log`
- `notifications`
- `saved_searches`
- `user_preferences`

### Phase 3 and 4 tables planned

- `conversations`
- `conversation_messages`
- `imports`
- `import_items`
- `extraction_jobs`
- `extraction_suggestions`
- `agent_definitions`
- `agent_runs`
- `agent_outputs`
- `embeddings` or per-record chunk tables
- `ai_activity_log`

### Relationship approach

Normal foreign keys are used for core ownership and direct relationships. A general `record_relationships` table will be introduced once all principal record types exist. Polymorphism will be limited to cross-record features such as tags and general relationships. This avoids one giant JSON record while still allowing future modules.

## F. Security and privacy plan

### Authentication

Supabase Auth handles password storage and identity. SSR sessions are stored in cookies and refreshed through the current Supabase proxy pattern. Server-side code uses `getUser()` when it needs a current user record.

### Data isolation

Every major table contains `workspace_id`. RLS requires authenticated workspace membership. Server actions never accept the authoritative owner or workspace from the browser.

### File security

The document increment will use a private Storage bucket with paths scoped as:

```text
{workspace_id}/{owner_id}/{document_id}/{sanitized_filename}
```

Access will use RLS and short-lived signed URLs. No private document will receive a permanent public URL.

### AI data handling

- AI is off until the user explicitly configures a server-only API key.
- Company-confidential and sensitive-personal content will require explicit processing choices.
- Prompts will use selected excerpts or retrieved chunks, not an entire lifetime archive.
- AI output will be stored as a proposal with source excerpt, confidence and approval status.
- Inference and direct source facts will be separate fields.
- A model response cannot bypass RLS or create permanent records without an approved workflow.

### Secret management

Browser-safe Supabase values use `NEXT_PUBLIC_`. Service-role, OpenAI, cron and encryption secrets remain server-only in local `.env.local` and Netlify environment settings. The application never sends the service-role key to the browser.

### Export and ownership

The source of truth is standard PostgreSQL. Later export jobs will produce JSON, CSV, Markdown and ZIP manifests with stable record identifiers and source relationships. A backup screen will report only backups or exports that actually exist.

## G. Repository structure

```text
.
├── docs/
├── public/
├── src/
│   ├── actions/
│   ├── app/
│   │   ├── (app)/
│   │   ├── (auth)/
│   │   └── auth/callback/
│   ├── components/
│   │   ├── forms/
│   │   ├── layout/
│   │   ├── records/
│   │   └── ui/
│   ├── lib/
│   │   ├── supabase/
│   │   └── validators/
│   └── types/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── tests/
├── .env.example
├── netlify.toml
└── package.json
```

## H. Implementation sequence

1. **Foundation:** repository, dependencies, environment contract and Netlify configuration.
2. **Identity:** Auth clients, proxy refresh, owner provisioning and workspace-aware RLS.
3. **Operate:** app shell, Home, Today and quick capture.
4. **Core records:** areas, projects and tasks with waiting and delegation.
5. **Organize:** vaults, tags and inbox conversion.
6. **Retrieve:** PostgreSQL search with match explanations.
7. **Phase 2 records:** people, sources, documents, knowledge, decisions, meetings and relationships.
8. **Conversation intake:** pasted text first, then export adapters and batch handling.
9. **AI approval:** structured extraction contracts, cost controls and review interface.
10. **Assistant:** retrieval, confidentiality checks and internal source citations.
11. **Operational extensions:** recurring rules, dashboards, notifications, exports and backup.
12. **Hardening:** policy tests, Playwright, accessibility audit, performance and restore drill.

Every increment must finish with migration notes, updated ledger, lint, typecheck, tests and production build.

## I. Assumptions

- Diane is the initial and only owner.
- The application and database are created in personal accounts controlled by Diane.
- Email/password is acceptable for the initial owner setup. MFA is recommended before storing sensitive production data.
- America/Montreal is the default timezone.
- Company-confidential information may be stored only when permitted by employer policy and applicable obligations.
- The owner will import ChatGPT data through exports or manual capture. No unauthorized direct-account access is assumed.
- Semantic search is an enhancement, not a replacement for keyword search and filters.
- The repository uses stable releases. A dependency override is used to patch PostCSS until the stable Next.js package updates its nested version.
- The first deployment will use one Supabase project and one Netlify site. Separate staging and production projects should be added before high-risk expansion.

## J. Start building

Phase 0 is represented by this architecture, route map, environment contract and build ledger. The Phase 1 working increment is implemented in the repository. The next build increment starts with sources, people, decisions and knowledge because conversation extraction and grounded AI require those destinations and provenance controls first.
