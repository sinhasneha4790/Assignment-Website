import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/checkout", "/api/", "/book/manage"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
