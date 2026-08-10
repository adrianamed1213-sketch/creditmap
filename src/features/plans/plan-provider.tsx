"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { academicDataset, programForUniversity, samplePlan } from "@/data/demo-data";
import { calculatePlan } from "@/lib/academic-engine/engine";
import type { PlanResult, StudentCredit, StudentPlan } from "@/lib/academic-engine/types";

const STORAGE_KEY = "creditmap.demo-plan.v1";

type PlanContextValue = {
  plan: StudentPlan;
  result: PlanResult;
  hydrated: boolean;
  addCredit: (credit: StudentCredit) => void;
  removeCredit: (creditId: string) => void;
  updateCredit: (credit: StudentCredit) => void;
  setUniversity: (universityId: string) => void;
  setProfileName: (name: string) => void;
  loadDemo: () => void;
  startBlank: (universityId?: string) => void;
};

const PlanContext = createContext<PlanContextValue | null>(null);

function freshDemoPlan(): StudentPlan {
  return JSON.parse(JSON.stringify(samplePlan)) as StudentPlan;
}

function timestamp() {
  return new Date().toISOString();
}

function withChange(plan: StudentPlan, description: string): StudentPlan {
  const now = timestamp();
  return {
    ...plan,
    updatedAt: now,
    recentChanges: [
      { id: `change-${now}-${plan.recentChanges.length}`, description, createdAt: now },
      ...plan.recentChanges,
    ].slice(0, 8),
  };
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<StudentPlan>(freshDemoPlan);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) setPlan(JSON.parse(saved) as StudentPlan);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrationTask);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  }, [hydrated, plan]);

  const result = useMemo(() => calculatePlan(plan, academicDataset), [plan]);

  const value = useMemo<PlanContextValue>(
    () => ({
      plan,
      result,
      hydrated,
      addCredit(credit) {
        setPlan((current) =>
          withChange(
            { ...current, credits: [...current.credits, credit] },
            `Added ${credit.label}`,
          ),
        );
      },
      removeCredit(creditId) {
        setPlan((current) => {
          const credit = current.credits.find((item) => item.id === creditId);
          return withChange(
            { ...current, credits: current.credits.filter((item) => item.id !== creditId) },
            `Removed ${credit?.label ?? "a credit"}`,
          );
        });
      },
      updateCredit(credit) {
        setPlan((current) =>
          withChange(
            {
              ...current,
              credits: current.credits.map((item) => (item.id === credit.id ? credit : item)),
            },
            `Updated ${credit.label}`,
          ),
        );
      },
      setUniversity(universityId) {
        const program = programForUniversity(universityId);
        setPlan((current) =>
          withChange(
            { ...current, universityId, programId: program.id },
            `Changed university to ${academicDataset.universities.find((item) => item.id === universityId)?.shortName ?? universityId}`,
          ),
        );
      },
      setProfileName(name) {
        setPlan((current) => withChange({ ...current, profileName: name.trim() || "My plan" }, "Updated plan name"));
      },
      loadDemo() {
        const demo = freshDemoPlan();
        setPlan(withChange(demo, "Reloaded the competition demo"));
      },
      startBlank(universityId = "uf") {
        const program = programForUniversity(universityId);
        const now = timestamp();
        setPlan({
          id: "demo-plan",
          profileName: "My CreditMap",
          universityId,
          programId: program.id,
          credits: [],
          updatedAt: now,
          recentChanges: [{ id: `change-${now}`, description: "Started a new local plan", createdAt: now }],
        });
      },
    }),
    [hydrated, plan, result],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) throw new Error("usePlan must be used inside PlanProvider");
  return context;
}

export function createCreditId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
