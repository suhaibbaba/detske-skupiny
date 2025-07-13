import { Typography, Box } from "@mui/material";

const Menu = (props: {
  hideOnMobile?: boolean;
  setMenuOpen?: (state: boolean) => void;
}) => {
  const { hideOnMobile, setMenuOpen = (state: boolean) => {} } = props;

  return (
    <Box
      component="nav"
      sx={{
        // fix desktop menu showing in mobile version due to useMediaQuery speed
        display: hideOnMobile ? { xs: "none", md: "flex" } : "flex",
        alignItems: "center",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 2, md: 0 },
        p: { xs: 2, md: 0 },
      }}
    >
      {[
        { name: "Katalog skupin", url: "#kalkulacka" },
        { name: "Co je sousedská skupina?", url: "#proces" },
        { name: "Kontakt", url: "#dokumenty" },
        { name: "Otázky a odpovědi", url: "#faq" },
      ].map((item) => (
        <Typography
          key={item.name}
          component="a"
          href={item.url}
          sx={{
            position: "relative",
            textDecoration: "none",
            color: "#272E39",
            fontSize: 16,
            mx: 3,
            pb: 0.5,
            "&::after": {
              content: '""',
              position: "absolute",
              bgcolor: "primary.main",
              width: "0",
              height: "2px",
              left: "0",
              top: "100%",
            },
            "&:hover": {
              "&:after": {
                width: "100%",
              },
            },
          }}
        >
          {item.name}
        </Typography>
      ))}
    </Box>
  );
};

export default Menu;
