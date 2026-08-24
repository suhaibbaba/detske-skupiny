/**
 * Deliberately not a Client Component.
 *
 * Its only reason to be one was the translation hook, and this is rendered
 * straight from the school detail page - a Server Component - so it can take
 * the server translator instead. That moves the whole info-card grid, and the
 * items inside it, off the hydration path.
 */
import { Box } from "@mui/material";
import InfoCardItem, {
  InfoCardItemProps,
} from "@/features/school/components/InfoCardItem";
import { getTranslateServer } from "@/hooks/useTranslate";
import type { SxProps, Theme } from "@mui/material/styles";

interface InfoCardGridProps {
  items: InfoCardItemProps[];
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
    gap: "24px 20px",
  },
} satisfies Record<string, SxProps<Theme>>;

const InfoCardGrid = async ({ items }: InfoCardGridProps) => {
  const translate = await getTranslateServer();

  return (
    <Box sx={styles.container}>
      {items.map((item, index) => (
        <InfoCardItem key={index} {...item} title={translate(item.title)} />
      ))}
    </Box>
  );
};

export default InfoCardGrid;
