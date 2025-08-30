import {
  Box,
  Button,
  Typography,
  TypographyProps,
  BoxProps,
} from "@mui/material";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { School } from "@/sanity/types";
import { parseLinkField } from "@/components/ui/link/parser";

interface Props {
  school: School;
}

interface SchoolHeaderStyles {
  wrapper: BoxProps;
  name: TypographyProps;
  logo: BoxProps;
}

const styles: SchoolHeaderStyles = {
  wrapper: {
    sx: {
      display: "flex",
      alignItems: "center",
      gap: "20px 12px",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
  },
  name: {
    variant: "h2",
    sx: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
  },
  logo: {
    sx: {
      width: "100%",
      height: "100%",
      maxWidth: "35px",
      maxHeight: "35px",
      objectFit: "contain",
    },
  },
};

const SchoolHeader = ({ school }: Props) => {
  return (
    <Box {...styles.wrapper}>
      <Typography {...styles.name}>
        {school.logo && (
          <Box
            {...styles.logo}
            src={urlImageFor(school.logo)}
            alt={school.name}
            component="img"
          />
        )}
        {school.name}
      </Typography>
      {school.website && (
        <Button variant="secondary" href={parseLinkField(school.website).url}>
          Visit Website
        </Button>
      )}
    </Box>
  );
};

export default SchoolHeader;
