import type { MetadataRoute } from "next";

const routes = [
  "",
  "/start",
  "/dashboard",
  "/plan/demo-plan/map",
  "/plan/demo-plan/recommendations",
  "/compare",
  "/competition",
  "/about",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-12T00:00:00-04:00");

  return routes.map((route) => ({
    url: `https://creditmap-eta.vercel.app${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/start" || route === "/competition" ? 0.9 : 0.7,
  }));
}
