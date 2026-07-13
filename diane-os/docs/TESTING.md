# Testing Guide

## Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run verify
```

## Tests currently included

`tests/validators.test.ts` checks:

- valid project payloads
- rejection of blank project titles
- task form normalization of empty relationships and checkbox values
- rejection of empty capture text

## Manual acceptance checks for this increment

After the migration and owner setup:

1. Sign in and confirm an unauthenticated private route redirects to `/login`.
2. Create one work project and one personal project.
3. Create an area.
4. Create a task with a due date.
5. Create a waiting task with a person or organization.
6. Mark a task complete and reopen it.
7. Capture a note from mobile width.
8. Convert the capture to a task.
9. Create a vault.
10. Search a title, body phrase, waiting-on name and tag.
11. Confirm the search result states why it matched.
12. Sign out and confirm records are no longer accessible.

## Database policy testing planned

A staging Supabase project is needed for trustworthy end-to-end policy tests. The next hardening increment should create two test users and prove:

- user A cannot select user B's workspace records
- changing a client-supplied workspace ID does not bypass RLS
- anonymous users cannot call `search_records`
- only the owner can remove workspace members or hard-delete records
- private Storage objects cannot be opened without authorization

## Playwright plan

The initial Playwright suite will cover:

- login
- project creation
- task creation and completion
- capture and inbox conversion
- search
- mobile viewport navigation
- sign-out and protected-route redirect

The suite should run against staging, not a production database.
