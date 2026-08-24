import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Container } from "@mui/material";
import Breadcrumbs from "@/components/ui/breadcrumb";
import React, { FC, Fragment } from "react";

interface BaseProps {
  children: React.ReactNode;
  /**
   * It means the content has max-width 100%
   */
  contentFullWidth?: boolean;
  /**
   * Extra styles for the section wrapper.
   *
   * Was `extendedStyles?: { section?: BoxProps }`, deep-merged into a base
   * props object with lodash. A plain `sx` says the same thing, and MUI's own
   * array form composes it - later entries win, which is what the merge was
   * emulating at runtime on every render.
   */
  sx?: SxProps<Theme>;
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

const sectionSx: SxProps<Theme> = {
  pt: { xs: 2, md: 5 },
  pb: { xs: 5, md: 12.5 },
};

const PageLayout: FC<Props> = ({
  children,
  contentFullWidth = false,
  showBreadcrumb = true,
  pathname,
  sx,
}) => {
  const breadcrumbs = showBreadcrumb && pathname !== undefined && (
    <Breadcrumbs pathname={pathname} />
  );

  return (
    <Box
      component="section"
      sx={[sectionSx, ...(Array.isArray(sx) ? sx : [sx])]}
    >
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
