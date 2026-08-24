import type { SxProps, Theme } from "@mui/material/styles";
import React from "react";
import { Box, Typography } from "@mui/material";

import { SanityImageField, SanityRichTextField } from "@/types";

import RichText from "@/components/rich-text/RichText";
import Image from "@/components/ui/image";

interface Props {
  image?: SanityImageField;
  title: string;
  description?: SanityRichTextField;
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "328px",
  },
  iconBox: {
    bgcolor: "secondary.main",
    display: "flex",
    alignSelf: "baseline",
    justifyContent: "center",
    borderRadius: "50%",
    p: "14px",
    mb: 1,
    mx: "auto",
  },
  icon: {
    color: "secondary.dark",
    fontSize: "36px",
  },
  title: {
    mb: "4px",
    fontSize: "20px",
  },
  description: {
    textAlign: "center",
    "& p": {
      m: 0,
    },
  },
} satisfies Record<string, SxProps<Theme>>;

const ContactInfoCard: React.FC<Props> = ({ image, title, description }) => {
  return (
    <Box sx={styles.container}>
      {image && <Image src={image} alt={title} sizes="80px" />}
      <Typography sx={styles.title} variant="h3">
        {title}
      </Typography>
      {description && (
        <RichText sx={styles.description}>{description}</RichText>
      )}
    </Box>
  );
};

export default ContactInfoCard;
