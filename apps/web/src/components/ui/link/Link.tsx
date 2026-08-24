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
import React, { FC } from "react";
import { mergeMuiProps } from "@/utilites/mergeMuiProps";
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

const linkStyles: MuiLinkProps = {
  sx: {
    textDecoration: "none",
    display: "block",
  },
};

const Link: FC<LinkProps> = ({ children, sx, link, ...otherProps }) => {
  const styles = mergeMuiProps(linkStyles, { sx });
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
        {...styles}
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
      {...styles}
      {...otherProps}
      target={otherProps.target || "_self"}
    >
      {children}
    </MuiLink>
  );
};

export default Link;
