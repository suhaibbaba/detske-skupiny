"use client";

import Select, {
  type SelectChangeEvent,
  type SelectProps,
} from "@mui/material/Select";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { SxProps, Theme } from "@mui/material/styles";
import { useLocale } from "next-intl";
import useTranslate from "@/hooks/useTranslate";
import { counterpartUrl } from "@/components/ui/language/counterpart";

const EN_DOMAIN = process.env.NEXT_PUBLIC_EN_DOMAIN ?? "localhost";
const CS_DOMAIN = process.env.NEXT_PUBLIC_CS_DOMAIN ?? "localhost";

const styles = {
  select: {
    background: "transparent",
    boxShadow: "none",
    border: "none",
    padding: 0,
    // maxWidth: "140px",
    "& .MuiSelect-select": {
      padding: 0,
      background: "transparent !important",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "6px",
    },
    "& fieldset": {
      border: "none",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiListItemIcon-root": {
      minWidth: "22px",
    },
    "& .MuiSvgIcon-root": {
      color: "custom.textBody",
    },
    "& .MuiTypography-root": {
      color: "white",
    },
  },
} satisfies Record<string, SxProps<Theme>>;

/** `https://en.example.com` for the target domain, on this page's protocol and port. */
const originFor = (targetDomain: string): string => {
  const { protocol, port } = window.location;
  return `${protocol}//${targetDomain}${port ? `:${port}` : ""}`;
};

/**
 * The other language's version of the page being viewed.
 *
 * Reads the page's own `<link rel="alternate" hreflang="...">` first. That tag
 * is emitted by `generateMetadata` from the document's `translation.metadata`
 * pairing, so it is the only thing that knows a school's English slug given
 * its Czech one - the two are unrelated strings in two Sanity documents.
 *
 * Everything else is in counterpart.ts, which is where the fallbacks are
 * tested.
 */
const targetUrl = (fromLocale: string, toLocale: string, domain: string) => {
  const declaredAlternate = document
    .querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${toLocale}"]`,
    )
    ?.getAttribute("href");

  return counterpartUrl({
    declaredAlternate,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    fromLocale,
    toLocale,
    targetOrigin: originFor(domain),
  });
};

const LanguageSwitcher = () => {
  const translate = useTranslate();

  /**
   * The locale next-intl already resolved for this request.
   *
   * Read from next-intl rather than matched out of `window.location.hostname`
   * in an effect: next-intl derives the locale from the same domain on the
   * server and the client, so the control renders the right language from the
   * first frame with no post-hydration flip.
   */
  const currentLocale = useLocale();

  const languages: {
    [key: string]: { domain: string; name: string; flag: string };
  } = {
    en: { domain: EN_DOMAIN, name: "English (US)", flag: "🇬🇧" },
    cs: { domain: CS_DOMAIN, name: "Čeština (CZ)", flag: "🇨🇿" },
  };

  const handleChange = (e: SelectChangeEvent<string>) => {
    const selectedLocale = e.target.value;
    if (selectedLocale === currentLocale) return;

    window.location.href = targetUrl(
      currentLocale,
      selectedLocale,
      languages[selectedLocale].domain,
    );
  };

  return (
    <Select
      value={currentLocale}
      onChange={handleChange}
      displayEmpty
      sx={styles.select}
      // A bare combobox with two flags in it announces as "combobox, English
      // (US)" and nothing about what choosing one would do.
      inputProps={{ "aria-label": translate("languageSwitcherLabel") }}
    >
      {Object.keys(languages).map((key) => {
        const language = languages[key];
        return (
          <MenuItem value={key} key={key}>
            <ListItemIcon>{language.flag}</ListItemIcon>
            <ListItemText primary={language.name} />
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default LanguageSwitcher;
