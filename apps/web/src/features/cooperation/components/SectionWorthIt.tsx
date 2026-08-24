import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Container, Typography, Paper } from "@mui/material";
import { SanityImageField } from "@/types";
import { FC } from "react";

import Image from "@/components/ui/image";

interface Props {
  fields: {
    heading: string;
    subheading: string;
    features?: {
      _key: string;
      icon: SanityImageField;
      title: string;
      description: string;
    }[];
  };
  locale?: string;
}

const styles = {
  container: {
    bgcolor: "custom.surfaceLilac",
    pt: "100px",
    pb: {
      xs: "80px",
      sm: "120px",
    },
  },
  headingBox: {
    mb: {
      xs: "50px",
      sm: "100px",
    },
    textAlign: "center",
  },
  title: { mb: "24px" },
  description: {
    mx: "auto",
    maxWidth: "852px",
  },
  featuresWrapper: {
    display: "flex",
    justifyContent: "space-around",
    rowGap: "60px",
    columnGap: "200px",
    flexWrap: "wrap",
  },
  featureCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    p: "24px",
    borderRadius: "24px",
    width: "258px",
    boxShadow: "none",
  },
  iconWrapper: {
    bgcolor: "secondary.main",
    width: "88px",
    height: "88px",
    borderRadius: "50%",
    padding: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontWeight: 900,
    fontSize: "20px",
  },
  cardDescription: {},
} satisfies Record<string, SxProps<Theme>>;

const SectionWorthIt: FC<Props> = ({ fields }) => {
  return (
    <Box sx={styles.container}>
      <Container>
        <Box sx={styles.headingBox}>
          <Typography sx={styles.title} variant="h1">
            {fields.heading}
          </Typography>
          <Typography sx={styles.description}>{fields.subheading}</Typography>
        </Box>
        <Box sx={styles.featuresWrapper}>
          {fields.features?.map((item) => (
            <Paper key={item._key} sx={styles.featureCard}>
              <Box sx={styles.iconWrapper}>
                <Image src={item.icon} alt={item.title} sizes="64px" />
              </Box>

              <Typography sx={styles.cardTitle} variant="h3" align="center">
                {item.title}
              </Typography>
              <Typography align="center">{item.description}</Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default SectionWorthIt;
