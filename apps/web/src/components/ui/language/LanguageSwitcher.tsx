"use client";

import Select, {
  type SelectChangeEvent,
  type SelectProps,
} from "@mui/material/Select";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

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

/**
 * Builds a complete URL with protocol, domain, port, path, search params, and hash
 */
const buildUrl = (targetDomain: string): string => {
  if (typeof window === "undefined") return "";

  const protocol = window.location.protocol; // http: or https:
  const port = window.location.port;
  // Build port string (only if port exists)
  const portString = port ? `:${port}` : "";

  return `${protocol}//${targetDomain}${portString}/`;
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
    cs: { domain: CS_DOMAIN, name: "Čeština (CZ)", flag: "🇨🇿" },
  };

  const handleChange = (e: SelectChangeEvent<string>) => {
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
      sx={styles.select}
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
