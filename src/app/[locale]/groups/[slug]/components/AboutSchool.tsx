import React, { FC } from "react";
import {
  Box,
  BoxProps,
  Chip,
  ChipProps,
  Typography,
  TypographyProps,
} from "@mui/material";

const tags = [
  { label: "Children’s Group", selected: true },
  { label: "Montessori Preschool" },
  { label: "Language Preschool" },
  { label: "Language Preschool", error: true },
];

interface Props {
  children: React.ReactNode;
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
      gap: "20px",
      mt: "80px",
    },
  },
  tagsContainer: {
    display: "flex",
    gap: "16px",
  },
  chip: {
    sx: {
      borderRadius: "24px",
      px: "6px",
      py: "2px",
      fontSize: 12,
      fontWeight: 400,
      color: "#475467",
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

const AboutSchool: FC<Props> = ({ children }) => {
  return (
    <Box {...styles.container}>
      <Typography {...styles.title}>About</Typography>
      <Typography {...styles.description}>{children}</Typography>
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
