import { useTranslations as useIntlTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { camelToDisplayText } from "@/utilites/strings";

export function useTranslate() {
  // Pass empty string or undefined to use root namespace
  const t = useIntlTranslations("common");

  // Not wrapped in `useCallback`: nothing puts this function in a dependency
  // array, so a stable identity bought nothing.
  return (key: string, values?: Record<string, string | number>) => {
    try {
      return t(key, values);
    } catch {
      // Silently return key on any error
      return camelToDisplayText(key);
    }
  };
}

export const getTranslateServer = async () => {
  const locale = await getLocale();
  return await getTranslations({ locale, namespace: "common" });
};

export default useTranslate;
