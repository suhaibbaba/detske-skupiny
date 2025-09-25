"use client";

import {
  Box,
  BoxProps,
  Container,
  Typography,
  TypographyOwnProps,
} from "@mui/material";
import WriterCard from "@/app/[locale]/blogs/components/WriterCard";
import { FC } from "react";
import { Author } from "@/types/blog";
import useTranslate from "@/hooks/useTranslate";

interface Props {
  writers?: Author[];
}

interface WritersSectionStyles {
  container?: BoxProps;
  title?: TypographyOwnProps;
  writersContainer?: BoxProps;
}

const styles: WritersSectionStyles = {
  container: {
    sx: {
      bgcolor: "custom.ui15",
      py: "100px",
    },
  },
  title: {
    variant: "h1",
    sx: {
      textAlign: "center",
      mb: "64px",
    },
  },
  writersContainer: {
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      },
      gap: {
        xs: "32px",
        sm: "60px",
      },
      justifyItems: "center",
    },
  },
};

const WritersSection: FC<Props> = ({ writers }) => {
  const translate = useTranslate();

  if (!writers || writers.length === 0) {
    return null;
  }

  return (
    <Box {...styles.container}>
      <Container>
        <Typography {...styles.title}>{translate("ourWriters")}</Typography>
        <Box {...styles.writersContainer}>
          {writers.map((writer) => (
            <WriterCard key={writer.id} {...writer} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default WritersSection;
