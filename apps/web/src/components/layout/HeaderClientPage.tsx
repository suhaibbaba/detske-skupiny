"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Drawer,
  IconButton,
  Box,
} from "@mui/material";
import Link from "next/link";
import Button from "@/components/ui/button";
import { getLocalizedRoutes } from "@/routes";
import Menu from "@/components/layout/Menu";
import { Header } from "@/types/header";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import HeaderMenuIcon from "@/components/icons/HeaderMenuIcon";
import { useLocale } from "next-intl";
import LanguageSwitcher from "@/components/ui/language/LanguageSwitcher";
import Image, { type ImageProps } from "@/components/ui/image";
import type { SxProps, Theme } from "@mui/material/styles";

interface Props {
  header?: Header | null;
}

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
  menuButton: {
    display: {
      md: "none",
    },
  },
  menuIcon: {
    color: "primary.main",
    fontSize: 40,
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
  drawer: {
    display: {
      md: "none",
    },
  },
} satisfies Record<string, SxProps<Theme>>;

const HeaderClientPage = ({ header }: Props) => {
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCloseDrawer = () => {
    setMenuOpen(false);
  };

  if (!header) {
    return null;
  }

  return (
    <Box sx={styles.root}>
      <Container>
        <AppBar position="static" sx={styles.appBar}>
          <Toolbar sx={styles.toolbar}>
            <Link href={getLocalizedRoutes(locale).home}>
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
            </Link>
            <IconButton
              sx={styles.menuButton}
              onClick={() => setMenuOpen(true)}
            >
              <HeaderMenuIcon sx={styles.menuIcon} />
            </IconButton>
            <Drawer
              anchor="left"
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={styles.drawer}
              slotProps={{
                paper: {
                  sx: {
                    backgroundColor: "primary.main",
                  },
                },
              }}
            >
              <Box
                sx={{
                  p: "8px",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
              >
                <Box sx={styles.drawerLogoContainer}>
                  <Image
                    src={header.logoInverse}
                    alt="Logo"
                    sizes="120px"
                    sx={styles.logo}
                  />
                </Box>
                <Menu
                  menuItems={header.menuItems}
                  onItemClick={handleCloseDrawer}
                />
                {header.cta && (
                  <Button
                    startIcon={<AddCircleRoundedIcon />}
                    link={header.cta.link}
                    sx={styles.ctaMobile}
                    variant="ghost"
                    onClick={handleCloseDrawer}
                  />
                )}
                <Box sx={{ mt: "auto", alignSelf: "center" }}>
                  <LanguageSwitcher />
                </Box>
              </Box>
            </Drawer>
            <Menu menuItems={header.menuItems} hideOnMobile={true} />
            {header.cta && (
              <Button
                startIcon={<AddCircleRoundedIcon />}
                link={header.cta.link}
                sx={styles.cta}
                /*
                 * "primary", not `header.cta.variant`. The style object this
                 * replaces set `variant: "primary"` and was spread AFTER the
                 * `variant={header.cta.variant}` that used to sit here, so the
                 * editor's choice has never reached this button. Preserved as
                 * it renders today rather than fixed in a refactor pass.
                 */
                variant="primary"
              />
            )}
          </Toolbar>
        </AppBar>
      </Container>
    </Box>
  );
};

export default HeaderClientPage;
