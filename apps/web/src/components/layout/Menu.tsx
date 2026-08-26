import { Box } from "@mui/material";
import { MenuItem } from "@/types/header";
import Link from "@/components/ui/link";
import type { SxProps, Theme } from "@mui/material/styles";

interface Props {
  menuItems?: MenuItem[] | null;
  hideOnMobile?: boolean;
}

const styles = {
  root: {
    display: { xs: "flex", md: "flex" },
    alignItems: "center",
    flexDirection: {
      xs: "column",
      md: "row",
    },
    gap: {
      xs: 2,
      md: "36px",
    },
  },
  item: {
    position: "relative",
    textDecoration: "none",
    color: { xs: "common.white", md: "custom.textHeading" },
    fontSize: 16,
    mx: 3,
    pb: 0.5,
    cursor: "pointer",
    "&::after": {
      content: '""',
      position: "absolute",
      bgcolor: { xs: "common.white", md: "primary.main" },
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
      "&&": {
        color: { xs: "common.white", md: "primary.main" },
      },
    },
    "&.drawer-item": {
      textAlign: "left",
      margin: "0",
    },
  },
} satisfies Record<string, SxProps<Theme>>;

/**
 * The header navigation - a list of links, and nothing else.
 *
 * It renders on the server on every route. Closing the mobile drawer is
 * handled by `HeaderDrawer` on a delegated click, so no callback has to be
 * threaded through here.
 */
const Menu = ({ menuItems, hideOnMobile }: Props) => {
  if (!menuItems || !menuItems.length) {
    return null;
  }

  return (
    <Box
      component="nav"
      sx={{
        ...styles.root,
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
          sx={styles.item}
          className="drawer-item"
        />
      ))}
    </Box>
  );
};

export default Menu;
