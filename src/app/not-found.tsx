"use client";

import { Box, Button, Typography, Paper } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";
import { baseTheme, createButtonStyle } from "@/theme";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        height: "100%",
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
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        elevation={8}
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
          variant="subtitle1"
          sx={{ color: "#272E39", mb: 4, fontSize: "1.1rem" }}
        >
          The page you are looking for doesn’t exist or has been moved.
        </Typography>

        <Button
          component={Link}
          href="/"
          variant="contained"
          size="large"
          sx={{
            mt: 2,
            px: 5,
            py: 1.5,
            borderRadius: "24px",
            padding: "14px 20px",
            textTransform: "capitalize",
            lineHeight: "16px",
            ...createButtonStyle({
              bgColor: baseTheme.palette.primary.main,
              hoverBgColor: baseTheme.palette.primary.dark,
              textColor: baseTheme.palette.common.white,
            }),
          }}
        >
          Go Home
        </Button>
      </Paper>
    </Box>
  );
}
