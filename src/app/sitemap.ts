import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://krishnamadhan.com";
  return [
    { url: base, priority: 1 },
    ...profile.projects.map((p) => ({ url: `${base}/projects/${p.slug}`, priority: 0.7 })),
  ];
}
