"use client";

import { Box, BoxProps, Container } from "@mui/material";
import Breadcrumbs from "@/components/ui/breadcrumb";
import React, { FC, useState } from "react";
import { mergeMuiProps } from "@/utilites/mergeMuiProps";

interface Props {
  children: React.ReactNode;
  /**
   * It means the content has maxwidth 100%
   */
  contentFullWidth?: boolean;
  showBreadcrumb?: boolean;
  extendedStyles?: PageLayoutStyles;
}

export interface PageLayoutStyles {
  section?: BoxProps;
}

const pageLayoutStyles: PageLayoutStyles = {};

const PageLayout: FC<Props> = ({
  children,
  contentFullWidth = false,
  showBreadcrumb = true,
  extendedStyles,
}) => {
  const [styles] = useState(() =>
    mergeMuiProps(pageLayoutStyles, extendedStyles),
  );

  return (
    <Box component="section" pt={5} pb={12.5} {...styles.section}>
      <Container
        maxWidth={contentFullWidth ? false : "lg"}
        disableGutters={!contentFullWidth}
      >
        {contentFullWidth ? (
          <Container>
            {showBreadcrumb && <Breadcrumbs />}
            {children}
          </Container>
        ) : (
          <>
            {showBreadcrumb && <Breadcrumbs />}
            {children}
          </>
        )}
      </Container>
    </Box>
  );
};

export default PageLayout;
