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

      /**
       * One focus ring, everywhere, for keyboard users only.
       *
       * `:focus-visible` rather than `:focus` is what makes this safe to apply
       * this broadly: the browser only matches it when focus arrived from the
       * keyboard, so a clicked button does not sprout an outline.
       *
       * It is set here rather than per component because the failure mode is a
       * component that quietly opts out - the textarea did exactly that with
       * `&:focus-visible { outline: 0 }` and replaced it with a 1px border
       * colour change, which is not a visible focus indicator. A single rule at
       * the baseline means a new component is accessible by default and
       * suppressing the ring has to be deliberate.
       *
       * `primary.dark` gives 7.84:1 against white and 6.64:1 against the
       * darkest surface it lands on, comfortably past the 3:1 that WCAG 1.4.11
       * asks of a focus indicator. 3px with a 2px offset so the ring reads on
       * the 24px-radius buttons this design uses, where a hairline outline
       * disappears into the curve.
       */
      ":focus-visible": {
        outline: `3px solid ${baseTheme.palette.primary.dark}`,
        outlineOffset: 2,
      },

      /**
       * Motion is opt-out at the root, not per animation.
       *
       * The skeleton wave already handled this itself (see `MuiSkeleton`
       * below), but the site has transitions in a dozen `sx` blocks - the nav
       * underline that grows on hover, the filter borders, the card lifts -
       * and each one would have had to remember. This is the standard blanket
       * rule: it keeps the end state of every animation and transition and
       * throws away the travel, so nothing disappears, it just arrives at once.
       *
       * `scroll-behavior` is in here for the same reason: the catalog restores
       * scroll position on a back navigation, and a smooth scroll to a
       * restored offset is exactly the kind of movement this preference is
       * about.
       */
      "@media (prefers-reduced-motion: reduce)": {
        "*, *::before, *::after": {
          animationDuration: "0.01ms !important",
          animationIterationCount: "1 !important",
          transitionDuration: "0.01ms !important",
          scrollBehavior: "auto !important",
        },
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
  /**
   * Skeletons: wave by default, still under `prefers-reduced-motion`.
   *
   * MUI does not check the media query itself - `Skeleton.js` has one
   * `animation: 'none'` branch and it is for `animation={false}` - so a
   * visitor who has asked their system to stop moving things gets a shimmer
   * across every placeholder on the page unless this is here.
   *
   * `animation: "wave"` as a default prop rather than a prop on each skeleton,
   * so the four placeholder components cannot drift apart on it.
   */
  MuiSkeleton: {
    defaultProps: {
      animation: "wave",
    },
    styleOverrides: {
      root: {
        "@media (prefers-reduced-motion: reduce)": {
          "&::after": {
            animation: "none",
          },
          animation: "none",
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
