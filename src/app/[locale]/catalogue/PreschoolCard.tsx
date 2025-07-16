import React, { FC } from "react";
import {
  Card,
  CardProps,
  CardMedia,
  CardMediaProps,
  CardContent,
  CardContentProps,
  Typography,
  CardActionArea,
  Box,
  alpha,
  Chip,
  ChipProps,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface Props {
  image: string;
  title: string;
  location?: string;
}

interface PreschoolCardStyles {
  container?: CardProps;
  cardMedia?: CardMediaProps;
  cardContent?: CardContentProps;
  locationChip?: ChipProps;
}

const styles: PreschoolCardStyles = {
  container: {
    sx: (theme) => ({
      width: "302px",
      flexShrink: 0,
      borderRadius: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      boxShadow: `
        0 4px 6px ${alpha(theme.palette.common.black, 0.06)},
        0 2px 4px ${alpha(theme.palette.common.black, 0.08)}
      `,
    }),
  },
  cardMedia: {
    sx: {
      width: "100%",
      position: "relative",
      height: 158,
      borderRadius: "24px",
    },
  },
  cardContent: {
    sx: {
      p: "10px 20px",
    },
  },
  locationChip: {
    sx: (theme) => ({
      position: "absolute",
      bottom: 17,
      left: 22,
      bgcolor: "white",
      color: "black",
      px: "10px",
      py: "8px",
      borderRadius: "24px",
      boxShadow: `
        0px 4px 6px 0px ${alpha(theme.palette.common.black, 0.05)}, 
        0px 10px 15px -3px ${alpha(theme.palette.common.black, 0.1)}
      `,
      "& .MuiChip-icon": {
        width: "20px",
        height: "20px",
        ml: 0,
        color: "secondary.dark",
        fontSize: "20px",
      },
      "& .MuiChip-label": {
        fontSize: "14px",
        p: "0 0 0 6px",
        fontWeight: 400,
      },
    }),
  },
};

const PreschoolCard: FC<Props> = ({ title, image, location }) => {
  return (
    <Card {...styles.container} data-test-selector="PreschoolCard">
      <CardActionArea>
        <Box p="10px" position="relative">
          <CardMedia {...styles.cardMedia} image={image} title={title} />
          {location && (
            <Chip
              icon={<LocationOnIcon />}
              label={location}
              {...styles.locationChip}
            />
          )}
        </Box>
        <CardContent {...styles.cardContent}>
          <Typography variant="h4" fontWeight={500} component="div">
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PreschoolCard;
