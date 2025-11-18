import React, { FC } from "react";
import { Box, BoxProps, Chip, ChipProps, TypographyProps } from "@mui/material";
import { School } from "@/sanity/types";
import RichText from "@/sanity/components/RichText";

interface Props {
  content: School["content"];
  tags: School["tags"];
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

const ContentSchool: FC<Props> = ({ content, tags }) => {
  return (
    <Box {...styles.container}>
      <RichText {...styles.description}>{content}</RichText>
      {tags && (
        <Box {...styles.tagsContainer}>
          {tags.map((tag, idx) => (
            <Chip
              key={idx}
              label={tag.name}
              variant="filled"
              color="default"
              {...styles.chip}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ContentSchool;
