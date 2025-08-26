"use client";

import { Box, Typography, BoxProps } from "@mui/material";
import InfoCardItem, {
  InfoCardItemProps,
} from "@/app/[locale]/catalog/[region]/[school]/components/InfoCardItem";

interface InfoCardGridProps {
  items: InfoCardItemProps[];
}

interface InfoCardGridStyles {
  container?: BoxProps;
}

const styles: InfoCardGridStyles = {
  container: {
    sx: {
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
      gap: "24px 20px",
      mt: "80px",
    },
  },
};

const InfoCardGrid = ({ items }: InfoCardGridProps) => {
  return (
    <Box {...styles.container}>
      {items.map((item, index) => (
        <InfoCardItem key={index} {...item} />
      ))}
    </Box>
  );
};

export default InfoCardGrid;
