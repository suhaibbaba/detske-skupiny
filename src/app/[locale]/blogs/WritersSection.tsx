"use client";

import {
  Box,
  BoxProps,
  Container,
  Typography,
  TypographyOwnProps,
} from "@mui/material";
import WriterCard, {
  Props as WriterProps,
} from "@/app/[locale]/blogs/WriterCard";
import { FC } from "react";
import useSafeTranslations from "@/hooks/useSafeTranslations";

interface Props {
  writers: WriterProps[];
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
  const translate = useSafeTranslations("BlogsPage");

  return (
    <Box {...styles.container}>
      <Container>
        <Typography {...styles.title}>{translate("Our Writers")}</Typography>
        <Box {...styles.writersContainer}>
          {writers.map((writer) => (
            <WriterCard
              key={writer.name}
              name={writer.name}
              bio={writer.bio}
              image={writer.image}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default WritersSection;
