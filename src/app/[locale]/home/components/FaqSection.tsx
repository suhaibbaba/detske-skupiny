"use client";

import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionProps,
} from "@mui/material";
import ChevronDown from "@/components/icons/ChevronDown";

interface FaqItem {
  question: string;
  answer?: string;
  openByDefault?: boolean;
}

interface Props {
  fields: {
    title: string;
    items?: FaqItem[];
  };
}

interface FaqSectionStyles {
  section?: BoxProps;
  container?: ContainerProps;
  heading?: TypographyProps;
  accordionList?: BoxProps;
  accordion?: AccordionProps;
  question?: TypographyProps;
  answer?: TypographyProps;
}

const styles: FaqSectionStyles = {
  section: {
    sx: {
      bgcolor: "common.white",
      py: "120px",
    },
  },
  container: {
    sx: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      maxWidth: "md",
      mx: "auto",
    },
  },
  heading: {
    variant: "h1",
    fontSize: "40px",
    textAlign: "center",
    sx: (theme) => ({
      mx: "auto",
      mb: "80px",
      position: "relative",
      alignSelf: "baseline",
      "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        width: "122px",
        height: "1px",
        backgroundColor: "common.black",
        [theme.breakpoints.down("sm")]: {
          display: "none",
        },
      },
      "&::before": {
        right: "100%",
        marginRight: "16px",
      },
      "&::after": {
        left: "100%",
        marginLeft: "16px",
      },
    }),
  },
  accordionList: {
    sx: {
      display: "flex",
      flexDirection: "column",
      gap: "28px",
    },
  },
};

const FaqSection = ({ fields }: Props) => {
  return (
    <Box {...styles.section}>
      <Container {...styles.container}>
        <Typography {...styles.heading}>{fields.title}</Typography>
        <Box {...styles.accordionList}>
          {fields.items?.map((faq, idx) => (
            <Accordion
              key={idx}
              {...styles.accordion}
              defaultExpanded={faq.openByDefault}
            >
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls={`panel${idx}-content`}
                id={`panel${idx}-header`}
              >
                <Typography {...styles.question}>{faq.question}</Typography>
              </AccordionSummary>
              {faq.answer && (
                <AccordionDetails>
                  <Typography {...styles.answer}>{faq.answer}</Typography>
                </AccordionDetails>
              )}
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FaqSection;
