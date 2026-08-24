import { Box, Container, Typography } from "@mui/material";
/*
 * The app's own Button rather than MUI's with `component={Link}`.
 *
 * This file is a Server Component, and `component={Link}` hands a client
 * component a *function* - React refuses to serialise it and throws
 * "Functions cannot be passed directly to Client Components". Next renders the
 * not-found boundary as part of every route's shell, so that error was being
 * logged on every page of the site, not just on a 404. The wrapper is itself a
 * Client Component and does the `next/link` composition on its own side of the
 * boundary.
 */
import Button from "@/components/ui/button";
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
