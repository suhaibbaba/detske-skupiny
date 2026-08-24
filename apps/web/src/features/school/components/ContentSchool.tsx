import type { SxProps, Theme } from "@mui/material/styles";
import React, { FC } from "react";
import { Box } from "@mui/material";
import { School } from "@/types";
import RichText from "@/components/rich-text/RichText";

interface Props {
  content: School["content"];
  tags: School["tags"];
  school: School;
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    mt: "80px",
  },
  title: {},
  tagsContainer: {
    mt: "20px",
    gap: "16px",
    display: "flex",
  },
} satisfies Record<string, SxProps<Theme>>;

const ContentSchool: FC<Props> = ({ content }) => {
  if (!content) return null;

  return (
    <Box sx={styles.container}>
      <RichText>{content}</RichText>
    </Box>
  );
};

export default ContentSchool;
