"use client";

import ContactInfoCard from "@/app/[locale]/contact/components/ContactInfoCard";
import { Box, BoxProps, useTheme } from "@mui/material";
import useSafeTranslations from "@/hooks/useSafeTranslations";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import data from "@/data/contactUs";
import ContactForm from "@/components/forms/ContactForm";
import PageLayout from "@/components/layout/PageLayout";

interface ContactUsStyles {
  section?: BoxProps;
  container?: BoxProps;
  infoContainer?: BoxProps;
  contactInfoContainer?: BoxProps;
  formContainer?: BoxProps;
}

const styles: ContactUsStyles = {
  section: {
    sx: (theme) => ({
      background: theme.palette.gradients.ui1,
      pb: {
        xs: "64px",
        sm: "130px",
      },
    }),
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

const Page = () => {
  const theme = useTheme();
  const translate = useSafeTranslations("ContactUsPage");

  return (
    <PageLayout sectionStyles={styles.section}>
      <Box {...styles.container}>
        <PageHeadingTypography
          title={translate(data.heading)}
          description={translate(data.description)}
        />
        <Box {...styles.infoContainer}>
          <Box {...styles.contactInfoContainer}>
            {data.contactInfoCardList.map((card) => (
              <ContactInfoCard
                key={card.title}
                icon={card.icon}
                title={`${translate(card.title)}:`}
                description={card.description(theme)}
              />
            ))}
          </Box>
          <ContactForm translate={translate} />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default Page;
