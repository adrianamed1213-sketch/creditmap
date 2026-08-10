import {
  ArrowRight,
  Check,
  FileSearch,
  GitCompareArrows,
  Route,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { DegreeMapPreview } from "@/components/marketing/degree-map-preview";
import { ButtonLink } from "@/components/ui/button-link";

const steps = [
  {
    number: "01",
    icon: FileSearch,
    title: "Add the credit you earned",
    description: "Search AP, CLEP, IB, AICE, or enter a dual-enrollment course.",
  },
  {
    number: "02",
    icon: GitCompareArrows,
    title: "Resolve the university course",
    description: "A score is checked against institution- and catalog-specific equivalency data.",
  },
  {
    number: "03",
    icon: Route,
    title: "Map it to the degree",
    description: "Rule-based matching shows what may be complete, elective-only, or still remaining.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--line)] bg-white">
        <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="page-shell relative grid gap-14 py-16 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--mint-200)] bg-[var(--mint-50)] px-3 py-1.5 text-xs font-bold tracking-[0.055em] text-[var(--brand-800)] uppercase">
              <Route aria-hidden="true" className="size-3.5" />
              College credit, mapped clearly
            </p>
            <h1 className="mt-6 text-[clamp(2.8rem,7vw,5.3rem)] font-extrabold leading-[0.98] tracking-[-0.06em] text-[var(--brand-950)]">
              See where your college credits can take you.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text-muted)] sm:text-xl">
              Turn AP, CLEP, dual enrollment, IB, and AICE credits into a personalized visual estimate of college degree progress.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/start">
                Build my CreditMap
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
              <ButtonLink href="#how-it-works" variant="secondary">
                See how it works
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[var(--text-muted)]" aria-label="CreditMap principles">
              {[
                "Source-conscious",
                "Rule-based matching",
                "Built for students",
              ].map((item) => (
                <li className="flex items-center gap-1.5" key={item}>
                  <Check aria-hidden="true" className="size-4 text-[var(--brand-600)]" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <DegreeMapPreview />
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--mint-50)]">
        <div className="page-shell flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-[var(--brand-700)] uppercase">Competition demo</p>
            <h2 className="mt-1 text-xl font-extrabold text-[var(--brand-950)]">See the complete idea in about 60 seconds.</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Load five sample credits, find the duplicate, inspect progress, get a recommendation, and compare colleges.</p>
          </div>
          <ButtonLink className="shrink-0" href="/start" variant="secondary">Try the guided demo<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>
        </div>
      </section>

      <section className="page-shell py-20 sm:py-24" id="how-it-works">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.1em] text-[var(--brand-700)] uppercase">How it works</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[var(--brand-950)] sm:text-4xl">
            One path from earned credit to degree progress.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-muted)] sm:text-lg">
            CreditMap keeps equivalency resolution separate from degree matching so every result can be explained and tested.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <li className="rounded-3xl border border-[var(--line)] bg-white p-6" key={step.number}>
                <div className="flex items-center justify-between">
                  <div className="grid size-11 place-items-center rounded-2xl bg-[var(--mint-50)] text-[var(--brand-700)]">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <span className="text-xs font-extrabold tracking-[0.12em] text-[var(--line-strong)]">{step.number}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold tracking-[-0.025em] text-[var(--brand-950)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--brand-950)] text-white">
        <div className="page-shell grid gap-8 py-14 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-white/10">
            <ShieldCheck aria-hidden="true" className="size-6 text-[var(--mint-300)]" />
          </div>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-[-0.035em]">Unknown is better than invented.</h2>
            <p className="mt-2 leading-7 text-white/70">
              If CreditMap cannot support an academic claim with reliable data, it should say “Verification required” instead of guessing.
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-white/25 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--mint-300)]"
            href="/about"
          >
            Read our data standards
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
