import React, { FC } from "react";
import {
  Box,
  BoxProps,
  Chip,
  ChipProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { School } from "@/sanity/types";
import RichText from "@/sanity/components/RichText";
import useTranslate from "@/hooks/useTranslate";

const tags = [
  { label: "Children’s Group", selected: true },
  { label: "Montessori Preschool" },
  { label: "Language Preschool" },
  { label: "Language Preschool", error: true },
];

interface Props {
  about: School["about"];
}

interface AboutSchoolStyles {
  container?: BoxProps;
  title?: TypographyProps;
  description?: TypographyProps;
  tagsContainer?: BoxProps;
  chip?: ChipProps;
}

const styles: AboutSchoolStyles = {
  container: {
    sx: {
      display: "flex",
      flexDirection: "column",
      mt: "80px",
    },
  },
  title: {
    variant: "h3",
  },
  tagsContainer: {
    display: "flex",
    gap: "16px",
    mt: "20px",
  },
  chip: {
    sx: {
      borderRadius: "24px",
      px: "6px",
      py: "2px",
      fontSize: 12,
      fontWeight: 400,
      color: "custom.ui20",
      "& .MuiChip-label": {
        padding: 0,
      },
      "& .MuiChip-icon": {
        marginRight: "4px",
        marginLeft: 0,
      },
    },
  },
};

const AboutSchool: FC<Props> = ({ about }) => {
  const translate = useTranslate();

  return (
    <Box {...styles.container}>
      <Typography {...styles.title}>{translate("aboutUs")}</Typography>
      <RichText {...styles.description}>{about}</RichText>
      <Box {...styles.tagsContainer}>
        {tags.map((tag, idx) => (
          <Chip
            key={idx}
            label={tag.label}
            variant={tag.selected ? "filled" : "outlined"}
            color={"default"}
            {...styles.chip}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AboutSchool;
