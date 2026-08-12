import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpenCheck,
  Braces,
  CircleCheckBig,
  ExternalLink,
  Github,
  Lightbulb,
  Play,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Competition entry",
  description:
    "Meet CreditMap, explore its engineering, and follow the fastest judge-ready demo path.",
};

const highlights = [
  { value: "3", label: "verified university pathways" },
  { value: "5", label: "early-credit formats supported" },
  { value: "52", label: "automated academic-engine tests" },
  { value: "0", label: "accounts needed for the demo" },
] as const;

const strengths = [
  {
    icon: Lightbulb,
    eyebrow: "Idea",
    title: "It answers the question students actually have",
    body: "A credit equivalency is only half an answer. CreditMap also shows whether that course advances a specific degree, becomes an elective, overlaps another credit, or needs human verification.",
  },
  {
    icon: Sparkles,
    eyebrow: "Originality",
    title: "One credit becomes a portable what-if experiment",
    body: "The same hypothetical exam can be projected across UF, FIU, and UCF, exposing how institutional rules change its value without pretending the universities are interchangeable.",
  },
  {
    icon: Braces,
    eyebrow: "Engineering",
    title: "Academic logic is deterministic and testable",
    body: "A typed rules engine separates equivalency resolution, duplicate detection, requirement allocation, progress calculation, and recommendations from the user interface and database.",
  },
  {
    icon: Users,
    eyebrow: "Experience",
    title: "Complex rules become a student-sized story",
    body: "A no-login demo, visual degree map, plain-language explanations, dated evidence, and a printable counselor brief move the student from uncertainty to a useful next conversation.",
  },
] as const;

const demoSteps = [
  {
    time: "0:00",
    title: "Load the competition demo",
    body: "Start with five realistic credits and a Finance degree plan—no signup or setup.",
    href: "/start",
    label: "Start demo",
  },
  {
    time: "0:20",
    title: "Find the hidden duplicate",
    body: "See why two earned inputs do not always equal two usable college courses.",
    href: "/plan/demo-plan/credits",
    label: "Inspect credits",
  },
  {
    time: "0:35",
    title: "Trace credit into a degree",
    body: "Expand the visual map to see the requirement rule, matched course, and evidence.",
    href: "/plan/demo-plan/map",
    label: "Open degree map",
  },
  {
    time: "0:55",
    title: "Test a future opportunity",
    body: "Change an exam score and see the projected course, progress gain, and calculation trace.",
    href: "/plan/demo-plan/recommendations",
    label: "Try opportunities",
  },
  {
    time: "1:15",
    title: "Compare one credit across colleges",
    body: "Project AP Macroeconomics across every verified university, then inspect the portability matrix.",
    href: "/compare",
    label: "Compare pathways",
  },
] as const;

const boundaries = [
  "CreditMap is a planning estimate, not an official transfer or degree audit.",
  "Only supported UF, FIU, and UCF Finance pathways currently produce numerical results.",
  "Unverified inputs return “Verification required” instead of a fabricated answer.",
  "Tuition savings stay hidden until institution-specific assumptions are verified.",
] as const;

export default function CompetitionPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--brand-950)] text-white">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-10" aria-hidden="true" />
        <div className="page-shell relative grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-[0.08em] text-[var(--mint-200)] uppercase">
              <Route aria-hidden="true" className="size-3.5" />
              2026 competition entry
            </p>
            <h1 className="mt-6 text-[clamp(2.8rem,7vw,5.2rem)] font-extrabold leading-[0.98] tracking-[-0.06em]">
              Earned credit should come with a map.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
              CreditMap turns AP, CLEP, dual-enrollment, IB, and AICE credit into an explainable estimate of college degree progress—and shows how the answer changes across universities.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink className="bg-[var(--mint-200)] text-[var(--brand-950)] hover:bg-white" href="/start">
                <Play aria-hidden="true" className="size-4 fill-current" />
                Launch the guided demo
              </ButtonLink>
              <ButtonLink
                className="border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/10"
                href="https://github.com/adrianamed1213-sketch/creditmap"
                rel="noreferrer"
                target="_blank"
                variant="secondary"
              >
                <Github aria-hidden="true" className="size-4" />
                View source code
              </ButtonLink>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/15 bg-white/8 p-6 backdrop-blur-sm sm:p-8">
            <p className="text-xs font-bold tracking-[0.09em] text-[var(--mint-200)] uppercase">The problem</p>
            <p className="mt-4 text-2xl font-bold leading-9 tracking-[-0.035em]">
              Students can know what credit they earned and still not know whether it moves them toward graduation.
            </p>
            <div className="my-6 h-px bg-white/15" />
            <p className="leading-7 text-white/68">
              Official policies live across exam tables, transfer rules, catalogs, and degree requirements. CreditMap connects those layers while keeping every conclusion explainable.
            </p>
          </aside>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-white">
        <dl className="page-shell grid grid-cols-2 gap-px py-8 md:grid-cols-4">
          {highlights.map((highlight) => (
            <div className="px-4 py-3 text-center sm:px-6" key={highlight.label}>
              <dt className="text-3xl font-extrabold tracking-[-0.04em] text-[var(--brand-950)] sm:text-4xl">{highlight.value}</dt>
              <dd className="mx-auto mt-1 max-w-36 text-xs font-semibold leading-5 text-[var(--text-muted)] sm:text-sm">{highlight.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="page-shell py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-[0.1em] text-[var(--brand-700)] uppercase">Why CreditMap stands out</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[var(--brand-950)] sm:text-5xl">
            Built around the full student decision—not just a lookup table.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {strengths.map((strength) => {
            const Icon = strength.icon;

            return (
              <article className="rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8" key={strength.title}>
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl bg-[var(--mint-50)] text-[var(--brand-700)]">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <p className="text-xs font-bold tracking-[0.08em] text-[var(--brand-700)] uppercase">{strength.eyebrow}</p>
                </div>
                <h3 className="mt-5 text-xl font-extrabold tracking-[-0.03em] text-[var(--brand-950)] sm:text-2xl">{strength.title}</h3>
                <p className="mt-3 leading-7 text-[var(--text-muted)]">{strength.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--mint-50)]">
        <div className="page-shell py-16 sm:py-24">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold tracking-[0.1em] text-[var(--brand-700)] uppercase">Judge&apos;s quick route</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[var(--brand-950)] sm:text-5xl">See the complete idea in 90 seconds.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-[var(--text-muted)]">Each stop reveals a different layer of the same calculation. The demo data is already loaded when you choose the competition demo.</p>
            </div>
            <ButtonLink className="shrink-0" href="/start">
              Begin at step one
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>

          <ol className="mt-10 grid gap-4 lg:grid-cols-5">
            {demoSteps.map((step) => (
              <li className="flex flex-col rounded-3xl border border-[var(--mint-200)] bg-white p-5" key={step.time}>
                <p className="text-xs font-extrabold tracking-[0.08em] text-[var(--brand-700)] uppercase">{step.time}</p>
                <h3 className="mt-3 font-extrabold leading-6 text-[var(--brand-950)]">{step.title}</h3>
                <p className="mt-2 grow text-sm leading-6 text-[var(--text-muted)]">{step.body}</p>
                <Link className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--brand-700)] hover:underline" href={step.href}>
                  {step.label}
                  <ArrowRight aria-hidden="true" className="size-3.5" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-shell py-16 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-8">
            <div className="grid size-11 place-items-center rounded-2xl bg-[var(--mint-50)] text-[var(--brand-700)]">
              <BookOpenCheck aria-hidden="true" className="size-5" />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.035em] text-[var(--brand-950)]">Evidence is part of the product</h2>
            <p className="mt-3 leading-7 text-[var(--text-muted)]">
              Supported academic records retain an official source, catalog label, verification state, and checked date. The public demo uses reviewed UF, FIU, UCF, and Florida statewide sources.
            </p>
            <Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-700)] hover:underline" href="/about#methodology">
              Review the methodology
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </article>

          <article className="rounded-3xl border border-[var(--line-strong)] bg-[var(--surface-subtle)] p-6 sm:p-8">
            <div className="grid size-11 place-items-center rounded-2xl bg-white text-[var(--brand-700)]">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.035em] text-[var(--brand-950)]">Honest boundaries build trust</h2>
            <ul className="mt-4 space-y-3">
              {boundaries.map((boundary) => (
                <li className="flex gap-3 text-sm leading-6 text-[var(--text-muted)]" key={boundary}>
                  <CircleCheckBig aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--brand-600)]" />
                  {boundary}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <aside className="mt-8 flex flex-col gap-5 rounded-3xl border border-[var(--brand-900)] bg-[var(--brand-950)] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-[var(--mint-200)] uppercase">Built by Adrian Hernandez</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">Explore the implementation, then test the product.</h2>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-4 py-2 text-sm font-bold hover:bg-white/10" href="https://github.com/adrianamed1213-sketch/creditmap" rel="noreferrer" target="_blank">
              Source code
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
            <ButtonLink className="bg-[var(--mint-200)] text-[var(--brand-950)] hover:bg-white" href="/start">
              Try CreditMap
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
        </aside>
      </section>
    </>
  );
}
