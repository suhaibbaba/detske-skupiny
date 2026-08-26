/**
 * Deliberately not a Client Component.
 *
 * The only thing that would force it is the translation hook, and this renders
 * straight from the school detail page - a Server Component - so it takes the
 * server translator instead. That keeps the whole info-card grid, and the items
 * inside it, off the hydration path.
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
