import React, { FC } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import { getLocalizedRoutes } from "@/routes/routes";
import { useLocale } from "next-intl";

const Offer: FC = () => {
  const locale = useLocale();
  const translate = useTranslate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "custom.surfaceCream",
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
      <Button
        variant="outlined"
        color="primary"
        sx={{ mt: "12px" }}
        href={getLocalizedRoutes(locale).cooperation}
      >
        {translate("offerButton")}
      </Button>
    </Box>
  );
};

export default Offer;
