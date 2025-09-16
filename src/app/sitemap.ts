import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mconnect.io.vn",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },

    {
      url: "https://mconnect.io.vn/login",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://mconnect.io.vn/register",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://mconnect.io.vn/forgot-password",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://mconnect.io.vn/reset-password",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://mconnect.io.vn/verify-email",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://mconnect.io.vn/verify-forgot-password",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },

    {
      url: "https://mconnect.io.vn/blog",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://mconnect.io.vn/forum",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://mconnect.io.vn/course",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://mconnect.io.vn/contact",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
