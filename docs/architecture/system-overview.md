# CreditMap system architecture

## Purpose

CreditMap must be accurate enough to earn trust and simple enough for a student developer to explain. It uses a small number of clear layers instead of microservices or an oversized framework stack.

## System boundary

```text
Browser
  -> Next.js pages and React components
       -> plan state and validated mutations
            -> academic calculation engine
                 -> typed verified/demo data or Supabase PostgreSQL
```

The competition demo stores one plan in browser storage. The included production schema supports Supabase Auth, PostgreSQL persistence, and Row Level Security when cloud credentials are added.

## Pages and components

**What they do:** Display information, collect input, and communicate loading, empty, and error states.

**Why:** Students need an accessible interface, but interface code must not determine academic outcomes.

**Where:** `src/app` and `src/components`.

**Without the boundary:** Requirement logic could become scattered across buttons and pages, making it difficult to test or explain.

## Plan provider

**What it does:** Keeps one student plan, exposes focused add/edit/remove/reset operations, stores the demo locally, and recalculates the result after every mutation.

**Why:** The dashboard, credits, map, recommendations, and comparison must all read the same inputs.

**Where:** `src/features/plans/plan-provider.tsx`.

**Without the boundary:** Each page could drift into a different answer or lose changes during navigation.

## Academic calculation engine

**What it does:** Resolves equivalencies, detects duplicate credit, evaluates requirement rules, allocates courses without double counting, calculates progress, and produces requirement-linked recommendations.

**Why:** Academic results must be deterministic, repeatable, and thoroughly tested.

**Where:** `src/lib/academic-engine`.

**Without the boundary:** The same credit could produce different results on different pages, and decisions would be difficult to audit.

The engine takes a complete typed plan and academic dataset. It does not access React, browser storage, network APIs, or PostgreSQL directly.

## Data layer

**What it does:** Provides structured universities, programs, exams, equivalencies, sources, requirements, and tuition assumptions.

**Why:** Academic data changes separately from calculation rules.

**Where:** `src/data/verified-uf-data.ts` for the reviewed UF slice, `src/data/demo-data.ts` for composition and comparison fixtures, and `supabase/migrations` for production.

**Without the boundary:** Updating an academic year would require rewriting application behavior.

## PostgreSQL and Row Level Security

**What they do:** Store normalized academic records and enforce ownership of private student data.

**Why:** Application checks alone are not sufficient authorization. RLS enforces ownership inside PostgreSQL.

**Where:** `supabase/migrations/202608090001_initial_schema.sql`.

**Without the boundary:** A programming mistake in one request could expose another student's plan.

## Server and client components

Next.js components are server-rendered by default. Components use `use client` only when they require plan state, event handlers, local persistence, or another browser API. Static methodology, admin inventory, and outer layout content stay server-rendered.

## Generated results versus source of truth

Student inputs, equivalencies, and degree requirements are source data. Degree-map results are generated projections. The app recalculates results from the original inputs rather than treating a cached percentage as academic truth.

## Current calculation flow

1. A user adds, edits, or removes a credit.
2. Zod and form constraints validate the input.
3. The plan provider creates the updated typed snapshot.
4. The equivalency resolver produces zero, one, or multiple course equivalents.
5. Duplicate detection marks overlapping equivalent courses.
6. The requirement allocator evaluates specific, OR, AND, and credit-count rules in deterministic priority order.
7. Unused accepted courses become elective-only credit.
8. Progress is calculated from applicable credits.
9. Recommendations work backward from incomplete requirements.
10. Every consuming page receives the same explained result.

At no point does an AI model decide whether an academic requirement is satisfied.
