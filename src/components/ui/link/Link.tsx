"use client";

import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";
import React, { FC, useState } from "react";
import { mergeMuiProps } from "@/utilites/mergeMuiProps";

interface LinkProps extends Omit<MuiLinkProps, "href">, NextLinkProps {
  children?: React.ReactNode;
}

const linkStyles: MuiLinkProps = {
  sx: {
    textDecoration: "none",
    display: "block",
  },
};

const Link: FC<LinkProps> = ({ children, sx, ...otherProps }) => {
  const [styles] = useState(() => mergeMuiProps(linkStyles, { sx }));

  return (
    <MuiLink component={NextLink} {...styles} {...otherProps}>
      {children}
    </MuiLink>
  );
};

export default Link;
