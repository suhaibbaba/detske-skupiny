import { Box, BoxProps, Container, ContainerOwnProps } from "@mui/material";
import Breadcrumbs from "@/components/core/breadcrumb";
import React, { FC } from "react";

interface Props {
  children: React.ReactNode;
  sectionStyles?: BoxProps;
  fullWidth?: ContainerOwnProps["maxWidth"];
}

const PageLayout: FC<Props> = ({
  children,
  fullWidth = "lg",
  sectionStyles,
}) => {
  return (
    <Box component="section" pt={5} pb={12.5} {...sectionStyles}>
      <Container maxWidth={fullWidth} disableGutters={!fullWidth}>
        {!fullWidth ? (
          <Container>
            <Breadcrumbs />
          </Container>
        ) : (
          <Breadcrumbs />
        )}
        {children}
      </Container>
    </Box>
  );
};

export default PageLayout;
