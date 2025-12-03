"use client";

import Select, { SelectProps } from "@mui/material/Select";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";

const EN_DOMAIN = process.env.NEXT_PUBLIC_EN_DOMAIN ?? "localhost";
const CZ_DOMAIN = process.env.NEXT_PUBLIC_CZ_DOMAIN ?? "localhost";

interface LanguageSwitcherStyles {
  select?: SelectProps;
  menuItem?: MenuItemProps;
}

const styles: LanguageSwitcherStyles = {
  select: {
    sx: {
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
        color: "var(--mui-palette-custom-ui3)",
      },
      "& .MuiTypography-root": {
        color: "white",
      },
    },
  },
};

/**
 * Builds a complete URL with protocol, domain, port, path, search params, and hash
 */
const buildUrl = (targetDomain: string): string => {
  if (typeof window === "undefined") return "";

  const protocol = window.location.protocol; // http: or https:
  const port = window.location.port;
  const pathname = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;

  // Build port string (only if port exists)
  const portString = port ? `:${port}` : "";

  // Construct the full URL
  return `${protocol}//${targetDomain}${portString}${pathname}${search}${hash}`;
};

const LanguageSwitcher = () => {
  const [currentLocale, setCurrentLocale] = useState<string>("en");

  useEffect(() => {
    // Detect current locale based on domain
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const locale =
        Object.keys(languages).find(
          (key) => languages[key].domain === hostname,
        ) || "en";
      setCurrentLocale(locale);
    }
  }, []);

  const languages: {
    [key: string]: { domain: string; name: string; flag: string };
  } = {
    en: { domain: EN_DOMAIN, name: "English (US)", flag: "🇬🇧" },
    cs: { domain: CZ_DOMAIN, name: "Čeština (CZ)", flag: "🇨🇿" },
  };

  const handleChange = (e: any) => {
    const selectedLocale = e.target.value;
    const targetDomain = languages[selectedLocale].domain;
    const newUrl = buildUrl(targetDomain);

    // Redirect to the new domain while preserving the current path
    window.location.href = newUrl;
  };

  return (
    <Select
      value={currentLocale}
      onChange={handleChange}
      displayEmpty
      {...styles.select}
    >
      {Object.keys(languages).map((key) => {
        const language = languages[key];
        return (
          <MenuItem value={key} key={key} {...styles.menuItem}>
            <ListItemIcon>{language.flag}</ListItemIcon>
            <ListItemText primary={language.name} />
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default LanguageSwitcher;
