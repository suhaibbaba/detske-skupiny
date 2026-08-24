"use client";

/**
 * A Client Component, and it has to be one: it hands MUI `component={NextLink}`,
 * and a component reference is a function - functions do not serialise across
 * the server/client boundary, so a Server Component rendering this would throw
 * "Functions cannot be passed directly to Client Components".
 *
 * The `useMemo` it used to carry is gone regardless; it only wrapped a two-key
 * object merge, which is cheaper to redo than to memoize, and the React
 * Compiler now decides that for itself.
 */
import NextLink from "next/link";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import React, { FC } from "react";
import { useLocale } from "next-intl";
import { mergeMuiProps } from "@/utils/mergeMuiProps";
import {
  cleanUrl,
  parseLinkField,
  type SanityLinkField,
} from "@/components/ui/link/parser";
import { localizeHref } from "@/lib/i18n/routing";

interface ButtonProps extends Omit<MuiButtonProps, "href"> {
  href?: string;
  link?: SanityLinkField | null;
  children?: React.ReactNode;
  scroll?: boolean;
}

const buttonStyles: MuiButtonProps = {};

const Button: FC<ButtonProps> = ({
  children,
  sx,
  link,
  scroll,
  onClick,
  ...otherProps
}) => {
  const locale = useLocale();
  const styles = mergeMuiProps(buttonStyles, { sx });

  if (link) {
    const passedProps = parseLinkField(link, { locale });

    return (
      <MuiButton
        component={NextLink}
        {...styles}
        {...otherProps}
        href={passedProps.url}
        scroll={scroll}
        onClick={onClick}
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
        onClick={onClick}
      >
        {children}
      </MuiButton>
    );
  }

  return (
    <MuiButton {...styles} {...otherProps} onClick={onClick}>
      {children}
    </MuiButton>
  );
};

export default Button;
