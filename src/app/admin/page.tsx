import { Database, ExternalLink, FileCheck2, LockKeyhole, School, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DemoBanner } from "@/components/app/demo-banner";
import { PageHeading } from "@/components/app/page-heading";
import { academicDataset } from "@/data/demo-data";

export const metadata: Metadata = { title: "Data workspace" };

export default function AdminPage() {
  const cards = [
    { label: "Universities", value: academicDataset.universities.length, icon: School },
    { label: "Programs", value: academicDataset.programs.length, icon: FileCheck2 },
    { label: "Exams", value: academicDataset.exams.length, icon: Database },
    { label: "Equivalencies", value: academicDataset.equivalencies.length, icon: ShieldCheck },
  ];
  return <><DemoBanner /><section className="page-shell py-10 sm:py-14"><PageHeading eyebrow="Data workspace" title="Academic data inventory" description="A read-only view of the current structured demo records. Production changes use reviewed migrations and seed imports, not edits hidden inside page components." />
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map((card) => { const Icon = card.icon; return <article className="rounded-2xl border border-[var(--line)] bg-white p-5" key={card.label}><Icon aria-hidden="true" className="size-5 text-[var(--brand-700)]" /><p className="mt-4 text-3xl font-extrabold text-[var(--brand-950)]">{card.value}</p><p className="mt-1 text-xs font-bold tracking-[0.06em] text-[var(--text-muted)] uppercase">{card.label}</p></article>; })}</div>
    <section className="mt-6 rounded-3xl border border-[var(--line)] bg-white p-6"><div className="flex gap-3"><LockKeyhole aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--brand-700)]" /><div><h2 className="text-lg font-extrabold text-[var(--brand-950)]">Production publishing is protected</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">The included PostgreSQL schema assigns admin roles, enables Row Level Security, and separates draft/demo/verified records. This public demo intentionally has no academic-data mutation controls.</p></div></div></section>
    <section className="mt-6 overflow-hidden rounded-3xl border border-[var(--line)] bg-white"><div className="border-b border-[var(--line)] px-5 py-4"><h2 className="font-extrabold text-[var(--brand-950)]">Current sources</h2></div>{academicDataset.sources.map((source) => <div className="grid gap-3 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center" key={source.id}><div><p className="font-bold text-[var(--brand-950)]">{source.title}</p><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{source.notes}</p></div><span className="w-fit rounded-full bg-[var(--warning-soft)] px-3 py-1.5 text-xs font-bold text-[var(--warning-strong)] uppercase">{source.verification}</span></div>)}</section>
    <Link className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-700)] hover:underline" href="/about#methodology">Review the data methodology<ExternalLink aria-hidden="true" className="size-4" /></Link>
  </section></>;
}
