import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PlanProvider } from "@/features/plans/plan-provider";
import { product } from "@/lib/product";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://creditmap-eta.vercel.app"),
  title: {
    default: "CreditMap — See where your college credits can take you",
    template: "%s | CreditMap",
  },
  description: product.description,
  applicationName: product.name,
  authors: [{ name: "Adrian Hernandez" }],
  creator: "Adrian Hernandez",
  category: "education",
  keywords: [
    "college credit",
    "degree planning",
    "AP credit",
    "CLEP credit",
    "dual enrollment",
    "transfer credit",
  ],
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: product.name,
    title: "CreditMap — College credit, mapped clearly",
    description: product.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CreditMap turns early college credit into an explainable degree plan.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CreditMap — College credit, mapped clearly",
    description: product.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#103341",
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
