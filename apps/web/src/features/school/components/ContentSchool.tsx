import React, { FC } from "react";
import { Box, BoxProps, TypographyProps } from "@mui/material";
import { School } from "@/types";
import RichText from "@/components/rich-text/RichText";

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
    sx: {
      mt: "20px",
      gap: "16px",
      display: "flex",
    },
  },
};

const ContentSchool: FC<Props> = ({ content }) => {
  if (!content) return null;

  return (
    <Box {...styles.container}>
      <RichText {...styles.description}>{content}</RichText>
    </Box>
  );
};

export default ContentSchool;
