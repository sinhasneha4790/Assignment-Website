import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Phase 1 lists the built pages; product and category URLs are added in phase 2.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 }];
}
