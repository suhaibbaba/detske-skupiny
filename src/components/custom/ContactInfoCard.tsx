import React from "react";
import {
  Box,
  Typography,
  TypographyOwnProps,
  BoxProps,
  SvgIconProps,
} from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

interface Props {
  icon: SvgIconComponent;
  title: string;
  description?: React.ReactNode;
}

interface ContactInfoCardStyles {
  container?: BoxProps;
  iconBox?: BoxProps;
  icon?: SvgIconProps;
  title?: TypographyOwnProps;
  description?: BoxProps;
}

const styles: ContactInfoCardStyles = {
  container: {
    sx: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: "328px",
    },
  },
  iconBox: {
    sx: {
      bgcolor: "secondary.main",
      display: "flex",
      alignSelf: "baseline",
      justifyContent: "center",
      borderRadius: "50%",
      p: "14px",
      mb: 1,
      mx: "auto",
    },
  },
  icon: {
    sx: {
      color: "secondary.dark",
      fontSize: "36px",
    },
  },
  title: {
    variant: "h3",
    mb: 0.5,
  },
  description: {
    sx: {
      textAlign: "center",
      "& p": {
        m: 0,
      },
    },
  },
};

const ContactInfoCard: React.FC<Props> = ({ icon, title, description }) => {
  const IconComponent = icon as SvgIconComponent;
  return (
    <Box {...styles.container}>
      {IconComponent && (
        <Box {...styles.iconBox}>
          <IconComponent {...styles.icon} />
        </Box>
      )}
      <Typography {...styles.title}>{title}</Typography>
      {description && <Box {...styles.description}>{description}</Box>}
    </Box>
  );
};

export default ContactInfoCard;
