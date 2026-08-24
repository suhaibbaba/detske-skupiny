import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [`*.school.local`],
  transpilePackages: ["@detske-skupiny/config"],
  // Every Sanity read now goes through a "use cache" function, and the routes
  // that still depend on request data (searchParams, and the slug segments
  // that have no generateStaticParams) read it below a Suspense boundary.
  cacheComponents: true,
  /**
   * The Sanity project and dataset names, inlined into the client bundle.
   *
   * Only src/sanity/sections/sanityImageUrl.ts reads them there, and only to
   * format `https://cdn.sanity.io/images/<project>/<dataset>/...` - no request
   * is made from the browser with them, and both names are already visible in
   * the text of every image URL the page renders.
   *
   * The data client (lib/sanity/client.ts) is `server-only` and reads the same
   * variables on the server. Doing the exposure here rather than through a
   * NEXT_PUBLIC_ prefix keeps it to one reviewable line instead of a naming
   * convention that is easy to extend by accident.
   */
  env: {
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
  },
};

// Pass the path to your i18n request config
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
