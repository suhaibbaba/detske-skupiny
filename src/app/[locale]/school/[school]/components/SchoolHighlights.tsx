import { Box, Typography, TypographyProps } from "@mui/material";
import RichText from "@/sanity/components/RichText";
import { SanityRichTextField } from "@/sanity/types";

const sectionHeading: TypographyProps = {
  color: "custom.ui13",
  fontSize: "24px",
  fontWeight: 600,
  mt: "80px",
  mb: "20px",
};

interface Props {
  highlights?: SanityRichTextField;
}

const SchoolHighlights = ({ highlights }: Props) => {
  if (!highlights) {
    return null;
  }

  return (
    <Box component="section">
      <Typography {...sectionHeading}>Highlights</Typography>
      <RichText>{highlights}</RichText>
    </Box>
  );
};

export default SchoolHighlights;
