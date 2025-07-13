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
import PlaceIcon from "@mui/icons-material/Place";
import IllustrationChildrenGroup from "@/components/IllustrationChildrenGroup";
import IllustrationMain from "@/components/IllustrationMain";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronDownIcon from "@/components/icons/ChevronDown";
import Header from "@/components/Header";

const Page = () => {
  return (
    <Box>
      <Box
        component="section"
        sx={{ backgroundColor: "secondary.main", pt: "60px", pb: "120px" }}
      >
        <Container>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ maxWidth: "490px" }}>
              <Typography variant="h1">
                Your Guide to Private Kindergartens in{" "}
                <Box component="span" color="primary.main">
                  Prague
                </Box>
                ,{" "}
                <Box component="span" color="secondary.dark">
                  Prague
                </Box>{" "}
                & Beyond
              </Typography>
              <Typography mt="12px" mb="24px">
                Hundreds of childcare groups are already reaching local families
                through our platform. Add your listing today to be seen,
                contacted, and trusted by parents near you.
              </Typography>
              <Stack gap="12px" direction="row">
                <Button>Kinder Prague</Button>
                <Button color="secondary">Kinder Brno</Button>
                <Button>All Kinder</Button>
              </Stack>
            </Box>
            <Box sx={{ mr: "100px" }}>
              <IllustrationMain />
            </Box>
          </Box>
        </Container>
      </Box>
      <Box
        component="section"
        sx={{
          backgroundColor: "primary.light",
          py: "80px",
        }}
      >
        <Container>
          <Typography variant="h1" component="h2" textAlign="center">
            Our Latest Added Kinder Groups
          </Typography>
          <Typography mt="12px" textAlign="center">
            Hundreds of childcare groups are already reaching local families
            through our platform. Add your listing today to be seen, contacted,
            and trusted by parents near you.
          </Typography>
          <Grid container>
            <Grid size={6}>
              <Box
                sx={{
                  display: "flex",
                  borderRadius: "24px",
                  border: 1,
                  borderColor: "#AAB0B9",
                  overflow: "hidden",
                  boxShadow:
                    "0px 4px 6px 0px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    alt="green iguana"
                    width="260"
                    sx={{ width: "260px", height: 1, objectFit: "cover" }}
                    src="https://www.soukromeskolky.cz/uploads/2022/07/malvinaschool-2.jpg.webp"
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: "rgba(30, 35, 43, 0.6)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: "10px",
                    }}
                  >
                    <PlaceIcon sx={{ color: "primary.light" }} />
                    <Typography
                      sx={{
                        color: "#FBF8FE",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Brno
                    </Typography>
                  </Box>
                </Box>
                <Stack
                  gap="14px"
                  alignItems="flex-start"
                  sx={{ p: "20px 16px" }}
                >
                  <Typography
                    variant="h3"
                    component="a"
                    href="#"
                    sx={{
                      textDecoration: "underline",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    Malvína Preschool – Prague Karlín
                  </Typography>
                  <Typography>
                    A bilingual kindergarten and primary school that blends
                    Czech and English learning in a warm, creative environment.
                    Learning is fun, age-appropriate, and always child-centered.
                  </Typography>
                  <Button variant="outlined" sx={{ mt: "6px" }}>
                    View this School
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    endIcon={<PlaceIcon sx={{ color: "#9980B0" }} />}
                  >
                    View All
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box
        component="section"
        sx={{
          py: "80px",
        }}
      >
        <Container>
          <Box sx={{ display: "flex", gap: "80px", alignItems: "center" }}>
            <Box>
              <Typography variant="h1" component="h2" mb="12px">
                What Is a Neighbour Kinder Group?
              </Typography>
              <Typography>
                Neighbour Kinder Groups are trusted, independent kindergartens
                and childcare providers located right in your area — offering
                personalized care, community-based learning, and flexible
                programs. Whether it’s a Montessori preschool, language-focused
                group, or nature-based nursery, each listing is verified and
                created to help you find the perfect fit for your child.
              </Typography>
              <Button sx={{ mt: "24px" }}>View all Neighbour Schools</Button>
            </Box>
            <Box
              sx={{
                display: "inline-block",
                p: "20px",
                borderRadius: "24px",
                boxShadow:
                  "0px 4px 6px 0px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <IllustrationChildrenGroup />
            </Box>
          </Box>
        </Container>
      </Box>
      <Box
        component="section"
        sx={{
          backgroundColor: "secondary.main",
          py: "80px",
        }}
      >
        <Container>
          <Typography variant="h1" component="h2" textAlign="center">
            What Makes Our Premium Schools Stand Out?
          </Typography>
          <Typography mt="12px" textAlign="center">
            Our Community Partners enjoy premium visibility, added features, and
            show their commitment to early education excellence.
          </Typography>
          <Grid container sx={{ mt: "80px" }}>
            <Grid size={4}>
              <Box sx={{ textAlign: "center" }}>
                <Box>Icon</Box>
                <Typography my="12px" variant="h3">
                  Location-Based Filtering
                </Typography>
                <Typography>
                  Whether you're in Prague 3 or Brno-Komárov, find kinder groups
                  in your immediate area with smart nested filters — even down
                  to neighborhood level.
                </Typography>
              </Box>
              <Box sx={{ mt: "70px", textAlign: "center" }}>
                <Box>Icon</Box>
                <Typography my="12px" variant="h3">
                  Location-Based Filtering
                </Typography>
                <Typography>
                  Whether you're in Prague 3 or Brno-Komárov, find kinder groups
                  in your immediate area with smart nested filters — even down
                  to neighborhood level.
                </Typography>
              </Box>
            </Grid>
            <Grid size={4} alignContent="center">
              <Box sx={{ textAlign: "center" }}>
                <Box>Icon</Box>
                <Typography my="12px" variant="h3">
                  Location-Based Filtering
                </Typography>
                <Typography>
                  Whether you're in Prague 3 or Brno-Komárov, find kinder groups
                  in your immediate area with smart nested filters — even down
                  to neighborhood level.
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box sx={{ textAlign: "center" }}>
                <Box>Icon</Box>
                <Typography my="12px" variant="h3">
                  Location-Based Filtering
                </Typography>
                <Typography>
                  Whether you're in Prague 3 or Brno-Komárov, find kinder groups
                  in your immediate area with smart nested filters — even down
                  to neighborhood level.
                </Typography>
              </Box>
              <Box sx={{ mt: "70px", textAlign: "center" }}>
                <Box>Icon</Box>
                <Typography my="12px" variant="h3">
                  Location-Based Filtering
                </Typography>
                <Typography>
                  Whether you're in Prague 3 or Brno-Komárov, find kinder groups
                  in your immediate area with smart nested filters — even down
                  to neighborhood level.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box
        component="section"
        sx={{
          backgroundImage:
            "linear-gradient(0deg, rgba(250, 243, 192, 0.8), rgba(250, 243, 192, 0.8)), url('/balloon-bg.jpg')",
          backgroundSize: "100%",
          backgroundRepeat: "no-repeat",
          py: "96px",
        }}
      >
        <Container sx={{ textAlign: "center" }}>
          <Typography variant="h1" component="h2" fontSize="36px">
            Add Your Kinder Group
          </Typography>
          <Typography mt="16px" fontSize="20px">
            Do You Run a Kinder Group? Join Our Platform — It's Free to Start!
          </Typography>
          <Button sx={{ mt: "32px" }}>Add Your Kinder Group</Button>
        </Container>
      </Box>
      <Box
        component="section"
        sx={{
          backgroundColor: "secondary.main",
          py: "80px",
        }}
      >
        <Container>
          <Typography variant="h1" component="h2" textAlign="center">
            Map of Private Kindergartens
          </Typography>
          <Typography mt="12px" textAlign="center">
            Neighbour Kinder Groups are trusted, independent kindergartens and
            childcare providers located right in your area — offering
            personalized care, community-based learning, and flexible programs.
          </Typography>
          <Box
            sx={{
              mt: "64px",
              mb: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              gap: "24px",
              "& > *": {
                flex: 1,
              },
            }}
          >
            <Button variant="outlined" color="secondary">
              View All
            </Button>
            <Button variant="outlined" color="secondary">
              View Prague
            </Button>
            <Button variant="outlined" color="secondary">
              View Brno
            </Button>
          </Box>
        </Container>
      </Box>
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
