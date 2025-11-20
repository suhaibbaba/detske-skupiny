import React, { FC } from "react";
import { Box, BoxProps, Chip, ChipProps, TypographyProps } from "@mui/material";
import { School } from "@/sanity/types";
import RichText from "@/sanity/components/RichText";

interface Props {
  content: School["content"];
  tags: School["tags"];
  school: School;
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

const ContentSchool: FC<Props> = ({ content, tags, school }) => {
  return (
    <Box {...styles.container}>
      <RichText {...styles.description}>{content}</RichText>
      {/* {tags && (
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
      )} */}
      {school?.categories?.map((category) => (
        <Chip
          component="a"
          clickable
          key={category.id}
          label={category.name}
          variant="outlined"
          color="primary"
          {...styles.chip}
        />
      ))}
      <Chip
        component="a"
        clickable
        label={school.region.name}
        variant="outlined"
        {...styles.chip}
      />
      <Chip
        component="a"
        clickable
        href="https://en.wikipedia.org/wiki/Administrative_divisions_of_the_Czech_Republic#Districts"
        label={school.area.name}
        {...styles.chip}
        variant="outlined"
        sx={{ borderColor: "#B2AD88" }}
      />
    </Box>
  );
};

export default ContentSchool;
