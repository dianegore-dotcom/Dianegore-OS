# Security and Privacy Checklist

## Implemented in the first increment

- [x] Authentication required for application routes
- [x] Current Supabase SSR cookie pattern
- [x] Session refresh in `proxy.ts`
- [x] Server-side user and workspace derivation
- [x] RLS enabled on every exposed Phase 1 table
- [x] Workspace membership checks in RLS
- [x] Browser never supplies authoritative owner/workspace IDs
- [x] Zod validation for record creation
- [x] Same-origin Server Actions by default
- [x] Server Action request limit retained at 1 MB
- [x] No service-role or OpenAI key in browser code
- [x] No private public-file URLs
- [x] Soft-archive fields in record tables
- [x] Security response headers
- [x] Anonymous search cannot execute the search RPC
- [x] Dependency audit reports zero known vulnerabilities after the documented PostCSS override
- [x] Error UI does not display stack traces

## Required before storing high-risk production data

- [ ] Enable MFA for the owner account
- [ ] Confirm Supabase email and password security settings
- [ ] Configure custom SMTP for reliable auth messages if needed
- [ ] Create separate staging and production Supabase projects
- [ ] Add Playwright authorization tests against staging
- [ ] Test RLS with two distinct users and two workspaces
- [ ] Add a private Storage bucket and policy tests
- [ ] Add upload type, size, checksum and filename controls
- [ ] Add a virus-scanning integration point before broad document use
- [ ] Add field-level audit diffs and restore support
- [ ] Add explicit session timeout and re-authentication rules for sensitive actions
- [ ] Add rate limiting for login-adjacent and AI routes
- [ ] Establish backup retention and perform a restore drill
- [ ] Review company policy before storing company-confidential content
- [ ] Complete a privacy impact review for health and financial modules

## AI-specific controls before enabling AI

- [ ] Server-only OpenAI key
- [ ] Model names configured through environment variables
- [ ] Structured JSON Schema outputs validated before storage
- [ ] User-visible estimated size/cost for large runs
- [ ] Explicit handling for company-confidential and sensitive-personal material
- [ ] Selected excerpt and redaction options
- [ ] Source excerpt, source identifier and confidence on every suggestion
- [ ] Human approval for permanent tasks, decisions, facts and relationships
- [ ] AI activity log and run history
- [ ] Retrieval scoped by workspace, permissions and confidentiality
- [ ] Assistant answers cite internal records and label inference

## Dependency note

At creation time, stable Next.js 16.2.10 depended on PostCSS 8.4.31, which had a moderate advisory. `package.json` contains an npm override to PostCSS 8.5.10. The repository was reinstalled, audited and rebuilt after the override. Recheck this on every dependency update and remove the override when the stable framework package no longer needs it.

## Incident response basics

If a secret is exposed:

1. Revoke or rotate it immediately in Supabase, OpenAI or Netlify.
2. Remove it from repository history, not only the latest file.
3. Review logs and affected operations.
4. Invalidate sessions if authentication material may be affected.
5. Record what happened, impact, actions and follow-up controls without copying sensitive record contents into the incident note.
