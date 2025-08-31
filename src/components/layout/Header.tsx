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
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import Menu from "../Menu";
import Link from "next/link";
import Button from "@/components/ui/button";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "#E7E8EA",
        boxShadow:
          "0px 1px 8px 1px rgba(0, 0, 0, 0.08), 0px 1px 7px 0px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "white",
            py: 1.5,
            boxShadow: "none",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: "0 !important",
            }}
          >
            <Link href="/public">
              <Box sx={{ width: { xs: "150px", md: "200px" } }}>
                {/* <Image src={logo} width={200} alt="" priority /> */}
                LOGO
              </Box>
            </Link>
            <IconButton
              sx={{ display: { md: "none" } }}
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon sx={{ color: "primary.main", fontSize: 32 }} />
            </IconButton>
            {isMobile ? (
              <Drawer
                anchor="left"
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                // stay in DOM when menu is not open
                ModalProps={{
                  keepMounted: true,
                }}
              >
                <Menu setMenuOpen={setMenuOpen} />
              </Drawer>
            ) : (
              <Menu hideOnMobile />
            )}
            <Link href="#kalkulacka">
              <Button
                sx={{ py: "10px", px: "20px" }}
                onClick={() => setMenuOpen(false)}
              >
                Přidat skupinu
              </Button>
            </Link>
          </Toolbar>
        </AppBar>
      </Container>
    </Box>
  );
};

export default Header;
