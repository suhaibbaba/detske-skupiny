import {
  Typography,
  Breadcrumbs as MuiBreadcrumbs,
} from "@mui/material";
import ChevronRight from "@/components/icons/ChevronRight";
import Link from "next/link";

const Breadcrumbs = () => {
  return (
    <MuiBreadcrumbs
      separator={<ChevronRight />}
      aria-label="breadcrumb"
      sx={{ mb: "40px" }}
    >
      <Link href="/">MUI</Link>
      <Link href="/material-ui/getting-started/installation/">Core</Link>
      <Typography sx={{ color: "text.primary" }}>Breadcrumbs</Typography>
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;