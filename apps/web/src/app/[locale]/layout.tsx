import type { Metadata } from "next";
import { Suspense } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "@/theme";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Nunito } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next";
import { getMessages, setRequestLocale } from "next-intl/server";
import IntlErrorHandlingProvider from "@/i18n/IntlErrorHandlingProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { DefaultImageProvider } from "@/providers/DefaultImageProvider";
import { getTranslateServer } from "@/hooks/useTranslate";
import { locales } from "@/i18n/routing";
import { PageProps } from "@/types";
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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  "use cache";
  const { locale } = await params;
  setRequestLocale(locale);
  const translate = await getTranslateServer();

  return {
    title: {
      template: `%s | ${translate("metaTitle")}`,
      default: translate("metaTitle"),
    },
    description: translate("metaDescription"),
  };
}

const nunito = Nunito({ subsets: ["latin"] });

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
      <body className={nunito.className}>
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
