import { useTranslations as useIntlTranslations } from "next-intl";

function useSafeTranslations(namespace?: string) {
  const t = useIntlTranslations(namespace);

  return (key: string) => {
    let result: string;

    try {
      result = t(key);
    } catch {
      return key;
    }

    // next-intl returns the full path if missing
    const fullKey = namespace ? `${namespace}.${key}` : key;

    if (result === fullKey) {
      return key;
    }

    return result;
  };
}

export default useSafeTranslations;
