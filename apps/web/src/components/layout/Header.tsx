import { AppBar, Box, Container, Toolbar } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import NextLink from "next/link";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { fetchHeaderPage } from "@/lib/sanity/header";
import Button from "@/components/ui/button";
import HeaderDrawer from "@/components/layout/HeaderDrawer";
import Menu from "@/components/layout/Menu";
import LanguageSwitcher from "@/components/ui/language/LanguageSwitcher";
import Image from "@/components/ui/image";
import { getLocalizedRoutes } from "@/routes";

const styles = {
  root: {
    borderBottom: 1,
    borderColor: "#E7E8EA",
    boxShadow:
      "0px 1px 8px 1px rgba(0, 0, 0, 0.08), 0px 1px 7px 0px rgba(0, 0, 0, 0.1)",
  },
  appBar: {
    backgroundColor: "white",
    py: 1.5,
    boxShadow: "none",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    px: "0 !important",
  },
  logo: {
    width: "120px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  drawerLogoContainer: {
    p: "8px 0 9px",
    mb: "12px",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "custom.borderLilac",
  },
  cta: {
    padding: "10px 20px",
    display: {
      xs: "none",
      md: "flex",
    },
  },
  ctaMobile: {
    mt: "16px",
  },
  switcher: {
    mt: "auto",
    alignSelf: "center",
  },
} satisfies Record<string, SxProps<Theme>>;

/**
 * The site header, rendered on the server.
 *
 * Only two leaves need the client: `HeaderDrawer`, which owns the boolean for
 * whether the mobile drawer is open and takes its panel contents as children,
 * and `LanguageSwitcher`, which reads `window.location`. The logo, the
 * navigation, the call to action and the MUI shell around them all render on
 * the server.
 *
 * The navigation is deliberately not client. It is a list of links.
 */
const Header = async ({ locale }: { locale: string }) => {
  const { header } = await fetchHeaderPage(locale);

  if (!header) {
    return null;
  }

  const cta = header.cta && (
    <Button
      startIcon={<AddCircleRoundedIcon />}
      link={header.cta.link}
      sx={styles.cta}
      /*
       * "primary", not `header.cta.variant`: the header call to action is
       * always the primary variant, so the editor's choice of variant is not
       * read here.
       */
      variant="primary"
    />
  );

  return (
    <Box sx={styles.root}>
      <Container>
        <AppBar position="static" sx={styles.appBar}>
          <Toolbar sx={styles.toolbar}>
            <NextLink href={getLocalizedRoutes(locale).home}>
              {/*
               * The header logo is the first image on every page, so it is
               * fetched eagerly rather than lazily - it is always in view.
               */}
              <Image
                src={header.logo}
                alt="Logo"
                priority
                // Pinned to 120px by the CSS above. Without `sizes`,
                // `next/image` sizes the srcset from the asset's intrinsic
                // width instead and offers a 3840px file for a 120px slot.
                sizes="120px"
                sx={styles.logo}
              />
            </NextLink>
            <HeaderDrawer>
              <Box sx={styles.drawerLogoContainer}>
                <Image
                  src={header.logoInverse}
                  alt="Logo"
                  sizes="120px"
                  sx={styles.logo}
                />
              </Box>
              <Menu menuItems={header.menuItems} />
              {header.cta && (
                <Button
                  startIcon={<AddCircleRoundedIcon />}
                  link={header.cta.link}
                  sx={styles.ctaMobile}
                  variant="ghost"
                />
              )}
              <Box sx={styles.switcher}>
                <LanguageSwitcher />
              </Box>
            </HeaderDrawer>
            <Menu menuItems={header.menuItems} hideOnMobile />
            {cta}
          </Toolbar>
        </AppBar>
      </Container>
    </Box>
  );
};

export default Header;
