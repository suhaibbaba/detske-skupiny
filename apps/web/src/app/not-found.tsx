import { Box, Button, Typography, Paper } from "@mui/material";
import { nunitoClassName } from "@/fonts/nunito";
import { getLocale } from "next-intl/server";
import { getTranslateServer } from "@/hooks/useTranslate";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const translate = await getTranslateServer();

  return {
    title: {
      template: `%s | ${translate("pageNotFoundTitle")}`,
      default: translate("pageNotFoundTitle"),
    },
    description: translate("pageNotFoundTitle"),
  };
}

export default async function NotFound() {
  const locale = await getLocale();
  const translate = await getTranslateServer();

  return (
    <html lang={locale}>
      <body className={nunitoClassName}>
        <Box
          sx={{
            height: "100svh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(180deg, #F8F2FE 0%,  #F8F2FE 45%, #FCF8E5 100%)",
            position: "relative",
            overflow: "hidden",
            p: 0,
          }}
        >
          <Paper
            sx={{
              p: 6,
              maxWidth: 500,
              textAlign: "center",
              borderRadius: 5,
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <Typography
              variant="h1"
              component="div"
              sx={{
                color: "#272E39",
                fontSize: { xs: "5rem", md: "7rem" },
                fontWeight: 600,
                mb: 2,
                textShadow: "0 0 20px rgba(255,255,255,0.4)",
              }}
            >
              404
            </Typography>

            <Typography
              component="h1"
              variant="subtitle1"
              sx={{ color: "#272E39", mb: 4, fontSize: "1.1rem" }}
            >
              {translate("pageNotFoundTitle")}
            </Typography>

            {/*
             * A plain `href` rather than `component={Link}`.
             *
             * `component={Link}` passes a function to a Client Component,
             * which React refuses to serialise - and because Next renders the
             * not-found boundary as part of the route shell, that threw on
             * every request, which is why this page answered 500 instead of
             * 404.
             *
             * The app's own `<Button>` is not an option here either: this
             * file renders its own `<html>` outside the locale layout, so
             * there is no next-intl provider for its `useLocale` to find. A
             * full navigation back to the home page is the right behaviour
             * for a global 404 anyway.
             */}
            <Button
              href="/"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#9980B0",
                mt: 2,
                px: 5,
                py: 1.5,
                borderRadius: "24px",
                padding: "14px 20px",
                lineHeight: "16px",
              }}
            >
              {translate("pageNotFoundButton")}
            </Button>
          </Paper>
        </Box>
      </body>
    </html>
  );
}
