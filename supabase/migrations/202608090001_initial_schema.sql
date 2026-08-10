create extension if not exists pgcrypto;

create type public.verification_status as enum ('demo', 'unverified', 'in_review', 'verified', 'superseded');
create type public.credit_source_type as enum ('AP', 'CLEP', 'DUAL', 'IB', 'AICE');
create type public.credit_status as enum ('earned', 'expected');
create type public.requirement_rule_type as enum ('specific_course', 'course_any', 'course_all', 'minimum_credits', 'manual_verification');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'My CreditMap' check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'data_reviewer')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table public.data_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  publisher text not null,
  academic_year text,
  checked_at date,
  notes text,
  verification public.verification_status not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.universities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text not null,
  city text,
  state_code text check (state_code is null or char_length(state_code) = 2),
  active boolean not null default true,
  verification public.verification_status not null default 'unverified',
  source_id uuid references public.data_sources(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.academic_years (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities(id) on delete cascade,
  label text not null,
  starts_on date,
  ends_on date,
  is_current boolean not null default false,
  unique (university_id, label),
  check (starts_on is null or ends_on is null or starts_on <= ends_on)
);

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities(id) on delete cascade,
  slug text not null,
  name text not null,
  major_name text not null,
  degree_type text not null,
  active boolean not null default true,
  unique (university_id, slug)
);

create table public.program_versions (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  total_credits numeric(5,2) not null check (total_credits > 0),
  verification public.verification_status not null default 'unverified',
  source_id uuid references public.data_sources(id) on delete set null,
  published_at timestamptz,
  unique (program_id, academic_year_id)
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities(id) on delete cascade,
  course_code text not null,
  normalized_course_code text not null,
  course_name text not null,
  credits numeric(4,2) not null check (credits > 0),
  common_course_number text,
  verification public.verification_status not null default 'unverified',
  source_id uuid references public.data_sources(id) on delete set null,
  unique (university_id, normalized_course_code)
);

create table public.exams (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  source_type public.credit_source_type not null check (source_type <> 'DUAL'),
  name text not null,
  normalized_name text not null,
  score_min numeric(6,2) not null,
  score_max numeric(6,2) not null,
  active boolean not null default true,
  unique (provider, normalized_name),
  check (score_min <= score_max)
);

create table public.exam_equivalencies (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  exam_id uuid not null references public.exams(id) on delete cascade,
  minimum_score numeric(6,2) not null,
  maximum_score numeric(6,2) not null,
  verification public.verification_status not null default 'unverified',
  source_id uuid references public.data_sources(id) on delete set null,
  notes text,
  check (minimum_score <= maximum_score)
);

create table public.exam_equivalency_courses (
  exam_equivalency_id uuid not null references public.exam_equivalencies(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  awarded_credits numeric(4,2) not null check (awarded_credits > 0),
  primary key (exam_equivalency_id, course_id)
);

create table public.requirement_groups (
  id uuid primary key default gen_random_uuid(),
  program_version_id uuid not null references public.program_versions(id) on delete cascade,
  name text not null,
  display_order integer not null default 0,
  unique (program_version_id, name)
);

create table public.degree_requirements (
  id uuid primary key default gen_random_uuid(),
  requirement_group_id uuid not null references public.requirement_groups(id) on delete cascade,
  title text not null,
  description text,
  required_credits numeric(5,2) not null default 0 check (required_credits >= 0),
  display_order integer not null default 0,
  verification public.verification_status not null default 'unverified',
  source_id uuid references public.data_sources(id) on delete set null
);

create table public.requirement_rules (
  id uuid primary key default gen_random_uuid(),
  requirement_id uuid not null references public.degree_requirements(id) on delete cascade,
  rule_type public.requirement_rule_type not null,
  parameters jsonb not null default '{}'::jsonb,
  display_order integer not null default 0
);

create table public.requirement_rule_courses (
  requirement_rule_id uuid not null references public.requirement_rules(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  primary key (requirement_rule_id, course_id)
);

create table public.student_credits (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  source_type public.credit_source_type not null,
  label text not null,
  status public.credit_status not null default 'earned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_exam_details (
  student_credit_id uuid primary key references public.student_credits(id) on delete cascade,
  exam_id uuid not null references public.exams(id) on delete restrict,
  score numeric(6,2) not null
);

create table public.student_course_details (
  student_credit_id uuid primary key references public.student_credits(id) on delete cascade,
  institution text not null,
  course_code text not null,
  course_name text not null,
  credits numeric(4,2) not null check (credits > 0),
  grade text not null,
  common_course_number text
);

create table public.student_plans (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  program_version_id uuid not null references public.program_versions(id) on delete restrict,
  name text not null check (char_length(name) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plan_credit_selections (
  plan_id uuid not null references public.student_plans(id) on delete cascade,
  student_credit_id uuid not null references public.student_credits(id) on delete cascade,
  included boolean not null default true,
  primary key (plan_id, student_credit_id)
);

create table public.plan_runs (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.student_plans(id) on delete cascade,
  engine_version text not null,
  accepted_credits numeric(6,2) not null default 0,
  applicable_credits numeric(6,2) not null default 0,
  elective_credits numeric(6,2) not null default 0,
  progress_percent numeric(5,2) not null default 0 check (progress_percent between 0 and 100),
  created_at timestamptz not null default now()
);

create table public.plan_requirement_results (
  id uuid primary key default gen_random_uuid(),
  plan_run_id uuid not null references public.plan_runs(id) on delete cascade,
  requirement_id uuid not null references public.degree_requirements(id) on delete restrict,
  status text not null check (status in ('completed', 'in_progress', 'remaining', 'verification_required')),
  applied_credits numeric(5,2) not null default 0,
  evidence jsonb not null default '{}'::jsonb,
  unique (plan_run_id, requirement_id)
);

create table public.tuition_rates (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id) on delete cascade,
  residency_category text not null,
  amount_per_credit numeric(10,2) not null check (amount_per_credit >= 0),
  currency_code text not null default 'USD',
  fee_scope text not null,
  verification public.verification_status not null default 'unverified',
  source_id uuid references public.data_sources(id) on delete set null,
  unique (university_id, academic_year_id, residency_category)
);

create index courses_search_idx on public.courses using gin (to_tsvector('simple', course_code || ' ' || course_name));
create index exams_search_idx on public.exams using gin (to_tsvector('simple', name));
create index exam_equivalencies_lookup_idx on public.exam_equivalencies (university_id, exam_id, academic_year_id);
create index requirements_group_order_idx on public.degree_requirements (requirement_group_id, display_order);
create index student_credits_owner_updated_idx on public.student_credits (owner_id, updated_at desc);
create index student_plans_owner_updated_idx on public.student_plans (owner_id, updated_at desc);
create index plan_runs_plan_created_idx on public.plan_runs (plan_id, created_at desc);

create or replace function public.is_creditmap_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role in ('admin', 'data_reviewer')
  );
$$;

revoke all on function public.is_creditmap_admin() from public;
grant execute on function public.is_creditmap_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.data_sources enable row level security;
alter table public.universities enable row level security;
alter table public.academic_years enable row level security;
alter table public.programs enable row level security;
alter table public.program_versions enable row level security;
alter table public.courses enable row level security;
alter table public.exams enable row level security;
alter table public.exam_equivalencies enable row level security;
alter table public.exam_equivalency_courses enable row level security;
alter table public.requirement_groups enable row level security;
alter table public.degree_requirements enable row level security;
alter table public.requirement_rules enable row level security;
alter table public.requirement_rule_courses enable row level security;
alter table public.student_credits enable row level security;
alter table public.student_exam_details enable row level security;
alter table public.student_course_details enable row level security;
alter table public.student_plans enable row level security;
alter table public.plan_credit_selections enable row level security;
alter table public.plan_runs enable row level security;
alter table public.plan_requirement_results enable row level security;
alter table public.tuition_rates enable row level security;

create policy "profiles_owner_all" on public.profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "roles_owner_read" on public.user_roles for select to authenticated using (user_id = auth.uid());

create policy "sources_public_read" on public.data_sources for select to anon, authenticated using (verification in ('demo', 'verified'));
create policy "universities_public_read" on public.universities for select to anon, authenticated using (verification in ('demo', 'verified'));
create policy "academic_years_public_read" on public.academic_years for select to anon, authenticated using (true);
create policy "programs_public_read" on public.programs for select to anon, authenticated using (active);
create policy "program_versions_public_read" on public.program_versions for select to anon, authenticated using (verification in ('demo', 'verified'));
create policy "courses_public_read" on public.courses for select to anon, authenticated using (verification in ('demo', 'verified'));
create policy "exams_public_read" on public.exams for select to anon, authenticated using (active);
create policy "exam_equivalencies_public_read" on public.exam_equivalencies for select to anon, authenticated using (verification in ('demo', 'verified'));
create policy "exam_equivalency_courses_public_read" on public.exam_equivalency_courses for select to anon, authenticated using (true);
create policy "requirement_groups_public_read" on public.requirement_groups for select to anon, authenticated using (true);
create policy "degree_requirements_public_read" on public.degree_requirements for select to anon, authenticated using (verification in ('demo', 'verified'));
create policy "requirement_rules_public_read" on public.requirement_rules for select to anon, authenticated using (true);
create policy "requirement_rule_courses_public_read" on public.requirement_rule_courses for select to anon, authenticated using (true);
create policy "tuition_rates_public_read" on public.tuition_rates for select to anon, authenticated using (verification in ('demo', 'verified'));

create policy "sources_admin_write" on public.data_sources for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());
create policy "universities_admin_write" on public.universities for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());
create policy "academic_years_admin_write" on public.academic_years for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());
create policy "programs_admin_write" on public.programs for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());
create policy "program_versions_admin_write" on public.program_versions for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());
create policy "courses_admin_write" on public.courses for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());
create policy "exams_admin_write" on public.exams for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());
create policy "equivalencies_admin_write" on public.exam_equivalencies for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());
create policy "equivalency_courses_admin_write" on public.exam_equivalency_courses for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());
create policy "requirement_groups_admin_write" on public.requirement_groups for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());
create policy "requirements_admin_write" on public.degree_requirements for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());
create policy "requirement_rules_admin_write" on public.requirement_rules for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());
create policy "requirement_rule_courses_admin_write" on public.requirement_rule_courses for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());
create policy "tuition_rates_admin_write" on public.tuition_rates for all to authenticated using (public.is_creditmap_admin()) with check (public.is_creditmap_admin());

create policy "student_credits_owner_all" on public.student_credits for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "student_exam_owner_all" on public.student_exam_details for all to authenticated
using (exists (select 1 from public.student_credits c where c.id = student_credit_id and c.owner_id = auth.uid()))
with check (exists (select 1 from public.student_credits c where c.id = student_credit_id and c.owner_id = auth.uid()));
create policy "student_course_owner_all" on public.student_course_details for all to authenticated
using (exists (select 1 from public.student_credits c where c.id = student_credit_id and c.owner_id = auth.uid()))
with check (exists (select 1 from public.student_credits c where c.id = student_credit_id and c.owner_id = auth.uid()));
create policy "student_plans_owner_all" on public.student_plans for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "plan_selections_owner_all" on public.plan_credit_selections for all to authenticated
using (exists (select 1 from public.student_plans p where p.id = plan_id and p.owner_id = auth.uid()))
with check (exists (select 1 from public.student_plans p where p.id = plan_id and p.owner_id = auth.uid()));
create policy "plan_runs_owner_all" on public.plan_runs for all to authenticated
using (exists (select 1 from public.student_plans p where p.id = plan_id and p.owner_id = auth.uid()))
with check (exists (select 1 from public.student_plans p where p.id = plan_id and p.owner_id = auth.uid()));
create policy "plan_results_owner_all" on public.plan_requirement_results for all to authenticated
using (exists (select 1 from public.plan_runs r join public.student_plans p on p.id = r.plan_id where r.id = plan_run_id and p.owner_id = auth.uid()))
with check (exists (select 1 from public.plan_runs r join public.student_plans p on p.id = r.plan_id where r.id = plan_run_id and p.owner_id = auth.uid()));
