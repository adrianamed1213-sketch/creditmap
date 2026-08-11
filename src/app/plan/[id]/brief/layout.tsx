import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Plan brief" };

export default function PlanBriefLayout({ children }: { children: ReactNode }) {
  return children;
}
