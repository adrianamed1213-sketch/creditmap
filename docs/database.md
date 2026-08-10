# Database and security guide

The production schema lives in `supabase/migrations`. The browser demo does not require Supabase, but the schema is ready to deploy when a project is connected.

## Why the schema is normalized

Universities, programs, catalog versions, courses, exams, equivalencies, requirement rules, sources, and student plans change independently. Separate tables allow a new catalog year or equivalency to be added without rewriting a student plan or one large JSON document.

JSONB is limited to rule parameters and generated evidence, where the shape legitimately varies by rule type.

## Important relationships

```text
University
  ├─ Academic years
  ├─ Courses
  └─ Programs
       └─ Program versions
            └─ Requirement groups
                 └─ Degree requirements
                      └─ Rules ── approved courses

Exam ── equivalency by university/year ── equivalent courses

User ── student credits
User ── plans ── plan runs ── requirement results
```

## Row Level Security

All exposed tables have RLS enabled.

- public users can read only demo or verified academic records;
- authenticated users can read and change only credits and plans they own;
- detail and result-table policies verify ownership through their parent row;
- academic writes require an `admin` or `data_reviewer` role;
- the service-role key must remain server-only.

Without RLS, one missed application check could expose another student’s plan. RLS applies the ownership condition inside PostgreSQL for defense in depth.

## Deploying later

1. Create a Supabase project.
2. Install the Supabase CLI.
3. Link the local folder to the project.
4. Apply the migration.
5. Add the public URL and anonymous key to `.env.local`.
6. Keep the service-role key server-only.
7. Test owner isolation before enabling cloud plan saving.

The local competition demo should remain available as a reliable fallback even after cloud persistence is added.
