import { Box, Typography, Container, Grid, Stack } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ backgroundColor: "primary.dark", py: "64px" }}
    >
      <Container sx={{ color: "white" }}>
        <Grid container>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography
              fontWeight={600}
              color="inherit"
              fontSize="14px"
              mb="16px"
            >
              HEAD OFFICE
            </Typography>
            <Typography color="inherit">+420 731 146 894</Typography>
            <Typography
              color="inherit"
              component="a"
              href="mailto:info@detskeskupinky.cz"
            >
              info@detskeskupinky.cz
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography
              fontWeight={600}
              color="inherit"
              fontSize="14px"
              mb="16px"
            >
              KATALOG
            </Typography>
            <Stack gap="8px">
              <Typography color="inherit">Sousedské skupiny Praha</Typography>
              <Typography color="inherit">Sousedské skupiny Brno</Typography>
              <Typography color="inherit">Sousedské skupiny Ostrava</Typography>
              <Typography color="inherit">
                Sousedské skupiny Středočeský kraj
              </Typography>
              <Typography color="inherit">
                Sousedské skupiny Jihomoravský kraj
              </Typography>
              <Typography color="inherit">
                Sousedské skupiny Moravskoslezský kraj
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography
              fontWeight={600}
              color="inherit"
              fontSize="14px"
              mb="16px"
            >
              NAVIGACE
            </Typography>
            <Stack gap="8px">
              <Typography color="inherit">O nás</Typography>
              <Typography color="inherit">Články</Typography>
              <Typography color="inherit">Kontakt</Typography>
              <Typography color="inherit">Ochrana osobních údajů</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          sx={{
            borderTop: 1,
            borderColor: "primary.light",
            pt: "24px",
            mt: "48px",
            gap: "20px",
            justifyContent: {
              xs: "flex-start",
              sm: "space-between",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Typography color="inherit">LOGO</Typography>
          <Typography color="inherit">
            &copy; {new Date().getFullYear()} DetskeSkupinky.cz
          </Typography>
          <Typography color="inherit">English (US)</Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
