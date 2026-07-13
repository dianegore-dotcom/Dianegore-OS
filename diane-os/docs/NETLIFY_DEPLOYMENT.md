# Netlify Deployment Guide

## Before connecting the repository

Confirm locally:

```bash
npm run verify
```

Commit the repository to a personal GitHub account or organization controlled by Diane. Do not commit `.env.local`.

## Create the site

1. In Netlify, choose **Add new site** and import the GitHub repository.
2. Netlify should read `netlify.toml`.
3. Confirm:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 22
4. Do not add an old, pinned Next.js runtime plugin. Netlify's current adapter is selected automatically.

## Add environment variables

Required for Phase 1:

```text
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_ALLOW_SIGN_UP
```

Use the deployed URL for `NEXT_PUBLIC_APP_URL`.

Future server-only variables can be added when those features exist:

```text
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
OPENAI_RESPONSE_MODEL
OPENAI_EXTRACTION_MODEL
OPENAI_EMBEDDING_MODEL
CRON_SECRET
APP_ENCRYPTION_SECRET
SENTRY_DSN
```

Mark sensitive values as secret where the Netlify UI supports it. Scope production secrets to production. Use separate values for deploy previews if preview data access is enabled later.

## First deploy sequence

1. Temporarily set `NEXT_PUBLIC_ALLOW_SIGN_UP=true`.
2. Deploy.
3. Add the Netlify callback URL to Supabase Auth redirect URLs.
4. Create and confirm the owner account.
5. Sign in and verify Home, Vaults and Capture.
6. Set `NEXT_PUBLIC_ALLOW_SIGN_UP=false`.
7. Trigger a new production deploy.

## Custom domain

1. Add the custom domain in Netlify.
2. Wait for HTTPS certificate issuance.
3. Update `NEXT_PUBLIC_APP_URL`.
4. Update Supabase Site URL and redirect allow-list.
5. Redeploy and test sign-in again.

## Deploy previews

Deploy previews compile the app, but they should not receive production database secrets by default. When preview testing is introduced, use a separate Supabase staging project. Never point untrusted pull requests at production data.

## Rollback

From Netlify Deploys, publish the last known good deploy. Database migrations are not automatically rolled back by a Netlify rollback. Every future migration must include explicit recovery notes in the build ledger.

## Logs to inspect

- Netlify deploy log for build failures
- Netlify function/server log for runtime errors
- Supabase Auth log for sign-in issues
- Supabase Postgres log for policy or query errors

Do not paste secrets or full sensitive record contents into support tickets.
