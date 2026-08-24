import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [`*.school.local`],
  transpilePackages: ["@detske-skupiny/config"],
  // TODO: enable Cache Components. Turning this on fails the build on every
  // content route - all eight of them:
  //   /[locale], /[locale]/articles, /[locale]/articles/[slug],
  //   /[locale]/catalog/[...slug], /[locale]/contact-us, /[locale]/cooperation,
  //   /[locale]/groups, /[locale]/groups/[group]
  // Each one reads Sanity outside a <Suspense> boundary (the pages themselves,
  // plus the shared next-intl dictionary fetch in [locale]/layout.tsx), so
  // adopting it means deciding what is cached and what streams - a data-layer
  // change, not an upgrade fix.
  cacheComponents: false,
};

// Pass the path to your i18n request config
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
