import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { getTranslateServer } from "@/hooks/useTranslate";
import { getLocalizedRoutes } from "@/routes";

export default async function NotFound() {
  const locale = await getLocale();
  const translate = await getTranslateServer();

  return (
    <Container
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: "80px",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h1"
          component="div"
          sx={{ fontSize: { xs: "5rem", md: "7rem" }, fontWeight: 600, mb: 2 }}
        >
          404
        </Typography>
        <Typography component="h1" variant="subtitle1" sx={{ mb: 4 }}>
          {translate("pageNotFoundTitle")}
        </Typography>
        <Button
          component={Link}
          href={getLocalizedRoutes(locale).home}
          variant="contained"
          size="large"
        >
          {translate("pageNotFoundButton")}
        </Button>
      </Box>
    </Container>
  );
}
