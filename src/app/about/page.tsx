import type { Metadata } from "next";
import { BookOpenCheck, Database, Scale, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About and methodology",
  description: "How CreditMap handles academic data, matching, and planning estimates.",
};

const standards = [
  {
    icon: BookOpenCheck,
    title: "Authoritative sources",
    body: "Equivalencies and requirements should come from official institutions, catalogs, exam providers, or state education sources.",
  },
  {
    icon: Database,
    title: "Visible provenance",
    body: "Important academic records retain a source URL, catalog year, verification state, and the date the source was checked.",
  },
  {
    icon: Scale,
    title: "Deterministic rules",
    body: "A testable calculation engine—not an AI model—resolves supported equivalencies and requirement matches.",
  },
  {
    icon: ShieldCheck,
    title: "Honest uncertainty",
    body: "Missing or incomplete evidence produces a verification-required result, never a fabricated academic answer.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-[var(--line)] bg-white">
        <div className="page-shell max-w-4xl py-16 sm:py-24">
          <p className="text-xs font-bold tracking-[0.1em] text-[var(--brand-700)] uppercase">About CreditMap</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.055em] text-[var(--brand-950)] sm:text-6xl">
            A clearer way to understand early college credit.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--text-muted)] sm:text-xl">
            CreditMap is designed to show how credit earned before high school graduation may translate into university courses and apply toward a selected degree.
          </p>
        </div>
      </section>

      <section className="page-shell py-16 sm:py-20" id="methodology">
        <div className="grid gap-4 sm:grid-cols-2">
          {standards.map((standard) => {
            const Icon = standard.icon;

            return (
              <article className="rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-7" key={standard.title}>
                <div className="grid size-11 place-items-center rounded-2xl bg-[var(--mint-50)] text-[var(--brand-700)]">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <h2 className="mt-5 text-xl font-bold tracking-[-0.03em] text-[var(--brand-950)]">{standard.title}</h2>
                <p className="mt-2 leading-7 text-[var(--text-muted)]">{standard.body}</p>
              </article>
            );
          })}
        </div>

        <aside className="mt-10 rounded-3xl border border-[var(--line-strong)] bg-[var(--surface-subtle)] p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[var(--brand-950)]">Planning estimate, not an official audit</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--text-muted)]">
            Universities make final decisions about transfer credit and degree applicability. CreditMap should help students ask better questions and plan earlier, but students must confirm final decisions with the university or an academic adviser.
          </p>
        </aside>
      </section>
    </>
  );
}
