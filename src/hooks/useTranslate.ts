import { useTranslations as useIntlTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { useCallback } from "react";

export function useTranslate() {
  // Pass empty string or undefined to use root namespace
  const t = useIntlTranslations("common");

  return useCallback(
    (key: string, values?: Record<string, string | number>) => {
      try {
        return t(key, values);
      } catch {
        // Silently return key on any error
        return key;
      }
    },
    [t],
  );
}

export const getTranslateServer = async () => {
  const locale = await getLocale();
  return await getTranslations({ locale, namespace: "common" });
};

export default useTranslate;
