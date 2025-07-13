"use client";
import { createTheme } from "@mui/material/styles";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
});

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1280,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: fredoka.style.fontFamily,
    body1: {
      color: "#6C7685",
    },
    h1: {
      color: "#272E39",
      fontWeight: 600,
      fontSize: 44,
    },
    h2: {
      color: "#272E39",
      fontWeight: 600,
      fontSize: 37,
      lineHeight: 1.5,
    },
    h3: {
      color: "#272E39",
      fontWeight: 600,
      fontSize: 20,
      lineHeight: 1.5,
    },
    h4: {
      color: "#272E39",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: 1.5,
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
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*, *:before, *:after": {
          maxWidth: "100%",
          minWidth: "0",
          minHeight: "0",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: "1280px",
          paddingLeft: "16px",
          paddingRight: "16px",
        },
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
          padding: "14px 26px",
          textTransform: "none",
        },
        outlined: {
          color: "#1E232B",
          fontWeight: 500,
          border: "1px solid",
        },
        outlinedPrimary: {
          fontSize: "14px",
          padding: "10px 20px",
          borderColor: "#9980B0",
          boxShadow: "none",
        },
        outlinedSecondary: {
          padding: "12px 30px",
          fontSize: "16px",
          borderColor: "#EDDDFC",
        },
        text: {
          fontSize: "16px",
          boxShadow: "none",
          padding: "4px",
        },
      },
    },
    MuiAccordion: {
      defaultProps: {
        square: true,
      },
      styleOverrides: {
        root: {
          background:
            "linear-gradient(180deg,rgba(255, 254, 245, 1) 5%, rgba(243, 232, 253, 1) 160%);",
          borderRadius: "24px",
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: "0 24px 24px 48px",
          color: "#6C7685",
          fontSize: "18px",
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          flexDirection: "row-reverse",
          padding: "0 24px",
          gap: "16px",
          ".MuiTypography-root": {
            color: "#001F39",
            fontSize: "20px",
            fontWeight: "600",
          },
        },
        content: {
          "&, &.Mui-expanded": {
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
        },
      },
    },
  },
});

export default theme;
