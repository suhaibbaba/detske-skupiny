import type { MetadataRoute } from "next";

const csBase = "https://detskeskupinky.cz";
const enBase = "https://en.detskeskupinky.cz";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${csBase}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      alternates: {
        languages: {
          cs: `${csBase}/`,
          en: `${enBase}/`,
        },
      },
    },
    {
      url: `${enBase}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      alternates: {
        languages: {
          cs: `${csBase}/`,
          en: `${enBase}/`,
        },
      },
    },
    {
      url: `${csBase}/katalog/ceska-republika`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          cs: `${csBase}/katalog/ceska-republika`,
          en: `${enBase}/catalog/ceska-republika`,
        },
      },
    },
    {
      url: `${enBase}/catalog/ceska-republika`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          cs: `${csBase}/katalog/ceska-republika`,
          en: `${enBase}/catalog/ceska-republika`,
        },
      },
    },
    {
      url: `${csBase}/clanky`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
      alternates: {
        languages: {
          cs: `${csBase}/clanky`,
          en: `${enBase}/articles`,
        },
      },
    },
    {
      url: `${enBase}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
      alternates: {
        languages: {
          cs: `${csBase}/clanky`,
          en: `${enBase}/articles`,
        },
      },
    },
    {
      url: `${csBase}/kontakt`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
      alternates: {
        languages: {
          cs: `${csBase}/kontakt`,
          en: `${enBase}/contact-us`,
        },
      },
    },
    {
      url: `${enBase}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
      alternates: {
        languages: {
          cs: `${csBase}/kontakt`,
          en: `${enBase}/contact-us`,
        },
      },
    },
    {
      url: `${csBase}/spoluprace`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
      alternates: {
        languages: {
          cs: `${csBase}/spoluprace`,
          en: `${enBase}/cooperation`,
        },
      },
    },
    {
      url: `${enBase}/cooperation`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
      alternates: {
        languages: {
          cs: `${csBase}/spoluprace`,
          en: `${enBase}/cooperation`,
        },
      },
    },
    {
      url: `${csBase}/ochrana-soukromi`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.1,
      alternates: {
        languages: {
          cs: `${csBase}/ochrana-soukromi`,
          en: `${enBase}/privacy-policy`,
        },
      },
    },
    {
      url: `${enBase}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.1,
      alternates: {
        languages: {
          cs: `${csBase}/ochrana-soukromi`,
          en: `${enBase}/privacy-policy`,
        },
      },
    },
  ];
}
