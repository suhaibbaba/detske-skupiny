import { useTranslations as useIntlTranslations } from "next-intl";

function useTranslate(namespace = "common") {
  const t = useIntlTranslations(namespace);
  return t;
}

export default useTranslate;
