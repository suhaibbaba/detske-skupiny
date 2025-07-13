import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
} from "@mui/material";
import { ReactNode } from "react";

const SidebarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Container>
      <Box
        sx={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "60px" }}
      >
        <Stack gap="16px">
          <Box
            sx={{
              display: "inline-flex",
              justifyContent: "space-between",
              gap: "20px",
              alignItems: "center",
              borderBottom: 1,
              borderColor: "#AAB0B9",
              pb: "20px",
            }}
          >
            <Typography variant="h3">Filters</Typography>
            <Button>Clear all</Button>
          </Box>
          <Group title="Hlavní městské části">
            <FormControl sx={{ width: 1 }}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Praha 2"
                  />
                  <Box
                    sx={{
                      height: "28px",
                      width: "28px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "24px",
                      border: 1,
                      borderColor: "#E0C3F9",
                    }}
                  >
                    <Typography
                      component="span"
                      fontSize="14px"
                      color="#272E39"
                    >
                      14
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Praha 3"
                  />
                  <Box
                    sx={{
                      height: "28px",
                      width: "28px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "24px",
                      border: 1,
                      borderColor: "#E0C3F9",
                    }}
                  >
                    <Typography
                      component="span"
                      fontSize="14px"
                      color="#272E39"
                    >
                      14
                    </Typography>
                  </Box>
                </Box>
              </RadioGroup>
            </FormControl>
            <Button variant="text">View all</Button>
          </Group>

          <Group title="Tags">
            <Chip
              label="Clickable Link"
              component="a"
              variant="outlined"
              href="#basic-chip"
              clickable
              sx={{ borderColor: "#30B0C7" }}
            />
            <Button variant="text">View all</Button>
          </Group>
        </Stack>
        <Box>{children}</Box>
      </Box>
    </Container>
  );
};

const Group = ({ children, title }: { children: ReactNode; title: string }) => {
  return (
    <Stack
      gap="16px"
      alignItems="flex-start"
      sx={{ pb: "20px", borderBottom: 1, borderColor: "#AAB0B9" }}
    >
      <Typography fontSize="18px" fontWeight="500" color="#272E39">
        {title}
      </Typography>
      {children}
    </Stack>
  );
};

export default SidebarLayout;
