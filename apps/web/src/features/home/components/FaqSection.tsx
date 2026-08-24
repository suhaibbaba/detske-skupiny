import type { SxProps, Theme } from "@mui/material/styles";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ChevronDown from "@/components/icons/ChevronDown";
import { sharedClassNames } from "@/features/home/utils";

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

const styles = {
  section: {
    bgcolor: "common.white",
    py: { xs: "50px", md: "120px" },
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: "md",
    mx: "auto",
  },
  heading: {
    textAlign: "center",
    fontSize: "40px",
    mx: "auto",
    mb: { xs: "40px", md: "80px" },
    position: "relative",
    alignSelf: "baseline",
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      width: "122px",
      height: "1px",
      backgroundColor: "common.black",
      display: {
        xs: "none", // hidden on mobile
        sm: "block", // visible on sm and up
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
  },
  accordionList: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
} satisfies Record<string, SxProps<Theme>>;

const FaqSection = ({ fields }: Props) => {
  return (
    <Box sx={styles.section} className={sharedClassNames.faq}>
      <Container sx={styles.container}>
        <Typography sx={styles.heading} variant="h1">
          {fields.title}
        </Typography>
        <Box sx={styles.accordionList}>
          {fields.items?.map((faq, idx) => (
            <Accordion key={idx} defaultExpanded={faq.openByDefault}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls={`panel${idx}-content`}
                id={`panel${idx}-header`}
              >
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              {faq.answer && (
                <AccordionDetails>
                  <Typography>{faq.answer}</Typography>
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
