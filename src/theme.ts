"use client";

import { createTheme } from "@mui/material/styles";
import { Fredoka } from "next/font/google";
import { alpha, Theme } from "@mui/material";
import { autoClamp } from "@/utilites/strings";
import CheckedIcon from "@/components/icons/CheckedIcon";

const fredoka = Fredoka({
  subsets: ["latin"],
});

const baseTheme = createTheme({
  cssVariables: true,
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1280,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: "#9980B0",
      light: "#FBF8FE",
      dark: "#5B4C68",
    },
    secondary: {
      main: "#FDFBEB",
      dark: "#B2AD88",
      light: "#FAF3C0",
    },
    gradients: {
      ui1: "linear-gradient(180deg, #F8F2FE 0%,  #F8F2FE 45%, #FCF8E5 100%)",
      ui2: "linear-gradient(90deg, #F9F4F6 0%, #FCF7E8 100%)",
      ui3: "linear-gradient(90deg, #FCF8E5 0%, #F8F2FE 100%)",
    },
    custom: {
      ui1: "#1E232B",
      ui2: "#848C99",
      ui3: "#6C7685",
      ui4: "#9980B0",
      ui5: "#F3E8FD",
      ui6: "#FACA15",
      ui7: "#FCF7D5",
      ui8: "#2B3746",
      ui9: "#FFFEF9",
      ui10: "#C5A4E2",
      ui11: "#776388",
      ui12: "#C6CAD0",
      ui13: "#272E39",
      ui14: "#E5CDFA",
      ui15: "#FDF9E2",
      ui16: "#0F1724",
      ui17: "#EDDDFC",
      ui18: "#AAB0B9",
      ui19: "#8A866A",
    },
    shadows: {
      ui1: "0px 4px 6px 0px #0000000D, 0px 10px 15px -3px  #0000001A",
    },
    common: {
      black: "#000000",
      white: "#FFFFFF",
    },
  },
});

const createButtonStyle = ({
  bgColor,
  textColor,
  hoverBgColor,
  borderColor,
  hoverBorderColor,
}: {
  bgColor: string;
  textColor: string;
  hoverBgColor: string;
  borderColor?: string;
  hoverBorderColor?: string;
}) => {
  return {
    backgroundColor: bgColor,
    color: textColor,
    boxShadow:
      "0px 4px 6px 0px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${borderColor || bgColor}`,
    "&:hover": {
      backgroundColor: hoverBgColor,
      border: `1px solid ${hoverBorderColor || hoverBgColor}`,
    },
  };
};

const theme = createTheme(baseTheme, {
  typography: {
    fontFamily: fredoka.style.fontFamily,
    body1: {
      color: "#6C7685",
    },
    h1: {
      color: "#272E39",
      fontWeight: 600,
      fontSize: autoClamp({
        desktop: 48,
        tablet: 40,
        mobile: 36,
        theme: baseTheme,
      }),
    },
    h2: {
      color: "#272E39",
      fontWeight: 600,
      fontSize: autoClamp({
        desktop: 32,
        tablet: 30,
        mobile: 28,
        theme: baseTheme,
      }),
      lineHeight: 1.5,
    },
    h3: {
      color: "#272E39",
      fontWeight: 600,
      fontSize: 24,
      lineHeight: 1.5,
    },
    h4: {
      color: "#272E39",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: 1.5,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          paddingLeft: 16, // fallback for xs
          paddingRight: 16,
          [theme.breakpoints.up("sm")]: {
            paddingLeft: 16,
            paddingRight: 16,
          },
          [theme.breakpoints.up("lg")]: {
            paddingLeft: 16,
            paddingRight: 16,
          },
        }),
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "*, *:before, *:after": {
          maxWidth: "100%",
          minWidth: "0",
          minHeight: "0",
          letterSpacing: 0,
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        fontFamily: fredoka.style.fontFamily,
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: {
          boxShadow:
            "0px 4px 6px 0px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
          borderRadius: "24px",
          padding: "14px 20px",
          textTransform: "capitalize",
          fontWeight: 500,
          fontSize: 16,
          lineHeight: "16px",
          fontFamily: fredoka.style.fontFamily,
        },
        outlined: {
          color: baseTheme.palette.custom.ui1,
          border: "1px solid",
        },
        text: {
          fontSize: "16px",
          boxShadow: "none",
          padding: "4px",
        },
      },
      variants: [
        {
          props: { variant: "primary" },
          style: {
            ...createButtonStyle({
              bgColor: baseTheme.palette.primary.main,
              hoverBgColor: baseTheme.palette.primary.dark,
              textColor: baseTheme.palette.common.white,
            }),
          },
        },
        {
          props: { variant: "secondary" },
          style: {
            ...createButtonStyle({
              bgColor: baseTheme.palette.secondary.light,
              hoverBgColor: baseTheme.palette.secondary.dark,
              textColor: baseTheme.palette.custom.ui16,
            }),
          },
        },
        {
          props: { variant: "ghost" },
          style: {
            ...createButtonStyle({
              bgColor: baseTheme.palette.common.white,
              hoverBgColor: baseTheme.palette.custom.ui17,
              textColor: baseTheme.palette.custom.ui1,
              borderColor: baseTheme.palette.custom.ui17,
            }),
          },
        },
      ],
    },
    MuiAccordion: {
      defaultProps: {
        square: true,
      },
      styleOverrides: {
        root: {
          "&.Mui-expanded": {
            background:
              "linear-gradient(180deg, rgba(255, 254, 245, 1) 5%, rgba(243, 232, 253, 1) 160%)",
            marginBottom: 0,
          },
          borderRadius: "24px",
          boxShadow: "none",
          "&:before": {
            display: "none",
            fontFamily: fredoka.style.fontFamily,
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: "0 24px 24px 48px",
          color: "#6C7685",
          fontSize: "20px",
          fontFamily: fredoka.style.fontFamily,
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          flexDirection: "row-reverse",
          padding: "0 24px",
          gap: "16px",
          minHeight: "initial",
          ".MuiTypography-root": {
            color: "#001F39",
            fontSize: "20px",
            fontWeight: "600",
          },
          fontFamily: fredoka.style.fontFamily,
        },
        content: {
          "&.Mui-expanded": {
            margin: "24px 0",
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow:
            "0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          fontFamily: fredoka.style.fontFamily,
        },
      },
    },
    MuiTableCell: {
      defaultProps: {
        align: "center",
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#FBF8FE",
          fontFamily: fredoka.style.fontFamily,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: baseTheme.palette.custom.ui2,
            transition: "all 0.3s ease",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(baseTheme.palette.common.black, 0.87),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: baseTheme.palette.custom.ui4, // border on focus
            borderWidth: "2px",
          },
        },
        input: {
          "&::placeholder": {
            color: baseTheme.palette.custom.ui3,
            opacity: 1,
            fontSize: 14,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "&.rounded .MuiOutlinedInput-notchedOutline": {
            borderRadius: "24px",
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          gap: "8px",
          "& .MuiCheckbox-root": {
            flexShrink: 0,
          },
          "& .MuiFormControlLabel-label": {
            overflowWrap: "break-word",
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        checkedIcon: CheckedIcon,
      },
      styleOverrides: {
        root: {
          borderRadius: "4px",
          "&.MuiCheckbox-sizeSmall": {
            padding: "0 8px",
          },
          "&.MuiCheckbox-sizeSmall .MuiSvgIcon-root": {
            width: "16px",
            height: "16px",
          },
          "& .MuiSvgIcon-root": {
            color: "transparent",
            border: "0.5px solid #848C99",
            borderRadius: "4px",
            backgroundColor: "#EDEEF0",
          },
          "&.Mui-checked .MuiSvgIcon-root": {
            backgroundColor: "#9980B0",
            borderColor: "#9980B0",
            color: "#fff",
          },
        },
      },
    },
  },
});

export default theme;
