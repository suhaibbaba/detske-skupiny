import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import createBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [`*.school.local`],
  transpilePackages: ["@detske-skupiny/config", "@detske-skupiny/types"],
  // Every Sanity read now goes through a "use cache" function, and the routes
  // that still depend on request data (searchParams, and the slug segments
  // that have no generateStaticParams) read it below a Suspense boundary.
  cacheComponents: true,

  /**
   * The React Compiler memoizes components and hook results automatically.
   *
   * Kept on because the build cost measured small on this app (see
   * docs/perf-after-phase6.md) and it removes the need for hand-written
   * `useMemo`/`useCallback` - several of which this codebase had wrapped
   * around work cheaper than the memo itself.
   */
  reactCompiler: true,
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

  /**
   * Sanity is the only host the site renders images from.
   *
   * `components/ui/image/Image.tsx` hands `next/image` a loader that points
   * straight at Sanity's CDN, and a custom loader does not consult this list -
   * so on the path the app actually uses, this is belt and braces. It matters
   * for anything that reaches for `next/image` directly, where the built-in
   * optimizer would otherwise refuse a `cdn.sanity.io` URL outright.
   *
   * `pathname` is scoped to the images route rather than left open: nothing
   * should be able to point the optimizer at an arbitrary Sanity path.
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
    // AVIF first, WebP second, original last - the same order the built-in
    // optimizer uses, stated explicitly so it survives a Next default change.
    formats: ["image/avif", "image/webp"],
  },
};

// Pass the path to your i18n request config
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * `ANALYZE=true npm run build -w apps/web` writes a treemap of the client
 * bundle to `.next/analyze/`.
 *
 * Off by every other run: the plugin only wraps the config when the variable
 * is set, so a normal build is byte-for-byte what it was.
 *
 * One caveat, and it decides which command to reach for. `next build` uses
 * Turbopack, and @next/bundle-analyzer is a **webpack** plugin - under
 * Turbopack it prints a warning and produces nothing. So there are two ways to
 * read this bundle, and they answer different questions:
 *
 *   ANALYZE=true npm run build -w apps/web -- --webpack
 *       The webpack build, analysed by webpack-bundle-analyzer. Module sizes
 *       are real, chunk boundaries are webpack's - not what ships.
 *
 *   npx next experimental-analyze -o
 *       Turbopack's own analyzer, over the bundle the app actually ships.
 *       This is the one whose numbers belong in a report.
 *
 * See docs/perf/mui-v9-before.md for the figures each produced.
 */
const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(withNextIntl(nextConfig));
