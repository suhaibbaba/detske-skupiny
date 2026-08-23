"use client";

import { useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        <Typography variant="h2" sx={{ mb: 2 }}>
          Something went wrong
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Please try again.
        </Typography>
        <Button variant="contained" size="large" onClick={() => reset()}>
          Try again
        </Button>
      </Box>
    </Container>
  );
}
