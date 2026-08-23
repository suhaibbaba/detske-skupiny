import { ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";

/**
 * Components under test call useLocale()/useTranslations() and read custom
 * palette keys out of the app theme via sx callbacks, so both providers are
 * needed for a representative render.
 *
 * Messages are deliberately sparse - useTranslate() falls back to a humanised
 * key, which keeps these smoke tests independent of the real Sanity dictionary.
 */
export function renderWithIntl(
  ui: ReactNode,
  { locale = "cs", ...options }: { locale?: string } & RenderOptions = {},
) {
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={{ common: {} }}
      onError={() => {}}
      getMessageFallback={({ key }) => key}
    >
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </NextIntlClientProvider>,
    options,
  );
}
