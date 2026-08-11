"use client";

import { ArrowRight, Check, FlaskConical, Map, University } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DemoBanner } from "@/components/app/demo-banner";
import {
  academicDataset,
  upcomingUniversities,
  verifiedUniversities,
} from "@/data/demo-data";
import { usePlan } from "@/features/plans/plan-provider";

export default function StartPage() {
  const router = useRouter();
  const { loadDemo, startBlank } = usePlan();
  const [universityId, setUniversityId] = useState("uf");
  const selectedProgram = academicDataset.programs.find(
    (program) => program.universityId === universityId,
  );
  const selectedSource = academicDataset.sources.find(
    (source) => source.id === selectedProgram?.sourceId,
  );
  const selectedIsVerified = selectedSource?.verification === "verified";

  function beginBlank() {
    startBlank(universityId);
    router.push("/plan/demo-plan/credits");
  }

  function beginDemo() {
    loadDemo();
    router.push("/dashboard");
  }

  return (
    <>
      <DemoBanner />
      <section className="page-shell py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.1em] text-[var(--brand-700)] uppercase">Build your first map</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--brand-950)] sm:text-5xl">Start with one decision.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
              Choose a university, then add the credit you have earned or expect to earn. You can change everything later.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[0_20px_50px_rgba(21,55,65,0.08)] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand-900)] text-sm font-bold text-white">1</span>
              <div>
                <h2 className="font-bold text-[var(--brand-950)]">Choose your university</h2>
                <p className="text-sm text-[var(--text-muted)]">UF, FIU, and UCF use reviewed official Finance and exam-credit sources.</p>
              </div>
            </div>

            <fieldset className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <legend className="sr-only">University</legend>
              {verifiedUniversities.map((university) => (
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${
                    universityId === university.id
                      ? "border-[var(--brand-500)] bg-[var(--mint-50)]"
                      : "border-[var(--line)] hover:border-[var(--line-strong)]"
                  }`}
                  key={university.id}
                >
                  <input
                    checked={universityId === university.id}
                    className="size-4 accent-[var(--brand-700)]"
                    name="university"
                    onChange={() => setUniversityId(university.id)}
                    type="radio"
                  />
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white font-extrabold text-[var(--brand-900)] shadow-sm">
                    {university.shortName.slice(0, 3)}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-[var(--brand-950)]">{university.name}</span>
                    <span className="block text-xs text-[var(--text-muted)]">{university.location}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="font-bold text-[var(--brand-950)]">Expansion roadmap:</span>
              {upcomingUniversities.map((university) => (
                <span className="rounded-full border border-[var(--line)] bg-[var(--surface-subtle)] px-2.5 py-1" key={university.id}>
                  {university.shortName} · official data in review
                </span>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] p-4">
              <div className="flex items-start gap-3">
                <University aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--brand-700)]" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-[var(--brand-950)]">{selectedProgram?.name ?? "Finance pathway"}</p>
                    <span className={`rounded-full px-2 py-1 text-[0.65rem] font-bold uppercase ${selectedIsVerified ? "bg-[var(--mint-50)] text-[var(--brand-700)]" : "bg-[var(--warning-soft)] text-[var(--warning-strong)]"}`}>
                      {selectedIsVerified ? "Official sources checked" : "Demo data"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    {selectedIsVerified
                      ? "Finance requirements and supported exam equivalencies link to the live official records used by CreditMap."
                      : "This pathway demonstrates the comparison architecture and must not be used as official academic guidance."}
                  </p>
                </div>
              </div>
            </div>

            <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-900)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--brand-800)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-3" onClick={beginBlank} type="button">
              Continue to add credits
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-[var(--mint-200)] bg-[var(--mint-50)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex gap-3">
              <FlaskConical aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--brand-700)]" />
              <div>
                <h2 className="font-bold text-[var(--brand-950)]">Need the 60-second judge demo?</h2>
                <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">Load a sample student with five credits, including an intentional duplicate.</p>
              </div>
            </div>
            <button className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--brand-500)] bg-white px-4 py-2 text-sm font-bold text-[var(--brand-900)] hover:bg-[var(--surface-subtle)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus)]" onClick={beginDemo} type="button">
              <Map aria-hidden="true" className="size-4" />
              Load competition demo
            </button>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--text-muted)]">
            {["No account required", "Saved on this device", "Editable at any time"].map((item) => (
              <li className="flex items-center gap-1.5" key={item}><Check aria-hidden="true" className="size-4 text-[var(--brand-600)]" />{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
