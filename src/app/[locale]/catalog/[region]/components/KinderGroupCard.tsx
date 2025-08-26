import Star from "@/components/icons/Star";
import {
  Box,
  BoxProps,
  Typography,
  TypographyProps,
  Chip,
  ChipProps,
  Button,
  ButtonProps,
  Avatar,
  Icon,
} from "@mui/material";
import Location from "@/components/icons/Location";
import { ellipses } from "@/utilites/strings";

interface KinderGroupCardProps {
  image: string;
  name: string;
  tags: string[];
  location: string;
  description: string;
  isPremium?: boolean;
  logo?: string;
}

interface KinderGroupCardStyles {
  card?: BoxProps;
  imageWrapper?: BoxProps;
  image?: BoxProps;
  premiumBadge?: ChipProps;
  logo?: BoxProps;
  name?: TypographyProps;
  tagsWrapper?: BoxProps;
  tag?: ChipProps;
  location?: TypographyProps;
  description?: TypographyProps;
  cta?: ButtonProps;
}

const styles: KinderGroupCardStyles = {
  card: {
    sx: (theme) => ({
      border: `1px solid ${theme.palette.custom.ui12}`,
      borderRadius: "24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      textAlign: "left",
      p: "20px",
      width: "100%",
      gap: "13px",
    }),
  },
  imageWrapper: {
    sx: {
      position: "relative",
    },
  },
  image: {
    sx: {
      width: "100%",
      height: "158px",
      objectFit: "cover",
      display: "block",
      borderRadius: "12px",
    },
  },
  premiumBadge: {
    size: "small",
    sx: (theme) => ({
      position: "absolute",
      top: 12,
      left: 12,
      bgcolor: "secondary.main",
      color: "custom.ui1",
      fontWeight: 400,
      fontSize: "14px",
      borderRadius: "24px",
      px: "10px",
      ".MuiChip-icon": {
        color: theme.palette.custom.ui19,
        ml: 0,
        mr: "4px",
      },
      ".MuiChip-label": {
        p: 0,
      },
    }),
  },
  logo: {
    sx: {
      width: "100%",
      height: "100%",
      maxWidth: "30px",
      maxHeight: "30px",
      mt: "4px",
    },
  },
  name: {
    fontSize: "18px",
    fontWeight: 500,
    color: "custom.ui13",
    sx: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
    },
  },
  tagsWrapper: {
    sx: {
      display: "flex",
      gap: "5px",
    },
  },
  tag: {
    size: "small",
    variant: "outlined",
    sx: {
      fontSize: "12px",
      fontWeight: 400,
      borderRadius: "24px",
    },
  },
  location: {
    sx: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: "custom.ui13",
    },
  },
  description: {
    sx: {
      ...ellipses(4),
    },
  },
  cta: {
    variant: "ghost",
    sx: (theme) => ({
      py: "8px",
      fontSize: "14px",
      width: "100%",
      borderColor: theme.palette.primary.main,
      "&:hover": {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
      },
    }),
  },
};

const KinderGroupCard = ({
  image,
  name,
  tags,
  location,
  description,
  isPremium,
  logo = "/icons/school.svg", // replace with actual logo if needed
}: KinderGroupCardProps) => {
  return (
    <Box {...styles.card}>
      <Box component="img" {...styles.image} src={image} alt={name} />
      {isPremium && (
        <Chip
          {...styles.premiumBadge}
          icon={
            <Star sx={{ width: "10px", height: "10px", color: "#8A866A" }} />
          }
          label="Premium"
        />
      )}
      <Typography {...styles.name}>
        <Box component="img" {...styles.logo} src={logo} alt="Logo" />
        {name}
      </Typography>
      <Box {...styles.tagsWrapper}>
        {tags.map((tag, idx) => (
          <Chip key={idx} {...styles.tag} label={tag} />
        ))}
      </Box>
      <Typography {...styles.location}>
        <Location
          sx={{ width: "16px", height: "20px", color: "secondary.dark" }}
        />
        {location}
      </Typography>
      <Typography {...styles.description}>{description}</Typography>
      <Button {...styles.cta}>View this School</Button>
    </Box>
  );
};

export default KinderGroupCard;
