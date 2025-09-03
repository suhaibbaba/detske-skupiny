"use client";

import NextLink from "next/link";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import React, { FC, useMemo, useState } from "react";
import { mergeMuiProps } from "@/utilites/mergeMuiProps";
import { type LinkProps as SanityLinkProps } from "sanity-plugin-link-field/component";
import { cleanUrl, parseLinkField } from "@/components/ui/link/parser";

interface ButtonProps extends Omit<MuiButtonProps, "href"> {
  href?: string;
  link?: SanityLinkProps;
  children?: React.ReactNode;
}

const buttonStyles: MuiButtonProps = {};

const Button: FC<ButtonProps> = ({ children, sx, link, ...otherProps }) => {
  const styles = useMemo(() => mergeMuiProps(buttonStyles, { sx }), [sx]);

  if (link) {
    const passedProps = parseLinkField(link);

    return (
      <MuiButton
        component={NextLink}
        {...styles}
        {...otherProps}
        href={passedProps.url}
      >
        {children || passedProps.text || cleanUrl(passedProps.url)}
      </MuiButton>
    );
  }

  if (otherProps.href) {
    return (
      <MuiButton
        component={NextLink}
        {...styles}
        {...otherProps}
        href={otherProps.href}
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
