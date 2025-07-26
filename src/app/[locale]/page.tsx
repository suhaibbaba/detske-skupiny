import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ChevronDownIcon from "@/components/icons/ChevronDown";
import HeroSection from "@/app/[locale]/home/components/HeroSection";
import LatestKinderGroupsSection from "@/app/[locale]/home/components/LatestKinderGroupsSection";
import NeighbourKinderGroupSection from "@/app/[locale]/home/components/NeighbourKinderGroupSection";
import PremiumSchoolsFeatureSection from "@/app/[locale]/home/components/PremiumSchoolsFeatureSection";
import AddKinderGroupSection from "@/app/[locale]/home/components/AddKinderGroupSection";
import KindergartenMapSection from "@/app/[locale]/home/components/KindergartenMapSection";

const Page = () => {
  return (
    <Box>
      <HeroSection />
      <LatestKinderGroupsSection />
      <NeighbourKinderGroupSection />
      <PremiumSchoolsFeatureSection />
      <AddKinderGroupSection />
      <KindergartenMapSection />
      <Box
        component="section"
        sx={{
          py: "80px",
        }}
      >
        <Container>
          <Accordion>
            <AccordionSummary
              expandIcon={<ChevronDownIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">Accordion 1</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ color: "#6C7685", fontSize: "18px" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ChevronDownIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography component="span">Accordion 2</Typography>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ChevronDownIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
              sx={{ flexDirection: "row-reverse" }}
            >
              <Typography component="span">Accordion Actions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>
        </Container>
      </Box>
      <Box
        component="section"
        sx={{
          backgroundColor: "#F3E8FD",
          py: "100px",
        }}
      >
        <Container>
          <Typography variant="h1" component="h2" textAlign="center">
            From Our Blog: Tips, Insights & Parent Guides
          </Typography>
          <Typography mt="12px" textAlign="center">
            Explore helpful articles about early education, choosing the right
            kindergarten, and making the transition smoother for both kids and
            parents.
          </Typography>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "48px",
                mt: "64px",
              }}
            >
              <Box
                sx={{
                  borderRadius: "24px",
                  p: "24px",
                  backgroundColor: "white",
                  boxShadow:
                    "0px 4px 6px 0px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  component="img"
                  alt="green iguana"
                  width="260"
                  sx={{ width: "260px", height: 1, objectFit: "cover" }}
                  src="https://www.soukromeskolky.cz/uploads/2022/07/malvinaschool-2.jpg.webp"
                />
                <Stack gap="12px" alignItems="flex-start">
                  <Box
                    sx={{
                      px: "10px",
                      py: "2px",
                      backgroundColor: "#F3E8FD",
                      display: "inline-block",
                      borderRadius: "12px",
                    }}
                  >
                    <Typography
                      color="#776388"
                      fontSize="14px"
                      component="span"
                    >
                      Článek
                    </Typography>
                  </Box>
                  <Typography variant="h3">
                    How to Choose the Right Kindergarten for Your Child
                  </Typography>
                  <Typography>
                    Over the past year, Volosoft has undergone many changes!
                    After months of preparation and some hard work, we moved to
                    our new office.
                  </Typography>
                </Stack>
              </Box>
              <Box
                sx={{
                  borderRadius: "24px",
                  p: "24px",
                  backgroundColor: "white",
                  boxShadow:
                    "0px 4px 6px 0px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  component="img"
                  alt="green iguana"
                  width="260"
                  sx={{ width: "260px", height: 1, objectFit: "cover" }}
                  src="https://www.soukromeskolky.cz/uploads/2022/07/malvinaschool-2.jpg.webp"
                />
                <Stack gap="12px" alignItems="flex-start">
                  <Box
                    sx={{
                      px: "10px",
                      py: "2px",
                      backgroundColor: "#F3E8FD",
                      display: "inline-block",
                      borderRadius: "12px",
                    }}
                  >
                    <Typography
                      color="#776388"
                      fontSize="14px"
                      component="span"
                    >
                      Článek
                    </Typography>
                  </Box>
                  <Typography variant="h3">
                    How to Choose the Right Kindergarten for Your Child
                  </Typography>
                  <Typography>
                    Over the past year, Volosoft has undergone many changes!
                    After months of preparation and some hard work, we moved to
                    our new office.
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Page;
