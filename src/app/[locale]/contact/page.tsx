import ContactInfoCard from "@/app/[locale]/contact/components/ContactInfoCard";
import { Box, BoxProps, useTheme } from "@mui/material";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import ContactForm from "@/components/forms/ContactForm";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import { getContactPage } from "@/sanity/queries";
import { SanityImageField, SanityRichTextField } from "@/sanity/types";

interface ContactUsItem {
  image?: SanityImageField;
  title?: string;
  description?: SanityRichTextField;
}

interface Props {
  fields: {
    title: string;
    subtitle: SanityRichTextField;
    items?: ContactUsItem[];
  };
}

interface ContactUsStyles {
  pageLayout?: PageLayoutStyles;
  container?: BoxProps;
  infoContainer?: BoxProps;
  contactInfoContainer?: BoxProps;
  formContainer?: BoxProps;
}

const styles: ContactUsStyles = {
  pageLayout: {
    section: {
      sx: {
        background: "var(--mui-palette-gradients-ui1)",
        pb: {
          xs: "64px",
          sm: "130px",
        },
      },
    },
  },
  container: {
    sx: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: 15,
    },
  },
  infoContainer: {
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr 1fr",
      },
      gap: "64px",
    },
  },
  contactInfoContainer: {
    sx: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "30px",
    },
  },
  formContainer: {
    sx: {
      bgcolor: "common.white",
      p: "32px",
      borderRadius: "16px",
    },
  },
};

const Page = async () => {
  const { ...fields } = (await getContactPage()) as Props["fields"];

  return (
    <PageLayout extendedStyles={styles.pageLayout}>
      <Box {...styles.container}>
        <PageHeadingTypography
          title={fields.title}
          description={fields.subtitle}
        />
        <Box {...styles.infoContainer}>
          <Box {...styles.contactInfoContainer}>
            {fields.items?.map((card) => (
              <ContactInfoCard
                key={card.title}
                image={card.image}
                title={`${card.title}:`}
                description={card.description}
              />
            ))}
          </Box>
          <ContactForm />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default Page;
