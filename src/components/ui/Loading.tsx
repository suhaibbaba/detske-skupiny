// components/GlobalLoading.tsx
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Skeleton,
} from "@mui/material";

export default function Loading() {
  return (
    <>
      <Container sx={{ py: 4, minHeight: "100vh" }}>
        {/* Generic loading that works for any page */}
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />

        {/* Add padding content to exceed 1024 bytes */}
        <Box sx={{ display: "flex", gap: 2, my: 3 }}>
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={150}
              sx={{ flex: 1 }}
            />
          ))}
        </Box>
        <Skeleton variant="rectangular" height={300} />
      </Container>
      <Backdrop sx={{ color: "#fff", zIndex: 999 }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
