"use client";

import { Box, BoxProps } from "@mui/material";
import InfoCardItem, {
  InfoCardItemProps,
} from "@/app/[locale]/groups/[group]/components/InfoCardItem";
import { useTranslate } from "@/hooks/useTranslate";

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
  const translate = useTranslate();

  return (
    <Box {...styles.container}>
      {items.map((item, index) => (
        <InfoCardItem key={index} {...item} title={translate(item.title)} />
      ))}
    </Box>
  );
};

export default InfoCardGrid;
