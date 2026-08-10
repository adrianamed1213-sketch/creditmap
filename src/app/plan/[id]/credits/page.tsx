"use client";

import { AlertTriangle, BookPlus, Check, Pencil, Search, Trash2, X } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { z } from "zod";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { academicDataset } from "@/data/demo-data";
import { createCreditId, usePlan } from "@/features/plans/plan-provider";
import type { CreditSourceType, StudentCourseCredit, StudentExamCredit } from "@/lib/academic-engine/types";

const sources: CreditSourceType[] = ["AP", "CLEP", "DUAL", "IB", "AICE"];

const examSchema = z.object({
  examName: z.string().min(1, "Choose an exam from the suggestions."),
  score: z.coerce.number().finite(),
});

const courseSchema = z.object({
  institution: z.string().min(2, "Enter the institution."),
  courseCode: z.string().min(2, "Enter the course code."),
  courseName: z.string().min(2, "Enter the course name."),
  credits: z.coerce.number().positive().max(12),
  grade: z.string().min(1, "Enter the grade."),
});

export default function CreditsPage() {
  const { plan, result, addCredit, removeCredit, updateCredit } = usePlan();
  const [source, setSource] = useState<CreditSourceType>("AP");
  const [examName, setExamName] = useState("");
  const [score, setScore] = useState("");
  const [status, setStatus] = useState<"earned" | "expected">("earned");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const availableExams = useMemo(
    () => academicDataset.exams.filter((exam) => exam.sourceType === source),
    [source],
  );

  function submitExam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = examSchema.safeParse({ examName, score });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the exam information.");
      return;
    }
    const exam = availableExams.find((item) => item.name.toLowerCase() === parsed.data.examName.toLowerCase());
    if (!exam) {
      setError("Choose an exam from the suggestions so CreditMap can match it safely.");
      return;
    }
    if (parsed.data.score < exam.scoreMin || parsed.data.score > exam.scoreMax) {
      setError(`Enter a score from ${exam.scoreMin} to ${exam.scoreMax}.`);
      return;
    }
    const credit: StudentExamCredit = {
      id: createCreditId("exam"),
      kind: "exam",
      sourceType: exam.sourceType,
      label: exam.name,
      examId: exam.id,
      score: parsed.data.score,
      status,
      createdAt: new Date().toISOString(),
    };
    addCredit(credit);
    setExamName("");
    setScore("");
    setError("");
    setShowForm(false);
  }

  function submitCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = courseSchema.safeParse(Object.fromEntries(data));
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the course information.");
      return;
    }
    const credit: StudentCourseCredit = {
      id: createCreditId("course"),
      kind: "course",
      sourceType: "DUAL",
      label: parsed.data.courseName,
      institution: parsed.data.institution,
      courseCode: parsed.data.courseCode.toUpperCase(),
      courseName: parsed.data.courseName,
      credits: parsed.data.credits,
      grade: parsed.data.grade.toUpperCase(),
      status,
      createdAt: new Date().toISOString(),
    };
    addCredit(credit);
    event.currentTarget.reset();
    setError("");
    setShowForm(false);
  }

  return (
    <section className="page-shell py-10 sm:py-14">
      <PageHeading
        eyebrow="Credit input"
        title="Credits you bring with you"
        description="Add, edit, or remove an exam or dual-enrollment course. Your degree map recalculates after every change."
        action={
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-900)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[var(--brand-800)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus)]" onClick={() => setShowForm((value) => !value)} type="button">
            {showForm ? <X aria-hidden="true" className="size-4" /> : <BookPlus aria-hidden="true" className="size-4" />}
            {showForm ? "Close form" : "Add credit"}
          </button>
        }
      />

      {showForm && (
        <div className="mt-8 rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[0_16px_45px_rgba(21,55,65,0.07)] sm:p-7">
          <fieldset>
            <legend className="text-sm font-bold text-[var(--brand-950)]">Credit source</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {sources.map((item) => (
                <button
                  aria-pressed={source === item}
                  className={`min-h-10 rounded-xl px-4 text-sm font-bold transition-colors ${source === item ? "bg-[var(--brand-900)] text-white" : "border border-[var(--line)] bg-white text-[var(--text-muted)] hover:bg-[var(--mint-50)]"}`}
                  key={item}
                  onClick={() => { setSource(item); setExamName(""); setScore(""); setError(""); }}
                  type="button"
                >
                  {item === "DUAL" ? "Dual Enrollment" : item}
                </button>
              ))}
            </div>
          </fieldset>

          {source !== "DUAL" ? (
            <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={submitExam}>
              <label className="sm:col-span-2">
                <span className="form-label">Search exam</span>
                <span className="relative mt-2 block">
                  <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3.5 size-4 text-[var(--text-muted)]" />
                  <input className="form-input pl-10" list="creditmap-exams" onChange={(event) => setExamName(event.target.value)} placeholder={`Search ${source} exams`} value={examName} />
                </span>
                <datalist id="creditmap-exams">
                  {availableExams.map((exam) => <option key={exam.id} value={exam.name} />)}
                </datalist>
              </label>
              <label>
                <span className="form-label">Score</span>
                <input className="form-input mt-2" inputMode="numeric" onChange={(event) => setScore(event.target.value)} placeholder="Enter score" type="number" value={score} />
              </label>
              <label>
                <span className="form-label">Credit status</span>
                <select className="form-input mt-2" onChange={(event) => setStatus(event.target.value as "earned" | "expected")} value={status}>
                  <option value="earned">Earned</option>
                  <option value="expected">Expected / in progress</option>
                </select>
              </label>
              {error && <p className="form-error sm:col-span-2" role="alert"><AlertTriangle aria-hidden="true" className="size-4" />{error}</p>}
              <button className="primary-button sm:col-span-2" type="submit"><Check aria-hidden="true" className="size-4" />Add {source} credit</button>
            </form>
          ) : (
            <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={submitCourse}>
              <label className="sm:col-span-2"><span className="form-label">Institution</span><input className="form-input mt-2" name="institution" placeholder="Example: Florida public college" /></label>
              <label><span className="form-label">Course code</span><input className="form-input mt-2 uppercase" name="courseCode" placeholder={`${result.university.shortName}-D-COMP`} /></label>
              <label><span className="form-label">Course name</span><input className="form-input mt-2" name="courseName" placeholder="English Composition" /></label>
              <label><span className="form-label">Credits</span><input className="form-input mt-2" defaultValue="3" min="0.5" name="credits" step="0.5" type="number" /></label>
              <label><span className="form-label">Grade</span><input className="form-input mt-2 uppercase" name="grade" placeholder="A" /></label>
              <label className="sm:col-span-2"><span className="form-label">Credit status</span><select className="form-input mt-2" onChange={(event) => setStatus(event.target.value as "earned" | "expected")} value={status}><option value="earned">Earned</option><option value="expected">Expected / in progress</option></select></label>
              <p className="rounded-xl bg-[var(--warning-soft)] p-3 text-xs leading-5 text-[var(--warning-strong)] sm:col-span-2">For this demo, use a supported illustrative code such as <strong>{result.university.shortName}-D-COMP</strong>. Unknown manual courses correctly return “Verification required.”</p>
              {error && <p className="form-error sm:col-span-2" role="alert"><AlertTriangle aria-hidden="true" className="size-4" />{error}</p>}
              <button className="primary-button sm:col-span-2" type="submit"><Check aria-hidden="true" className="size-4" />Add dual-enrollment course</button>
            </form>
          )}
        </div>
      )}

      <div className="mt-9">
        {plan.credits.length === 0 ? (
          <EmptyState icon={BookPlus} title="Add your first credit" description="Add an AP, CLEP, dual-enrollment, IB, or AICE credit to start building your degree map." action={<button className="primary-button mx-auto" onClick={() => setShowForm(true)} type="button">Add credit</button>} />
        ) : (
          <div className="space-y-3">
            {result.resolvedCredits.map((resolved) => {
              const currentCredit = resolved.credit;
              const examMetadata = currentCredit.kind === "exam"
                ? academicDataset.exams.find((exam) => exam.id === currentCredit.examId)
                : undefined;
              return (
              <article className="rounded-2xl border border-[var(--line)] bg-white p-4 sm:p-5" key={resolved.credit.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--mint-50)] px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.06em] text-[var(--brand-700)] uppercase">{resolved.credit.sourceType}</span>
                      <span className="text-xs font-semibold text-[var(--text-muted)]">{resolved.credit.status === "earned" ? "Earned" : "Expected"}</span>
                      {resolved.duplicateOfCreditId && <span className="rounded-full bg-[var(--warning-soft)] px-2.5 py-1 text-[0.6875rem] font-bold text-[var(--warning-strong)] uppercase">Duplicate overlap</span>}
                    </div>
                    <h2 className="mt-2 text-lg font-bold text-[var(--brand-950)]">{resolved.credit.label}</h2>
                    {resolved.credit.kind === "exam" ? (
                      <label className="mt-2 inline-flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        Score
                        <input
                          aria-label={`Score for ${resolved.credit.label}`}
                          className="w-20 rounded-lg border border-[var(--line-strong)] px-2 py-1.5 text-[var(--brand-950)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus)]"
                          max={examMetadata?.scoreMax}
                          min={examMetadata?.scoreMin}
                          onChange={(event) => {
                            const currentCredit = resolved.credit;
                            if (currentCredit.kind === "exam") {
                              updateCredit({ ...currentCredit, score: Number(event.target.value) });
                            }
                          }}
                          type="number"
                          value={resolved.credit.score}
                        />
                        <Pencil aria-hidden="true" className="size-3.5" />
                      </label>
                    ) : (
                      <p className="mt-1 text-sm text-[var(--text-muted)]">{resolved.credit.institution} · {resolved.credit.courseCode} · {resolved.credit.credits} credits · Grade {resolved.credit.grade}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {resolved.courses.length > 0 ? resolved.courses.map((course) => (
                        <span className="rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] px-2.5 py-1.5 text-xs font-semibold text-[var(--brand-950)]" key={`${course.courseCode}-${course.sourceCreditId}`}>
                          {course.courseCode} · {course.credits} credits
                        </span>
                      )) : <span className="text-sm font-semibold text-[var(--warning-strong)]">Verification required</span>}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">{resolved.note}</p>
                  </div>
                  <button aria-label={`Remove ${resolved.credit.label}`} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-3 text-sm font-semibold text-[var(--text-muted)] hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus)]" onClick={() => removeCredit(resolved.credit.id)} type="button">
                    <Trash2 aria-hidden="true" className="size-4" />Remove
                  </button>
                </div>
              </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
