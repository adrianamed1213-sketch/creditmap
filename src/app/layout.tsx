import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PlanProvider } from "@/features/plans/plan-provider";
import { product } from "@/lib/product";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CreditMap — See where your college credits can take you",
    template: "%s | CreditMap",
  },
  description: product.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body>
        <a className="print-hidden skip-link" href="#main-content">
          Skip to main content
        </a>
        <PlanProvider>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </PlanProvider>
      </body>
    </html>
  );
}
