"use client";

import { useState } from "react";
import {
  AppBar,
  AppBarProps,
  Toolbar,
  ToolbarProps,
  Container,
  Drawer,
  IconButton,
  IconButtonProps,
  Box,
  BoxProps,
  SvgIconProps,
  ButtonProps,
  DrawerProps,
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

interface Props {
  header?: Header | null;
}

interface HeaderStyles {
  root: BoxProps;
  appBar: AppBarProps;
  toolbar: ToolbarProps;
  logo: ImageProps;
  drawerLogoContainer: BoxProps;
  menuButton: IconButtonProps;
  menuIcon: SvgIconProps;
  cta?: ButtonProps;
  ctaMobile?: ButtonProps;
  drawer?: DrawerProps;
}

const styles: HeaderStyles = {
  root: {
    sx: {
      borderBottom: 1,
      borderColor: "#E7E8EA",
      boxShadow:
        "0px 1px 8px 1px rgba(0, 0, 0, 0.08), 0px 1px 7px 0px rgba(0, 0, 0, 0.1)",
    },
  },
  appBar: {
    sx: {
      backgroundColor: "white",
      py: 1.5,
      boxShadow: "none",
    },
  },
  toolbar: {
    sx: {
      display: "flex",
      justifyContent: "space-between",
      px: "0 !important",
    },
  },
  logo: {
    sx: {
      width: "120px",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  drawerLogoContainer: {
    sx: {
      p: "8px 0 9px",
      mb: "12px",
      borderBottom: `1px solid var(--mui-palette-custom-ui14)`,
    },
  },
  menuButton: {
    sx: {
      display: {
        md: "none",
      },
    },
  },
  menuIcon: {
    sx: {
      color: "primary.main",
      fontSize: 40,
    },
  },
  cta: {
    variant: "primary",
    sx: {
      padding: "10px 20px",
      display: {
        xs: "none",
        md: "flex",
      },
    },
  },
  ctaMobile: {
    variant: "ghost",
    sx: {
      mt: "16px",
    },
  },
  drawer: {
    slotProps: {
      paper: {
        sx: {
          backgroundColor: "primary.main",
        },
      },
    },
    sx: {
      display: {
        md: "none",
      },
    },
  },
};

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
    <Box {...styles.root}>
      <Container>
        <AppBar position="static" {...styles.appBar}>
          <Toolbar {...styles.toolbar}>
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
                {...styles.logo}
              />
            </Link>
            <IconButton
              {...styles.menuButton}
              onClick={() => setMenuOpen(true)}
            >
              <HeaderMenuIcon {...styles.menuIcon} />
            </IconButton>
            <Drawer
              anchor="left"
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              ModalProps={{ keepMounted: true }}
              {...styles.drawer}
            >
              <Box
                sx={{
                  p: "8px",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
              >
                <Box {...styles.drawerLogoContainer}>
                  <Image
                    src={header.logoInverse}
                    alt="Logo"
                    sizes="120px"
                    {...styles.logo}
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
                    {...styles.ctaMobile}
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
                variant={header.cta.variant}
                link={header.cta.link}
                {...styles.cta}
              />
            )}
          </Toolbar>
        </AppBar>
      </Container>
    </Box>
  );
};

export default HeaderClientPage;
