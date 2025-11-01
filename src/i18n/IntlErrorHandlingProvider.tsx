"use client";

import { Messages, NextIntlClientProvider } from "next-intl";
import React, { ReactNode } from "react";

interface IntlErrorHandlingProviderProps {
  children: ReactNode;
  messages?: Messages;
  locale?: string;
}

export default function IntlErrorHandlingProvider({
  children,
  messages,
  locale,
}: IntlErrorHandlingProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      // Display the key itself as a fallback message
      getMessageFallback={({ namespace, key }) => key}
      // Suppress the error in the console by returning `undefined`
      onError={() => undefined}
    >
      {children}
    </NextIntlClientProvider>
  );
}
