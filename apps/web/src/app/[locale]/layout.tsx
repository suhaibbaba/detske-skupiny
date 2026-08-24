import type { Metadata } from "next";
import { Suspense } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "@/theme";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { nunitoClassName } from "@/fonts/nunito";
import { NuqsAdapter } from "nuqs/adapters/next";
import { getMessages, setRequestLocale } from "next-intl/server";
import IntlErrorHandlingProvider from "@/lib/i18n/IntlErrorHandlingProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { DefaultImageProvider } from "@/providers/DefaultImageProvider";
import { locales } from "@/lib/i18n/routing";
import { PageProps } from "@/types";
import { ogLocale, siteContext } from "@/lib/seo/metadata";
import Script from "next/script";

/**
 * Both locales are known up front, so the shell of every route can be
 * prerendered per locale instead of being built per request. Without this,
 * `params` is a dynamic read and Cache Components refuses to prerender
 * anything above it.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * The metadata every route inherits.
 *
 * Only the parts that are the same on every page live here - the title
 * template, the site-wide description, and the Open Graph and Twitter defaults
 * that would otherwise be repeated eight times. Each page supplies its own
 * canonical, hreflang pair and share card on top; see lib/seo/metadata.ts.
 *
 * Every URL below and on the pages is absolute rather than resolved through
 * `metadataBase` - see the note in lib/seo/metadata.ts for why there is none.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  "use cache";
  const { locale } = await params;
  setRequestLocale(locale);
  const { siteName, translate } = await siteContext(locale);

  return {
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
    description: translate("metaDescription"),
    openGraph: {
      type: "website",
      siteName,
      locale: ogLocale(locale),
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
} & PageProps) {
  const { locale } = await params;

  // Hands next-intl the locale for this render. Without it every next-intl
  // call falls back to reading the locale header, which is a dynamic read and
  // would force the whole tree to render per request.
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <head>
        {/*
         * The two hosts every page reaches for, warmed before anything asks.
         *
         * Every image on the site is a `cdn.sanity.io` URL - `<Image>` points
         * `next/image` straight at it rather than at Next's optimizer - so the
         * TLS handshake for that origin is on the critical path of the first
         * paint on every route. `preconnect` does DNS, TCP and TLS up front;
         * `dns-prefetch` is the fallback for browsers that ignore it.
         *
         * MapTiler only matters on the routes that draw a map, and there it is
         * reached late, after the SDK chunk loads. It gets `dns-prefetch`
         * alone: a preconnect held open on a route with no map is a wasted
         * socket, and browsers cap how many they will keep.
         */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://api.maptiler.com" />
      </head>
      <body className={nunitoClassName}>
        <AppRouterCacheProvider>
          <NuqsAdapter>
            <IntlErrorHandlingProvider locale={locale} messages={messages}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <DefaultImageProvider>
                  <Box>
                    {/*
                     * Header and Footer each read Sanity through the cached
                     * data layer. Suspending them separately means neither
                     * waits on the other, and the page shell is emitted before
                     * either resolves.
                     */}
                    <Suspense fallback={null}>
                      <Header locale={locale} />
                    </Suspense>
                    {children}
                    <Suspense fallback={null}>
                      <Footer locale={locale} />
                    </Suspense>
                  </Box>
                </DefaultImageProvider>
              </ThemeProvider>
            </IntlErrorHandlingProvider>
          </NuqsAdapter>
        </AppRouterCacheProvider>
        <Script
          defer
          src="https://api.pirsch.io/pa.js"
          id="pianjs"
          data-code={
            locale === "en"
              ? "WMoqdQxGnE1HVNPl3KhE8rmc8zxh0Ijq"
              : "pxqYRrg0YF8DPBC3yuiEKV4uHjlIZJ29"
          }
        />
      </body>
    </html>
  );
}
