import { useTranslations as useIntlTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

function useTranslate(namespace = "common") {
  return useIntlTranslations(namespace);
}

export const getTranslateServer = async (locale: string) =>
  await getTranslations({ locale, namespace: "common" });

export default useTranslate;
