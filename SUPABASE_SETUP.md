# Supabase Setup Guide

## Create the project

Create a new Supabase project in a personal organization controlled by Diane. Use a strong database password and store it in a password manager.

Recommended initial settings:

- Region close to Montréal when available
- Email/password authentication enabled
- Email confirmation enabled for production
- No social providers until needed

## Apply the migration

Open the Supabase SQL Editor, create a new query, paste the complete contents of:

```text
supabase/migrations/202607120001_phase1_foundation.sql
```

Run it once.

Expected result:

- eleven Phase 1 tables are created
- RLS is enabled
- the user-provisioning trigger is installed
- `search_records` is created
- no sample project data is inserted

The migration also provisions any auth user that already exists but does not yet have a Diane OS profile.

## Obtain environment values

From Supabase project settings, copy:

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Publishable key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Do not use the service-role key in any `NEXT_PUBLIC_` variable.

## Configure Auth URLs

For local development, add:

```text
http://localhost:3000/auth/callback
```

For Netlify, add the production callback using the actual domain:

```text
https://YOUR-SITE.netlify.app/auth/callback
```

Also set the Site URL to the production application URL once deployed.

## Create the owner account

1. Set `NEXT_PUBLIC_ALLOW_SIGN_UP=true`.
2. Run the application.
3. Select **Create owner account** on the sign-in page.
4. Confirm the email if confirmation is enabled.
5. Sign in.
6. Confirm the Home page displays.
7. Confirm the Vaults page contains six default vaults.
8. Change `NEXT_PUBLIC_ALLOW_SIGN_UP=false` locally and in Netlify.
9. Redeploy.

## Optional seed data

Run `supabase/seed.sql` only after the owner exists. Every visible example title starts with `[Example]`.

Do not run the seed repeatedly against production because it intentionally inserts another copy.

## Verify RLS manually

In the Table Editor, do not disable RLS. In the SQL Editor, inspect the policies under each Phase 1 table. The browser publishable key should be able to access records only while signed in and only for the user's workspace.

## Storage setup for the next increment

Do not create a public bucket. The document increment will add a private `documents` bucket and matching `storage.objects` policies through a migration so paths and permissions remain reproducible.
