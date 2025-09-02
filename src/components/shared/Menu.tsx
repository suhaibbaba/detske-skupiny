"use client";

import { Typography, TypographyProps, Box, BoxProps } from "@mui/material";
import { MenuItem } from "@/types/header";

interface Props {
  menuItems?: MenuItem[];
  hideOnMobile?: boolean;
  onClick?: (className: string) => void;
}

interface MenuStyles {
  root: BoxProps;
  item: TypographyProps;
}

const styles: MenuStyles = {
  root: {
    component: "nav",
    sx: {
      // fix desktop menu showing in mobile version due to useMediaQuery speed
      display: { xs: "flex", md: "flex" }, // overridden by hideOnMobile below
      alignItems: {
        xs: "flex-start",
        md: "center",
      },
      flexDirection: { xs: "column", md: "row" },
      gap: {
        xs: 2,
        md: 0,
      },
    },
  },
  item: {
    component: "a",
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

const Menu = ({ menuItems, hideOnMobile, onClick }: Props) => {
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
        <Typography
          key={item.id}
          {...styles.item}
          className="drawer-item"
          onClick={() => onClick?.(item.className)}
        >
          {item.name}
        </Typography>
      ))}
    </Box>
  );
};

export default Menu;
