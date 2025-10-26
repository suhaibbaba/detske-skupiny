"use client";

import { NextIntlClientProvider } from "next-intl";
import React from "react";

export default function IntlErrorHandlingProvider({
  children,
  message,
  locale,
}: any) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={message}
      // Display the key itself as a fallback message
      getMessageFallback={({ namespace, key }) =>
        key
      }
      // Suppress the error in the console by returning `undefined`
      onError={() => undefined}
    >
      {children}
    </NextIntlClientProvider>
  );
}
