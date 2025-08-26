import {
  Box,
  BoxProps,
  InputBase,
  InputBaseProps,
  Button,
  ButtonProps,
} from "@mui/material";
import Search from "@/components/icons/Search";

interface SearchBarStyles {
  wrapper?: BoxProps;
  input?: InputBaseProps;
  button?: ButtonProps;
  icon?: BoxProps;
}

const styles: SearchBarStyles = {
  wrapper: {
    sx: (theme) => ({
      display: "flex",
      alignItems: "center",
      border: `1px solid ${theme.palette.custom.ui18}`,
      borderRadius: "24px",
      overflow: "hidden",
      width: "100%",
      maxWidth: {
        xs: "100%",
        sm: "291px",
      },
    }),
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
    sx: (theme) => ({
      flex: 1,
      px: "10px",
      fontSize: "14px",
      fontWeight: 500,
      color: theme.palette.custom.ui2,
      "&::placeholder": {
        fontSize: "14px",
        fontWeight: 500,
        color: theme.palette.custom.ui2,
        opacity: 1,
      },
    }),
    placeholder: "Search here",
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
  return (
    <Box {...styles.wrapper}>
      <Box {...styles.icon}>
        <Search />
      </Box>
      <InputBase {...styles.input} />
      <Button {...styles.button}>Search</Button>
    </Box>
  );
};

export default SearchBar;
