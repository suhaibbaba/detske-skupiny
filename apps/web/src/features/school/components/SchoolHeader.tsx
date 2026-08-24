import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

import { School } from "@/types";
import { parseLinkField } from "@/components/ui/link/parser";
import Button from "@/components/ui/button";
import useTranslate from "@/hooks/useTranslate";
import { useLocale } from "next-intl";
import Image, { type ImageProps } from "@/components/ui/image";

interface Props {
  school: School;
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "20px 12px",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  name: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    width: "100%",
    height: "100%",
    maxWidth: "35px",
    maxHeight: "35px",
    objectFit: "contain",
  },
} satisfies Record<string, SxProps<Theme>>;

const SchoolHeader = ({ school }: Props) => {
  const translate = useTranslate();
  const locale = useLocale();

  return (
    <Box sx={styles.wrapper}>
      <Typography sx={styles.name} variant="h2">
        {school.logo && (
          <Image
            sx={styles.logo}
            src={school.logo}
            alt={school.name}
            sizes="35px"
          />
        )}
        {school.name}
      </Typography>
      {school.website && (
        <Button
          variant="secondary"
          href={parseLinkField(school.website, { locale }).url}
        >
          {translate("visitWebsite")}
        </Button>
      )}
    </Box>
  );
};

export default SchoolHeader;
