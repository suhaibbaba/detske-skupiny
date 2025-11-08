"use client";

import { LinkProps, Box, BoxProps } from "@mui/material";
import { MenuItem } from "@/types/header";
import Link from "@/components/ui/link";

interface Props {
  menuItems?: MenuItem[];
  hideOnMobile?: boolean;
}

interface MenuStyles {
  root: BoxProps;
  item: LinkProps;
}

const styles: MenuStyles = {
  root: {
    component: "nav",
    sx: {
      display: { xs: "flex", md: "flex" },
      alignItems: {
        xs: "flex-start",
        md: "center",
      },
      flexDirection: {
        xs: "column",
        md: "row",
      },
      gap: {
        xs: 2,
        md: "36px",
      },
    },
  },
  item: {
    sx: {
      position: "relative",
      textDecoration: "none",
      color: "custom.ui13",
      fontSize: 16,
      mx: 3,
      pb: 0.5,
      cursor: "pointer",
      "&::after": {
        content: '""',
        position: "absolute",
        bgcolor: "primary.main",
        width: "0",
        height: "2px",
        left: "0",
        top: "100%",
        transition: "width 0.3s ease",
      },
      "&:hover": {
        "&:after": {
          width: "100%",
        },
      },
      "&.drawer-item": {
        textAlign: "left",
        margin: "0",
      },
    },
  },
};

const Menu = ({ menuItems, hideOnMobile }: Props) => {
  if (!menuItems || !menuItems.length) {
    return null;
  }

  return (
    <Box
      {...styles.root}
      sx={{
        ...styles.root.sx,
        display: hideOnMobile
          ? {
              xs: "none",
              md: "flex",
            }
          : "flex",
      }}
    >
      {menuItems.map((item) => (
        <Link
          key={item.id}
          link={item.link}
          {...styles.item}
          className="drawer-item"
        />
      ))}
    </Box>
  );
};

export default Menu;
