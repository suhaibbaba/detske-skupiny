"use client";

import ContactInfoCard from "@/app/[locale]/contact-us/components/ContactInfoCard";
import { Box, BoxProps } from "@mui/material";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import ContactForm from "@/components/forms/ContactForm";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import { ContactUsItem, PageHero } from "@/sanity/types";

interface Props {
  pageHero: PageHero;
  contactUsItem: ContactUsItem[];
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
      sx: (theme) => ({
        background: theme.palette.gradients.ui1,
        pb: {
          xs: "64px",
          sm: "130px",
        },
      }),
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

const ContactUsPageClient = ({ contactUsItem, pageHero }: Props) => {
  return (
    <PageLayout extendedStyles={styles.pageLayout}>
      <Box {...styles.container}>
        <PageHeadingTypography
          title={pageHero.title}
          description={pageHero.description}
        />
        <Box {...styles.infoContainer}>
          <Box {...styles.contactInfoContainer}>
            {contactUsItem?.map((card) => (
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

export default ContactUsPageClient;
