import { Box, BoxProps, Container } from "@mui/material";
import Breadcrumbs from "@/components/ui/breadcrumb";
import React, { FC } from "react";
import { mergeMuiProps } from "@/utilites/mergeMuiProps";

interface Props {
  children: React.ReactNode;
  /**
   * It means the content has max-width 100%
   */
  contentFullWidth?: boolean;
  showBreadcrumb?: boolean;
  extendedStyles?: PageLayoutStyles;
}

export interface PageLayoutStyles {
  section?: BoxProps;
}

const pageLayoutStyles: PageLayoutStyles = {
  section: {
    sx: {
      pt: 5,
      pb: { xs: 5, md: 12.5 },
    },
  },
};

const PageLayout: FC<Props> = ({
  children,
  contentFullWidth = false,
  showBreadcrumb = true,
  extendedStyles,
}) => {
  const styles = mergeMuiProps(pageLayoutStyles, extendedStyles);

  return (
    <Box component="section" {...styles.section}>
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
