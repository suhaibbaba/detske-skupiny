"use client";

import {
  Box,
  BoxProps,
  Container,
  Typography,
  TypographyOwnProps,
} from "@mui/material";
import WriterCard from "@/app/[locale]/blog/components/WriterCard";
import { FC } from "react";
import { Author } from "@/types/blog";

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
    sx: (theme) => ({
      backgroundColor: theme.palette.custom.ui15,
      py: "100px",
      mt: "120px",
    }),
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
  if (!writers) {
    return null;
  }

  return (
    <Box {...styles.container}>
      <Container>
        <Typography {...styles.title}>Our Writers</Typography>
        <Box {...styles.writersContainer}>
          {writers.map((writer) => (
            <WriterCard
              key={writer._id}
              _id={writer._id}
              name={writer.name}
              role={writer.bio}
              image={writer.image}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default WritersSection;
