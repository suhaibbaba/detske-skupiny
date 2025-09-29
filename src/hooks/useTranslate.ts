import { useTranslations as useIntlTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

function useTranslate(namespace = "common") {
  return useIntlTranslations(namespace);
}

export const getTranslateServer = async () => {
  const locale = await getLocale();
  return await getTranslations({ locale, namespace: "common" });
};

export default useTranslate;
