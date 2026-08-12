import type { MetadataRoute } from "next";

import { product } from "@/lib/product";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: product.name,
    short_name: product.name,
    description: product.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fafcfb",
    theme_color: "#103341",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
