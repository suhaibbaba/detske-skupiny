import React, { FC } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";

const Offer: FC = () => {
  const translate = useTranslate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "custom.ui7",
        borderRadius: "12px",
        py: "40px",
        px: "16px",
        mt: "80px",
      }}
    >
      <Typography variant="h2" sx={{ mb: "12px" }}>
        {translate("offerTitle")}
      </Typography>
      <Typography>{translate("offerDescription")}</Typography>
      <Button variant="outlined" color="primary" sx={{ mt: "12px" }}>
        {translate("offerButton")}
      </Button>
    </Box>
  );
};

export default Offer;
