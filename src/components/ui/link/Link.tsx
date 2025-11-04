"use client";

import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";
import React, { FC, useState } from "react";
import { mergeMuiProps } from "@/utilites/mergeMuiProps";
import { type LinkProps as SanityLinkProps } from "sanity-plugin-link-field/component";
import { cleanUrl, parseLinkField } from "@/components/ui/link/parser";
import { useLocale } from "next-intl";

interface LinkProps
  extends Omit<MuiLinkProps, "href">,
    Omit<NextLinkProps, "href"> {
  href?: string;
  link?: SanityLinkProps;
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
  const [styles] = useState(() => mergeMuiProps(linkStyles, { sx }));
  const locale = useLocale();

  if (link) {
    const passedProps = parseLinkField(link, { locale });

    return (
      <MuiLink
        component={NextLink}
        {...styles}
        {...otherProps}
        href={passedProps.url}
        target={passedProps.target}
      >
        {children || passedProps.text || cleanUrl(passedProps.url)}
      </MuiLink>
    );
  }

  return (
    <MuiLink component={NextLink} {...styles} {...otherProps}>
      {children}
    </MuiLink>
  );
};

export default Link;
