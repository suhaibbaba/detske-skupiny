import { NextIntlClientProvider } from "next-intl";
import type { Metadata } from "next";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "@/theme";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Fredoka } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next";
import { getLocale } from "next-intl/server";
import { setLocale } from "@/utilites/localeStore";

export const metadata: Metadata = {
  title: "Sousedske Skupinky",
  description: "Sousedske Skupinky",
};

const fredoka = Fredoka({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  setLocale(locale);

  return (
    <html lang={locale}>
      <body className={fredoka.className}>
        <NuqsAdapter>
          <NextIntlClientProvider locale={locale}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Box>
                <Header />
                {children}
                <Footer />
              </Box>
            </ThemeProvider>
          </NextIntlClientProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
