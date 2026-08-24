"use client";

/**
 * A Client Component for the same reason as Button.tsx: `component={NextLink}`
 * is a function prop, which cannot cross the server/client boundary.
 *
 * The `useState(() => mergeMuiProps(...))` it used to open with is gone
 * though, and that was not just unnecessary: a lazy initialiser runs once, so
 * a later `sx` was silently ignored.
 */
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import React, { FC } from "react";
import {
  cleanUrl,
  parseLinkField,
  type SanityLinkField,
} from "@/components/ui/link/parser";
import { useLocale } from "next-intl";

interface LinkProps
  extends Omit<MuiLinkProps, "href">, Omit<NextLinkProps, "href"> {
  href?: string;
  link?: SanityLinkField | null;
  children?: React.ReactNode;
  scroll?: boolean;
}

/**
 * The two rules every link on the site starts from.
 *
 * Composed through MUI's own `sx` array rather than through a lodash deep
 * merge: later entries win, which is exactly what the merge was emulating - at
 * runtime, on every render. `styled(MuiLink)` would be the other option and is
 * what Textarea and Image use, but it drops the polymorphic `component` prop
 * from the types, and this component's whole job is handing MUI `NextLink`.
 */
const baseSx: SxProps<Theme> = {
  textDecoration: "none",
  display: "block",
};

const withBase = (sx: SxProps<Theme> | undefined): SxProps<Theme> => [
  baseSx,
  ...(Array.isArray(sx) ? sx : [sx]),
];

const Link: FC<LinkProps> = ({ children, sx, link, ...otherProps }) => {
  const locale = useLocale();

  if (!link && !otherProps.href) {
    return null;
  }

  if (link) {
    const passedProps = parseLinkField(link, { locale });

    if (!passedProps.url) {
      return null;
    }

    return (
      <MuiLink
        component={NextLink}
        sx={withBase(sx)}
        {...otherProps}
        href={passedProps.url}
        target={passedProps.target || "_self"}
      >
        {children || passedProps.text || cleanUrl(passedProps.url)}
      </MuiLink>
    );
  }

  return (
    <MuiLink
      component={NextLink}
      sx={withBase(sx)}
      {...otherProps}
      target={otherProps.target || "_self"}
    >
      {children}
    </MuiLink>
  );
};

export default Link;
