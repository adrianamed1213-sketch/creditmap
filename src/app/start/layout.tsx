import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Build your CreditMap" };

export default function StartLayout({ children }: { children: ReactNode }) { return children; }
