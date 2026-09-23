# CLAUDE.md

<!-- supabase-explicit-grants-rule v1 -->
## Supabase: explicit grants on every new table (required from Oct 30, 2026)

Starting 2026-10-30, Supabase no longer auto-grants Data API access to new tables in the
`public` schema. The service_role key bypasses RLS but it does NOT bypass grants. A new table
with no grants returns `permission denied` to supabase-py, supabase-js, and PostgREST, which
means Railway workers and pipelines fail on that table.

Whenever you create a table or view in `public` (migration file, apply_migration, a SQL
script, the SQL editor, or code that runs CREATE TABLE), put the grants in the SAME
migration or statement block as the CREATE:

```sql
-- Backend-only table (pipelines, workers, Railway services): service_role only
grant select, insert, update, delete on public.<table> to service_role;

-- Add ONLY if browser/client code with the anon or user key reads or writes this table:
grant select on public.<table> to anon;
grant select, insert, update, delete on public.<table> to authenticated;
```

Rules:
- Default to service_role only. Grant anon or authenticated only when client-side code
  actually needs the table, and pair those grants with RLS policies.
- If inserts fail with `permission denied for sequence`, also run
  `grant usage, select on sequence public.<sequence> to service_role;`
- If this repo already has a stricter grant convention (for example revoking anon on every
  table), keep that convention and add the service_role grant alongside it.
- After creating a table, verify before calling it done:
  `select has_table_privilege('service_role', 'public.<table>', 'select');` must return true.
- Never create a table without grants on the assumption that defaults will cover it.
