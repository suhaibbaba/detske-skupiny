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
  Breadcrumbs,
  ButtonBase,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import IllustrationChildrenGroup from "@/components/IllustrationChildrenGroup";
import IllustrationMain from "@/components/IllustrationMain";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import ChevronDownIcon from "@/components/icons/ChevronDown";
import Link from "next/link";
import ChevronRight from "@/components/icons/ChevronRight";

const Page = () => {
  return (
    <Box>
      <Box
        component="section"
        sx={{
          background: "linear-gradient(90deg, #FCF8E5 0%, #F8F2FE 100%)",
          pt: "40px",
          pb: "100px",
        }}
      >
        <Container>
          <Breadcrumbs
            separator={<ChevronRight />}
            aria-label="breadcrumb"
            sx={{ mb: "40px" }}
          >
            <Link href="/">MUI</Link>
            <Link href="/material-ui/getting-started/installation/">Core</Link>
            <Typography sx={{ color: "text.primary" }}>Breadcrumbs</Typography>
          </Breadcrumbs>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Box sx={{ maxWidth: "860px" }}>
              <Typography variant="h1">Kindergarten Group Listing</Typography>
              <Typography mt="12px" mb="24px">
                Hundreds of childcare groups are already reaching local families
                through our platform. Add your listing today to be seen,
                contacted, and trusted by parents near you.
              </Typography>
              <Stack gap="12px" direction="row" justifyContent="center">
                <Button>Kinder Prague</Button>
                <Button color="secondary">Kinder Brno</Button>
                <Button>All Kinder</Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
      <Box
        component="section"
        sx={{
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(/praha.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          py: "100px",
        }}
      >
        <Container>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap="20px"
          >
            <Box>
              <Typography variant="h2" textAlign="center">
                Kindergarten Schools in Prague
              </Typography>
              <Typography>
                There are a total of <strong>70</strong> schools listed in
                Prague
              </Typography>
            </Box>
            <Button variant="outlined">View all schools in Prague</Button>
          </Stack>
          <Typography variant="h3" my="38px">
            BY REGION
          </Typography>
          <Grid container spacing="24px">
            {[...new Array(12).keys()].map((idx) => (
              <Grid size={4} key={idx}>
                <ButtonBase
                  sx={{
                    width: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "24px",
                    backgroundColor: "white",
                    border: 1,
                    padding: "16px",
                    borderColor: "#EDEEF0",
                  }}
                >
                  <Stack direction="row" gap="12px" alignItems="center">
                    <Typography variant="h3">Prague 1</Typography>
                    <Box
                      sx={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "24px",
                        border: 1,
                        textAlign: "center",
                        borderColor: "secondary.dark",
                        flexShrink: 0,
                      }}
                    >
                      <Typography>3</Typography>
                    </Box>
                  </Stack>
                  <Box
                    sx={{
                      display: "flex",
                      width: "28px",
                      height: "28px",
                      justifyContent: "center",
                      alignItems: "center",
                      border: 1,
                      borderColor: "primary.main",
                      borderRadius: "24px",
                    }}
                  >
                    <ArrowRightIcon />
                  </Box>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box
        component="section"
        sx={{
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(/brno.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          py: "100px",
        }}
      >
        <Container>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap="20px"
          >
            <Box>
              <Typography variant="h2" textAlign="center">
                Kindergarten Schools in Brno
              </Typography>
              <Typography>
                There are a total of <strong>70</strong> schools listed in Brno
              </Typography>
            </Box>
            <Button variant="outlined">View all schools in Brno</Button>
          </Stack>
          <Typography variant="h3" my="38px">
            BY REGION
          </Typography>
          <Grid container spacing="24px">
            {[...new Array(12).keys()].map((idx) => (
              <Grid size={4} key={idx}>
                <ButtonBase
                  sx={{
                    width: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "24px",
                    backgroundColor: "white",
                    border: 1,
                    padding: "16px",
                    borderColor: "#EDEEF0",
                  }}
                >
                  <Stack direction="row" gap="12px" alignItems="center">
                    <Typography variant="h3">Brno 1</Typography>
                    <Box
                      sx={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "24px",
                        border: 1,
                        textAlign: "center",
                        borderColor: "secondary.dark",
                        flexShrink: 0,
                      }}
                    >
                      <Typography>3</Typography>
                    </Box>
                  </Stack>
                  <Box
                    sx={{
                      display: "flex",
                      width: "28px",
                      height: "28px",
                      justifyContent: "center",
                      alignItems: "center",
                      border: 1,
                      borderColor: "primary.main",
                      borderRadius: "24px",
                    }}
                  >
                    <ArrowRightIcon />
                  </Box>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box
        component="section"
        sx={{
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(/cesko.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          py: "100px",
        }}
      >
        <Container>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap="20px"
          >
            <Box>
              <Typography variant="h2" textAlign="center">
                Kindergarten Schools in Prague
              </Typography>
              <Typography>
                There are a total of <strong>70</strong> schools listed in
                Prague
              </Typography>
            </Box>
            <Button variant="outlined">View all schools in Prague</Button>
          </Stack>
          <Typography variant="h3" my="38px">
            BY REGION
          </Typography>
          <Grid container spacing="24px">
            {[...new Array(12).keys()].map((idx) => (
              <Grid size={4} key={idx}>
                <ButtonBase
                  sx={{
                    width: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "24px",
                    backgroundColor: "white",
                    border: 1,
                    padding: "16px",
                    borderColor: "#EDEEF0",
                  }}
                >
                  <Stack direction="row" gap="12px" alignItems="center">
                    <Typography variant="h3">Prague 1</Typography>
                    <Box
                      sx={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "24px",
                        border: 1,
                        textAlign: "center",
                        borderColor: "secondary.dark",
                        flexShrink: 0,
                      }}
                    >
                      <Typography>3</Typography>
                    </Box>
                  </Stack>
                  <Box
                    sx={{
                      display: "flex",
                      width: "28px",
                      height: "28px",
                      justifyContent: "center",
                      alignItems: "center",
                      border: 1,
                      borderColor: "primary.main",
                      borderRadius: "24px",
                    }}
                  >
                    <ArrowRightIcon />
                  </Box>
                </ButtonBase>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Page;
