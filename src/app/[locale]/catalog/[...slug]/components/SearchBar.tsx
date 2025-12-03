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

const SearchBar = () => {
  const translate = useTranslate();
  const { commitName, setLocalName, localName } = useSchoolFilters();

  return (
    <Box {...styles.wrapper}>
      <Box {...styles.icon}>
        <Search isFilled={true} />
      </Box>
      <InputBase
        {...styles.input}
        placeholder={translate("searchHere")}
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
        onBlur={() => commitName()}
      />
      <Button {...styles.button} onClick={() => commitName()}>
        {translate("search")}
      </Button>
    </Box>
  );
};

export default SearchBar;
