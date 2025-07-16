import {
  Box,
  Button,
  Stack,
  Typography,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Table,
  Chip,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import CheckmarkIcon from "@/components/icons/CheckmarkIcon";
import Gallery from "@/components/Gallery";

const DetailPage = () => {
  return (
    <Box>
      <Stack
        direction="row"
        gap="20px"
        justifyContent="space-between"
        alignItems="center"
        mb="24px"
      >
        <Typography variant="h2" component="h1">
          All Stars Kindergarten & Primary School
        </Typography>
        <Button color="secondary">Visit website</Button>
      </Stack>
      <Gallery />
      <Box component="section" sx={{ my: "24px" }}>
        <Stack direction="row" gap="16px" alignItems="center">
          <Chip
            label="Clickable Link"
            component="a"
            variant="outlined"
            href="#basic-chip"
            clickable
          />
          <Chip
            label="Clickable Link"
            component="a"
            variant="outlined"
            href="#basic-chip"
            clickable
            sx={{ borderColor: "#30B0C7" }}
          />
          <Chip
            label="Clickable Link"
            component="a"
            variant="outlined"
            href="#basic-chip"
            clickable
            sx={{ borderColor: "#FF3B30" }}
          />
        </Stack>
      </Box>
      <Box component="section">
        <Typography variant="h3" component="h2" fontSize="24px" mb="20px">
          Kontaktní informace
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              border: 1,
              borderColor: "#E5CDFA",
              backgroundColor: "primary.light",
              borderRadius: "12px",
              px: "24px",
              py: "16px",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                gap: "4px",
                alignItems: "center",
                mb: "8px",
              }}
            >
              <PlaceIcon sx={{ color: "secondary.dark" }} />
              <Typography variant="h4">Location</Typography>
            </Box>
            <Typography>
              Lstibořská 2396, Praha 21 - Újezd nad Lesy 190 16
            </Typography>
          </Box>
          <Box
            sx={{
              border: 1,
              borderColor: "#E5CDFA",
              backgroundColor: "primary.light",
              borderRadius: "12px",
              px: "24px",
              py: "16px",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                gap: "4px",
                alignItems: "center",
                mb: "8px",
              }}
            >
              <PlaceIcon sx={{ color: "secondary.dark" }} />
              <Typography variant="h4">Location</Typography>
            </Box>
            <Typography>
              Lstibořská 2396, Praha 21 - Újezd nad Lesy 190 16
            </Typography>
          </Box>
          <Box
            sx={{
              border: 1,
              borderColor: "#E5CDFA",
              backgroundColor: "primary.light",
              borderRadius: "12px",
              px: "24px",
              py: "16px",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                gap: "4px",
                alignItems: "center",
                mb: "8px",
              }}
            >
              <PlaceIcon sx={{ color: "secondary.dark" }} />
              <Typography variant="h4">Location</Typography>
            </Box>
            <Typography>
              Lstibořská 2396, Praha 21 - Újezd nad Lesy 190 16
            </Typography>
          </Box>
          <Box
            sx={{
              border: 1,
              borderColor: "#E5CDFA",
              backgroundColor: "primary.light",
              borderRadius: "12px",
              px: "24px",
              py: "16px",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                gap: "4px",
                alignItems: "center",
                mb: "8px",
              }}
            >
              <PlaceIcon sx={{ color: "secondary.dark" }} />
              <Typography variant="h4">Location</Typography>
            </Box>
            <Typography>
              Lstibořská 2396, Praha 21 - Újezd nad Lesy 190 16
            </Typography>
          </Box>
        </Box>
        <Box component="section">
          <Typography variant="h3" component="h2" fontSize="24px" mb="20px">
            O nás
          </Typography>
          <Typography>
            At All Stars, we create an inspiring environment where education
            meets play, and every child is supported as a unique individual. Our
            bilingual Czech-English program combines a joyful approach to early
            learning with structured development across language, movement,
            creativity, and social interaction. Our experienced teachers focus
            on respectful guidance, recognizing each child’s natural rhythm of
            development. From art workshops and science play to music and
            outdoor discovery, we support the whole child — academically,
            socially, and emotionally. We welcome children from 2.5 years and
            offer both kindergarten and primary-level education, making
            transitions smoother for families who wish to stay long-term.
          </Typography>
          <Box
            component="img"
            src="https://www.soukromeskolky.cz/uploads/2025/03/logo-drackova-jazykova-skola.png.webp"
          />
        </Box>
        <Box component="section">
          <Typography variant="h3" component="h2" fontSize="24px" mb="20px">
            What makes us special?
          </Typography>
          <Box
            component="ul"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              p: 0,
              m: 0,
            }}
          >
            <Box
              component="li"
              sx={{
                display: "inline-flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <SquareRoundedIcon
                sx={{ color: "secondary.dark", fontSize: "16px" }}
              />
              <Typography>Máme tohle</Typography>
            </Box>
            <Box
              component="li"
              sx={{
                display: "inline-flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <CheckmarkIcon />
              <Typography>Máme tohle</Typography>
            </Box>
          </Box>
        </Box>
        <Box component="section">
          <Typography variant="h3" component="h2" fontSize="24px" mb="20px">
            Our time table
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Activity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>06:30 - 06:45</TableCell>
                  <TableCell>Arrival & Free Play</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>06:30 - 06:45</TableCell>
                  <TableCell>Arrival & Free Play</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>06:30 - 06:45</TableCell>
                  <TableCell>Arrival & Free Play</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default DetailPage;
