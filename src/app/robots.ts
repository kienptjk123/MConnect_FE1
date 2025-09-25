import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/verify-forgot-password",
        "/blog",
        "/blog/*",
        "/contact",
        "/course",
        "/course/*",
        "/forum",
      ],
      disallow: [
        "/manage/*",
        "/api/*",
        "/refresh-token",
        "/admin/*",
        "/mentee/*",
        "/mentor/*",
        "/staff/*",
      ],
    },
    sitemap: "https://mconnect.io.vn/sitemap.xml",
  };
}
