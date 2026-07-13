# Troubleshooting

## The app redirects to login repeatedly

Check:

- `NEXT_PUBLIC_SUPABASE_URL` is correct
- the publishable key belongs to the same project
- cookies are allowed in the browser
- the Supabase Auth Site URL and callback URLs match the current app URL
- `src/proxy.ts` remains at the same level as `src/app`

Then sign out, clear only the site's cookies and sign in again.

## Sign-in works but the workspace cannot load

The database migration or user-provisioning trigger may not have run.

In Supabase, confirm rows exist in:

- `profiles`
- `workspaces`
- `workspace_members`

If the auth user was created before the migration, rerunning only the migration is not safe because types and tables already exist. Instead, call the provisioning function from the SQL Editor with the real auth user ID, email and metadata, or apply a corrective migration.

## Creating a record returns an RLS error

Confirm:

- the signed-in user has a `workspace_members` row
- the record's `workspace_id` is the same workspace
- the server action has not been changed to accept `owner_id` from the form
- RLS policies were not partially applied

Do not solve this by disabling RLS.

## Search returns an RPC error

Confirm the migration created `public.search_records` and granted execute to `authenticated`. Confirm the user is signed in and a workspace member.

## Build fails on missing Supabase values

For local production-build verification, provide non-empty values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co \
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=dummy \
npm run build
```

A deployed application requires real values.

## Confirmation email returns to the wrong domain

Update all three places:

- `NEXT_PUBLIC_APP_URL`
- Supabase Auth Site URL
- Supabase redirect allow-list

Then redeploy.

## Netlify deploy succeeds but runtime routes fail

Review the Netlify server logs and confirm environment variables were set before the deploy. Environment changes require a new deploy for browser-exposed values.

## Data safety during errors

A failed page render does not necessarily mean an earlier insert failed. Check the relevant Supabase table before retrying repeatedly. The application uses generated IDs and does not intentionally duplicate a successful form submission, but network retries should still be reviewed.
