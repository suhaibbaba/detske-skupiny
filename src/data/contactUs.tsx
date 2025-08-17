import { LocationOn, Phone, Store } from "@mui/icons-material";
import { Theme, Typography } from "@mui/material";
import { formatMessage } from "@/utilites/strings";
import Link from "@mui/material/Link";
import NextLink from "next/link";

export default {
  heading: "heading",
  description: "description",
  contactInfoCardList: [
    {
      icon: Store,
      title: "Company Information",
      description: () => (
        <>
          <Typography>Themesberg LLC</Typography>
          <Typography>Tax Id: USXXXXXX</Typography>
        </>
      ),
    },
    {
      icon: LocationOn,
      title: "Address",
      description: () => (
        <>
          <Typography>SILVER LAKE, United States 1941 Late Avenue</Typography>
          <Typography>
            {formatMessage(
              "{0} code: 03875",
              <Typography component="span">Zip Code/Postal</Typography>,
            )}
          </Typography>
        </>
      ),
    },
    {
      icon: Phone,
      title: "Contact Us",
      description: () => (
        <>
          <Typography>
            Email us for general queries, including marketing and partnership
            opportunities.
          </Typography>
          <Link
            component={NextLink}
            href={`mailto:hello@company.com`}
            sx={{
              display: "block",
              mt: 0.5,
              textDecoration: "none",
            }}
          >
            hello@company.com
          </Link>
        </>
      ),
    },
  ],
};
