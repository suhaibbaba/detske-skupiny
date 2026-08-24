"use client";

import {
  Box,
  BoxProps,
  InputBase,
  InputBaseProps,
  ButtonProps,
} from "@mui/material";
import Search from "@/components/icons/Search";
import Button from "@/components/ui/button";
import { useSchoolFilters } from "@/hooks/useSchoolFilters";
import useTranslate from "@/hooks/useTranslate";
import { useEffect, useRef, useState } from "react";

interface SearchBarStyles {
  wrapper?: BoxProps;
  input?: InputBaseProps;
  button?: ButtonProps;
  icon?: BoxProps;
}

const styles: SearchBarStyles = {
  wrapper: {
    sx: {
      display: "flex",
      alignItems: "center",
      border: `1px solid var(--mui-palette-custom-ui18)`,
      borderRadius: "24px",
      overflow: "hidden",
      width: "100%",
      maxWidth: {
        xs: "100%",
        md: "291px",
      },
    },
  },
  icon: {
    sx: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "secondary.dark",
      width: "16px",
      height: "16px",
      ml: "16px",
    },
  },
  input: {
    sx: {
      flex: 1,
      px: "10px",
      fontSize: "14px",
      fontWeight: 500,
      color: "var(--mui-palette-custom-ui2)",
      "&::placeholder": {
        fontSize: "14px",
        fontWeight: 500,
        color: "var(--mui-palette-custom-ui2)",
        opacity: 1,
      },
    },
  },
  button: {
    variant: "primary",
    sx: {
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
  },
};

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
    <Box {...styles.wrapper}>
      <Box {...styles.icon}>
        <Search isFilled={true} />
      </Box>
      <InputBase
        {...styles.input}
        placeholder={translate("searchHere")}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => commit(draft)}
      />
      <Button {...styles.button} onClick={() => commit(draft)}>
        {translate("search")}
      </Button>
    </Box>
  );
};

export default SearchBar;
