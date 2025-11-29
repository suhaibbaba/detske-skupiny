import type { Metadata } from "next";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "@/theme";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Fredoka } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next";
import { getLocale, getMessages } from "next-intl/server";
import { setLocale } from "@/utilites/localeStore";
import IntlErrorHandlingProvider from "@/i18n/IntlErrorHandlingProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { DefaultImageProvider } from "@/providers/DefaultImageProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | Sousedske Skupinky",
    default: "Sousedske Skupinky",
  },
  description: "Sousedske Skupinky",
};

const fredoka = Fredoka({ subsets: ["latin"] });

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
      <body className={fredoka.className}>
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
      </body>
    </html>
  );
}
