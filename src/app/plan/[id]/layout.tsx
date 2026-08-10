import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DemoBanner } from "@/components/app/demo-banner";
import { PlanSubnav } from "@/components/app/plan-subnav";

export const metadata: Metadata = { title: "My degree plan" };

export default function PlanLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner />
      <PlanSubnav />
      {children}
    </>
  );
}
