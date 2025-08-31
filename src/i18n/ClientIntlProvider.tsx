"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
};

export default function ClientIntlProvider({
  children,
  locale,
  messages,
}: Props) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      getMessageFallback={({ key }) => key}
    >
      {children}
    </NextIntlClientProvider>
  );
}
