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
import Menu from "@/components/shared/Menu";
import { Header } from "@/types/header";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import HeaderMenuIcon from "@/components/icons/HeaderMenuIcon";
import { useLocale } from "next-intl";

interface Props {
  header?: Header;
}

interface HeaderStyles {
  root: BoxProps;
  appBar: AppBarProps;
  toolbar: ToolbarProps;
  logo: BoxProps;
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

  if (!header) {
    return null;
  }

  return (
    <Box {...styles.root}>
      <Container>
        <AppBar position="static" {...styles.appBar}>
          <Toolbar {...styles.toolbar}>
            <Link href={getLocalizedRoutes(locale).home}>
              <Box component="img" src={header.logo} {...styles.logo} />
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
              <Box sx={{ p: "8px" }}>
                <Box {...styles.drawerLogoContainer}>
                  <Box
                    component="img"
                    src={header.logoInverse}
                    {...styles.logo}
                  />
                </Box>
                <Menu menuItems={header.menuItems} />
                {header.cta && (
                  <Button
                    startIcon={<AddCircleRoundedIcon />}
                    link={header.cta.link}
                    {...styles.ctaMobile}
                  />
                )}
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
