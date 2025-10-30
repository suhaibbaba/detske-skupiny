// providers/DefaultImageClientProvider.tsx
"use client";

import { createContext, useContext } from "react";

const DefaultImageContext = createContext<string>("");

export const useDefaultImage = () => useContext(DefaultImageContext);

export function DefaultImageClientProvider({
  children,
  defaultImageUrl,
}: {
  children: React.ReactNode;
  defaultImageUrl: string;
}) {
  return (
    <DefaultImageContext.Provider value={defaultImageUrl}>
      {children}
    </DefaultImageContext.Provider>
  );
}
