import type { Metadata } from "next";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "@/theme";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Nunito } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next";
import { getLocale, getMessages } from "next-intl/server";
import { setLocale } from "@/utilites/localeStore";
import IntlErrorHandlingProvider from "@/i18n/IntlErrorHandlingProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { DefaultImageProvider } from "@/providers/DefaultImageProvider";
import { getTranslateServer } from "@/hooks/useTranslate";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
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
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages({ locale });

  setLocale(locale);

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
                    <Header />
                    {children}
                    <Footer />
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
          data-code="pxqYRrg0YF8DPBC3yuiEKV4uHjlIZJ29"
        />
      </body>
    </html>
  );
}
