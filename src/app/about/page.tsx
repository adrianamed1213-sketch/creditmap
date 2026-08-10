import type { Metadata } from "next";
import { BookOpenCheck, Database, ExternalLink, Scale, ShieldCheck } from "lucide-react";

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

        <section className="mt-10 rounded-3xl border border-[var(--mint-200)] bg-[var(--mint-50)] p-6 sm:p-8">
          <p className="text-xs font-bold tracking-[0.08em] text-[var(--brand-700)] uppercase">First verified pathway</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-[var(--brand-950)]">UF Finance BSBA</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--text-muted)]">
            CreditMap checked the live UF Finance, Exam Credit, and General Education catalog pages on August 9, 2026. The live pages do not state a catalog year, so students must still use the policy tied to their matriculation year. FIU, FSU, UCF, USF, and all tuition values remain visibly labeled demo data.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-[var(--brand-700)]">
            <a className="inline-flex items-center gap-1.5 hover:underline" href="https://catalog.ufl.edu/UGRD/colleges-schools/UGBUS/FIN_BSBA/" rel="noreferrer" target="_blank">Finance catalog<ExternalLink aria-hidden="true" className="size-3.5" /></a>
            <a className="inline-flex items-center gap-1.5 hover:underline" href="https://catalog.ufl.edu/UGRD/academic-advising/exam-credit/exam-credit.pdf" rel="noreferrer" target="_blank">Exam credit chart<ExternalLink aria-hidden="true" className="size-3.5" /></a>
            <a className="inline-flex items-center gap-1.5 hover:underline" href="https://catalog.ufl.edu/UGRD/academic-programs/general-education/" rel="noreferrer" target="_blank">General Education<ExternalLink aria-hidden="true" className="size-3.5" /></a>
          </div>
        </section>

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
