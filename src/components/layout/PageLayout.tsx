import { Box, BoxProps, Container, ContainerOwnProps } from "@mui/material";
import Breadcrumbs from "@/components/ui/breadcrumb";
import React, { FC } from "react";

interface Props {
  children: React.ReactNode;
  sectionStyles?: BoxProps;
  /**
   * It means the content has maxwidth 100%
   */
  contentFullWidth?: boolean;
  showBreadcrumb?: boolean;
}

const PageLayout: FC<Props> = ({
  children,
  contentFullWidth = false,
  showBreadcrumb = true,
  sectionStyles,
}) => {
  return (
    <Box component="section" pt={5} pb={12.5} {...sectionStyles}>
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
