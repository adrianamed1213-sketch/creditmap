# CreditMap

CreditMap helps high school students understand how AP, CLEP, dual-enrollment, IB, and AICE credit may translate into university courses and apply toward a selected college degree.

> CreditMap provides planning estimates, not official transfer or degree-audit decisions. Students should confirm final decisions with their university or academic adviser.

## Problem

Students often know they earned college credit without knowing which course it produces, whether a university accepts it, whether it applies to a major, or whether overlapping credit is being counted twice. CreditMap turns those separate questions into one explainable visual degree map.

## Competition MVP

- guided university and major onboarding;
- no-login 60-second demo flow;
- AP, CLEP, IB, AICE, and dual-enrollment credit entry;
- searchable exam autocomplete and score validation;
- immediate score, deletion, university, and plan recalculation;
- deterministic exam-equivalency resolution;
- specific-course, OR, AND, and minimum-credit requirement rules;
- duplicate-course suppression;
- applicable, elective-only, and verification-required classification;
- visual degree progress grouped by requirement type;
- explainable recommendations tied to remaining requirements;
- five-university comparison using the same student inputs;
- transparent savings estimate and assumptions;
- locally saved dashboard, plan name, recent changes, and settings;
- methodology and read-only data workspace;
- normalized Supabase PostgreSQL schema and RLS policies;
- academic-engine tests covering official score bands, requirement logic, duplicates, and plan changes;
- responsive desktop, tablet, and mobile design.

## Academic-data status

The University of Florida Finance BSBA requirements and supported UF AP/CLEP equivalencies were checked against live official UF catalog sources on August 9, 2026. Each record retains its source URL, checked date, and verification status.

FIU, FSU, UCF, and USF pathways and every tuition value remain **illustrative demo data**. Unknown or manually entered transfer inputs return **Verification required** instead of being guessed. See the [verified UF source record](docs/verified-uf-sources.md).

## Technology stack

- Next.js App Router and React
- strict TypeScript
- Tailwind CSS
- Lucide icons
- Zod validation
- Vitest
- Supabase PostgreSQL and Auth architecture
- Vercel-ready deployment

## Architecture

```text
Pages and components
        ↓
Persistent plan provider
        ↓
Pure academic engine
  ├─ equivalency resolver
  ├─ duplicate detector
  ├─ requirement allocator
  ├─ progress calculator
  └─ recommendation generator
        ↓
Typed academic dataset / PostgreSQL
```

The engine contains no React code and performs no database queries. A complete typed snapshot goes in and an explained plan result comes out. This makes calculations deterministic, testable, and reusable by the dashboard, map, recommendations, and comparison pages.

See [system architecture](docs/architecture/system-overview.md) and [database guide](docs/database.md).

## Project structure

```text
src/
├── app/                         routes, layouts, errors, and pages
├── components/                  reusable product and interface components
├── data/demo-data.ts            visibly labeled competition fixtures
├── features/plans/              local plan persistence and mutations
└── lib/
    ├── academic-engine/         deterministic rules and tests
    ├── supabase/                optional production client setup
    └── utilities

supabase/
├── migrations/                  normalized schema, indexes, and RLS
└── seed/                        structured demo seed

docs/                            architecture, data, database, and demo guides
```

## Local setup

### Prerequisites

- Node.js 20.9 or newer
- pnpm 11
- Git

### Windows PowerShell

If PowerShell blocks `.ps1` launchers, use the `.cmd` forms without changing execution policy:

```powershell
npm.cmd install --global pnpm@11.16.0
cd "C:\path\to\creditmap"
pnpm.cmd install
pnpm.cmd dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other terminals

```bash
pnpm install
pnpm dev
```

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Run every check with:

```bash
pnpm check
```

The test suite covers score thresholds, score changes, specific/OR/AND/credit-count requirements, expected credit, duplicates, electives, deletions, university changes, progress, and recommendations.

## Environment variables

The local competition demo needs no accounts or secrets. For later Supabase persistence, copy `.env.example` to `.env.local` and add:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it in browser code or prefix it with `NEXT_PUBLIC_`.

## Database setup

The migration defines normalized universities, catalog years, programs, program versions, courses, exams, equivalencies, requirement rules, sources, tuition rates, student credits, plans, calculation runs, and results.

Row Level Security ensures authenticated users can access only their own private credits and plans. Academic mutations require an admin or data-reviewer role.

See [database and security guide](docs/database.md).

## Academic-data methodology

Source priority:

1. official university catalog;
2. official registrar or credit-by-exam table;
3. official transfer/admissions policy;
4. Florida state education sources;
5. College Board, CLEP, IB, or Cambridge official sources.

Each official record retains its URL, publisher, catalog-year label, date checked, verification status, and notes. See [academic-data methodology](docs/data-methodology.md) and the [verified UF source record](docs/verified-uf-sources.md).

## Competition demo path

1. Open the landing page.
2. Select **Build my CreditMap**.
3. Select **Load competition demo**.
4. Show the dashboard summary.
5. Open **Credits** and point out the psychology duplicate.
6. Change a score to demonstrate live recalculation, then restore it.
7. Open **Degree map** and expand a requirement.
8. Open **Next steps** to show a requirement-linked recommendation.
9. Open **Compare** to rerun the same credits at five institutions.

See [competition demo script](docs/demo-script.md) for a narrated 60–90 second version.

## Screenshots

Recommended release screenshots:

- landing page with degree-map preview;
- dashboard summary;
- expanded degree requirement;
- duplicate-credit warning;
- comparison page on desktop and mobile.

Final screenshots should be captured after the official academic dataset and deployed URL are ready.

## Current limitations

- only the supported UF Finance and UF exam-credit records are verified; four comparison pathways remain demo-only;
- manual transfer review, Gen Ed category placement, grade/GPA checks, restricted electives, and career-readiness phases remain verification-required;
- all tuition values remain illustrative estimates;
- local demo plans are stored in one browser, not synchronized between devices;
- cloud authentication and persistence require Supabase project credentials;
- comparison results demonstrate architecture, not official institutional policy;
- difficulty, pass rates, admissions, and university quality are not ranked.

## Future improvements

- add verified programs at FIU, FSU, UCF, and USF;
- add archived UF catalog years and matriculation-year selection;
- enable Supabase saved-plan synchronization;
- add catalog-year selection and archived policies;
- add community-college transfer and prerequisite data;
- add semester planning, adviser accounts, and transcript import only after the core data is reliable.

## Congressional App Challenge

CreditMap is built for the Congressional App Challenge. Its central technical feature is an explainable, deterministic academic-matching engine backed by structured, source-conscious data—not an AI model making transfer decisions.

## License

No public license has been selected.
