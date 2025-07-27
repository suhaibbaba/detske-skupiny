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
import { useState } from "react";
import ChevronDown from "@/components/icons/ChevronDown";

interface FaqItem {
  question: string;
  answer: string;
}

const faqList: FaqItem[] = [
  {
    question: "How do I find a kindergarten near my home?",
    answer:
      "You can use our smart filtering system to browse by region, city, or even specific districts like Prague 6 or Brno-Komárov. You can also view kinder groups directly on an interactive map.",
  },
  {
    question: "Can I contact the kindergarten directly?",
    answer: "",
  },
  {
    question: "What’s the difference between a Free and Premium listing?",
    answer:
      "Free listings include basic info like name, contact, and description.\nPremium listings offer extras like photo galleries, detailed program info, performance stats, and are highlighted throughout the site.",
  },
  {
    question: "Are the kinder groups on your site verified?",
    answer: "",
  },
  {
    question: "How do I list my kindergarten on this platform?",
    answer: "",
  },
];

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
    sx: {
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
      },
      "&::before": {
        right: "100%",
        marginRight: "16px",
      },
      "&::after": {
        left: "100%",
        marginLeft: "16px",
      },
    },
  },
  accordionList: {
    sx: {
      display: "flex",
      flexDirection: "column",
      gap: "28px",
    },
  },
};

const FaqSection = () => {
  const [expanded, setExpanded] = useState<string | false>("0");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box {...styles.section}>
      <Container {...styles.container}>
        <Typography {...styles.heading}>Frequently Asked Questions</Typography>
        <Box {...styles.accordionList}>
          {faqList.map((faq, idx) => (
            <Accordion
              key={idx}
              {...styles.accordion}
              expanded={expanded === `${idx}`}
              onChange={handleChange(`${idx}`)}
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
