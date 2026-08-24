"use client";

import { Box, InputBase } from "@mui/material";
import Search from "@/components/icons/Search";
import Button from "@/components/ui/button";
import { useSchoolFilters } from "@/features/catalog/useSchoolFilters";
import useTranslate from "@/hooks/useTranslate";
import { useEffect, useRef, useState } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "custom.borderSubtle",
    borderRadius: "24px",
    overflow: "hidden",
    width: "100%",
    maxWidth: {
      xs: "100%",
      md: "291px",
    },
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "secondary.dark",
    width: "16px",
    height: "16px",
    ml: "16px",
  },
  input: {
    flex: 1,
    px: "10px",
    fontSize: "14px",
    fontWeight: 500,
    color: "custom.inputBorder",
    "&::placeholder": {
      fontSize: "14px",
      fontWeight: 500,
      color: "custom.inputBorder",
      opacity: 1,
    },
  },
  button: {
    fontSize: "14px",
    fontWeight: 500,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    px: "20px",
    py: "12px",
    border: "none",
    "&:hover, &:focus": {
      border: "none",
    },
  },
} satisfies Record<string, SxProps<Theme>>;

const DEBOUNCE_MS = 400;

const SearchBar = () => {
  const translate = useTranslate();
  const { filters, setName } = useSchoolFilters();

  // The input stays responsive while the committed value lives in the URL.
  const [draft, setDraft] = useState(filters.name);
  const committed = useRef(filters.name);

  // Follow the URL when it changes from somewhere else - the clear-all button,
  // or the back button.
  useEffect(() => {
    if (filters.name !== committed.current) {
      committed.current = filters.name;
      setDraft(filters.name);
    }
  }, [filters.name]);

  const commit = (value: string) => {
    if (value === committed.current) {
      return;
    }

    committed.current = value;
    // setName navigates inside the shared transition, so the list dims rather
    // than disappearing while the server renders the narrowed result.
    setName(value);
  };

  useEffect(() => {
    if (draft === committed.current) {
      return;
    }

    const handle = setTimeout(() => commit(draft), DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.icon}>
        <Search isFilled={true} />
      </Box>
      <InputBase
        sx={styles.input}
        placeholder={translate("searchHere")}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => commit(draft)}
      />
      <Button
        sx={styles.button}
        variant="primary"
        onClick={() => commit(draft)}
      >
        {translate("search")}
      </Button>
    </Box>
  );
};

export default SearchBar;
