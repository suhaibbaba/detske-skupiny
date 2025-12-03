"use client";

import NextLink from "next/link";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import React, { FC, useMemo } from "react";
import { useLocale } from "next-intl";
import { mergeMuiProps } from "@/utilites/mergeMuiProps";
import { type LinkProps as SanityLinkProps } from "sanity-plugin-link-field/component";
import { cleanUrl, parseLinkField } from "@/components/ui/link/parser";
import { localizeHref } from "@/i18n/routing";

interface ButtonProps extends Omit<MuiButtonProps, "href"> {
  href?: string;
  link?: SanityLinkProps;
  children?: React.ReactNode;
  scroll?: boolean;
}

const buttonStyles: MuiButtonProps = {};

const Button: FC<ButtonProps> = ({
  children,
  sx,
  link,
  scroll,
  ...otherProps
}) => {
  const locale = useLocale();
  const styles = useMemo(() => mergeMuiProps(buttonStyles, { sx }), [sx]);

  if (link) {
    const passedProps = parseLinkField(link, { locale });

    return (
      <MuiButton
        component={NextLink}
        {...styles}
        {...otherProps}
        href={passedProps.url}
        scroll={scroll}
      >
        {children || passedProps.text || cleanUrl(passedProps.url)}
      </MuiButton>
    );
  }

  if (otherProps.href) {
    const localizedHref = localizeHref(otherProps.href, locale);

    return (
      <MuiButton
        component={NextLink}
        {...styles}
        {...otherProps}
        href={localizedHref}
        scroll={scroll}
      >
        {children}
      </MuiButton>
    );
  }

  return (
    <MuiButton {...styles} {...otherProps}>
      {children}
    </MuiButton>
  );
};

export default Button;
