import type { Theme, ThemeOptions } from "@mui/material/styles";
import { alpha } from "@mui/material";
import { nunitoFontFamily } from "@/fonts/nunito";
import CheckedIcon from "@/components/icons/CheckedIcon";
import { baseTheme } from "@/theme/palette";

export const createButtonStyle = ({
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

/** Per-component defaults and style overrides. */
export const components: ThemeOptions["components"] = {
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
        fontFamily: nunitoFontFamily,
      },
      outlined: {
        color: baseTheme.palette.custom.labelStrong,
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
            textColor: baseTheme.palette.custom.labelOnSecondary,
          }),
        },
      },
      {
        props: { variant: "ghost" },
        style: {
          ...createButtonStyle({
            bgColor: baseTheme.palette.common.white,
            hoverBgColor: baseTheme.palette.custom.ghostHover,
            textColor: baseTheme.palette.custom.labelStrong,
            borderColor: baseTheme.palette.custom.ghostHover,
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
          fontFamily: nunitoFontFamily,
        },
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: "0 24px 24px 48px",
        color: baseTheme.palette.custom.textBody,
        fontSize: "20px",
        fontFamily: nunitoFontFamily,
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
        fontFamily: nunitoFontFamily,
        ".MuiAccordionSummary-expandIconWrapper": {
          flexShrink: 0,
        },
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
        fontFamily: nunitoFontFamily,
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
        backgroundColor: baseTheme.palette.primary.light,
        fontFamily: nunitoFontFamily,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: baseTheme.palette.custom.inputBorder,
          transition: "all 0.3s ease",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(baseTheme.palette.common.black, 0.87),
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: baseTheme.palette.custom.inputBorderFocused, // border on focus
          borderWidth: "2px",
        },
      },
      input: {
        "&::placeholder": {
          color: baseTheme.palette.custom.textBody,
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
          border: `0.5px solid ${baseTheme.palette.custom.inputBorder}`,
          borderRadius: "4px",
          backgroundColor: "#EDEEF0",
        },
        "&.Mui-checked .MuiSvgIcon-root": {
          backgroundColor: baseTheme.palette.primary.main,
          borderColor: baseTheme.palette.primary.main,
          color: baseTheme.palette.common.white,
        },
      },
    },
  },
  MuiTypography: {
    // `defaultProps: { fontFamily }` used to sit here. MUI dropped system
    // props from Typography, so it was no longer a style - it was an unknown
    // prop spread onto the DOM node. Typing this object as
    // `ThemeOptions["components"]` is what surfaced that. Nothing changes
    // visually: `typography.fontFamily` already sets Nunito for every variant.
    styleOverrides: {
      root: {
        // Ensure Typography doesn't override Link colors
        "&.MuiLink-root:hover": {
          color: baseTheme.palette.primary.dark,
        },
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        color: baseTheme.palette.primary.main,
        "&:hover": {
          color: baseTheme.palette.primary.dark,
        },
      },
    },
  },
};
