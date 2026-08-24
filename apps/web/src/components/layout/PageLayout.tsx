import { Box, BoxProps, Container } from "@mui/material";
import Breadcrumbs from "@/components/ui/breadcrumb";
import React, { FC, Fragment } from "react";
import { mergeMuiProps } from "@/utilites/mergeMuiProps";

interface BaseProps {
  children: React.ReactNode;
  /**
   * It means the content has max-width 100%
   */
  contentFullWidth?: boolean;
  extendedStyles?: PageLayoutStyles;
}

/**
 * The breadcrumbs render on the server and the App Router gives server
 * components no pathname, so the page has to hand it over. Modelled as a union
 * rather than an optional prop so that a layout showing breadcrumbs cannot
 * compile without one - forgetting it would silently drop the trail.
 */
type Props = BaseProps &
  (
    | { showBreadcrumb?: true; pathname: string }
    | { showBreadcrumb: false; pathname?: never }
  );

export interface PageLayoutStyles {
  section?: BoxProps;
}

const pageLayoutStyles: PageLayoutStyles = {
  section: {
    sx: {
      pt: { xs: 2, md: 5 },
      pb: { xs: 5, md: 12.5 },
    },
  },
};

const PageLayout: FC<Props> = ({
  children,
  contentFullWidth = false,
  showBreadcrumb = true,
  pathname,
  extendedStyles,
}) => {
  const styles = mergeMuiProps(pageLayoutStyles, extendedStyles);
  const breadcrumbs = showBreadcrumb && pathname !== undefined && (
    <Breadcrumbs pathname={pathname} />
  );

  return (
    <Box component="section" {...styles.section}>
      <Container
        maxWidth={contentFullWidth ? false : "lg"}
        disableGutters={!contentFullWidth}
        sx={{ px: contentFullWidth ? "0 !important" : undefined }}
      >
        {contentFullWidth ? (
          <Fragment>
            <Container>{breadcrumbs}</Container>
            {children}
          </Fragment>
        ) : (
          <>
            {breadcrumbs}
            {children}
          </>
        )}
      </Container>
    </Box>
  );
};

export default PageLayout;
