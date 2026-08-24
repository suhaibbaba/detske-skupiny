"use client";

import { useState } from "react";
import { Box, Drawer, IconButton } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import HeaderMenuIcon from "@/components/icons/HeaderMenuIcon";
import useTranslate from "@/hooks/useTranslate";

const styles = {
  menuButton: {
    display: {
      md: "none",
    },
  },
  menuIcon: {
    color: "primary.main",
    fontSize: 40,
  },
  drawer: {
    display: {
      md: "none",
    },
  },
  body: {
    p: "8px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
} satisfies Record<string, SxProps<Theme>>;

/**
 * The mobile drawer: a toggle, and a panel whose contents come from the server.
 *
 * This is the only part of the header that needs to be a Client Component -
 * it is one `useState`. Everything inside the panel arrives as `children`,
 * which means the logo, the navigation and the CTA are still rendered on the
 * server and only pass through here as an already-rendered subtree.
 *
 * Closing is delegated rather than wired per item. It used to be an
 * `onItemClick` callback threaded into `Menu` and an `onClick` on the CTA,
 * which forced both of them to be client code for the sake of one setter. The
 * handler below closes on a click that landed inside a link or a button -
 * which is exactly the set of things those two callbacks covered - and ignores
 * a click on the panel's padding, as before.
 */
const HeaderDrawer = ({ children }: { children: React.ReactNode }) => {
  const translate = useTranslate();
  const [open, setOpen] = useState(false);

  const closeIfNavigating = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a, button")) {
      setOpen(false);
    }
  };

  return (
    <>
      {/*
       * The name is the only thing a screen reader has to go on: the button's
       * whole content is an SVG, so without it this announced as "button" and
       * nothing else. axe reports that as a serious `button-name` violation,
       * which the gate now fails on.
       */}
      <IconButton
        sx={styles.menuButton}
        onClick={() => setOpen(true)}
        aria-label={translate("openMenu")}
        aria-expanded={open}
      >
        <HeaderMenuIcon sx={styles.menuIcon} />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
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
        <Box sx={styles.body} onClick={closeIfNavigating}>
          {children}
        </Box>
      </Drawer>
    </>
  );
};

export default HeaderDrawer;
