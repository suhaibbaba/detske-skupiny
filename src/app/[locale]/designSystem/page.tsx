import { Box, Button, Container } from "@mui/material";

const Page = () => {
  return (
    <Container>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          justifyContent: "space-between",
          gap: "0.5rem",
          padding: "5rem",
        }}
      >
        <Button variant="contained">contained</Button>
        <Button variant="outlined">outlined</Button>
        <Button variant="text">text</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">ghost</Button>
      </Box>
    </Container>
  );
};

export default Page;
