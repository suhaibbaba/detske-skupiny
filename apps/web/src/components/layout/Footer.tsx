import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Typography, Container, Grid, Stack } from "@mui/material";
import { fetchFooterPage } from "@/lib/sanity/footer";

import { parseLinkField } from "@/components/ui/link/parser";
import Link from "@/components/ui/link/Link";
import EmailIcon from "@/components/icons/Email";
import PhoneIcon from "@/components/icons/Phone";
import { FooterContent } from "@/types/footer";
import LanguageSwitcher from "@/components/ui/language/LanguageSwitcher";
import Image, { type ImageProps } from "@/components/ui/image";
import CopyrightYear from "@/components/layout/CopyrightYear";

/** The placeholder Sanity authors write into the copyright line. */
const YEAR_PLACEHOLDER = "{0}";

const styles = {
  container: {
    backgroundColor: "primary.dark",
    pt: "64px",
    pb: "32px",
  },
  copyrightContainer: {
    borderTop: 1,
    borderColor: "primary.light",
    pt: "24px",
    mt: "48px",
    gap: "20px",
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
    },
    justifyContent: {
      xs: "flex-start",
      sm: "space-between",
    },
  },
  logoContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    width: 120,
    height: 30,
  },
  logo: {
    width: "auto",
    height: "auto",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  columnTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "white",
    textTransform: "uppercase",
    mb: "16px",
  },
  columnText: {
    fontSize: "16px",
    fontWeight: 400,
    color: "white",
    mb: "4px",
    whiteSpace: "pre-line",
  },
  copyright: {
    fontSize: "16px",
    fontWeight: 400,
    color: "white",
    mb: "4px",
    whiteSpace: "pre-line",
    textAlign: {
      xs: "left",
      sm: "right",
      md: "center",
    },
  },
  link: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "8px",
    fontSize: "16px",
    fontWeight: 400,
    color: "white",
    mb: "0",
    whiteSpace: "pre-line",
    alignSelf: "baseline",
    "&&:hover": {
      color: "white",
      opacity: 0.6,
    },
  },
  iconLink: {
    color: "var(--mui-palette-secondary-light)",
    width: "15px",
    height: "15px",
  },
  languageSwitcherContainer: {
    display: "flex",
    justifyContent: {
      sm: "flex-start",
      md: "flex-end",
    },
  },
} satisfies Record<string, SxProps<Theme>>;

const Footer = async ({ locale }: { locale: string }) => {
  const { footer } = await fetchFooterPage(locale);

  if (!footer) {
    return null;
  }

  const renderContentItem = (item: FooterContent, index: number) => {
    switch (item._type) {
      case "textItem":
        return (
          <Typography key={index} sx={styles.columnText}>
            {item.text}
          </Typography>
        );
      case "linkItem":
        const link = parseLinkField(item.link);

        if (link) {
          if (["email", "phone"].includes(link.type)) {
            // remove protocol prefix (mailto: or tel:) from the URL for display
            const displayUrl = link.url.includes(":")
              ? link.url.split(":")[1]
              : link.url;

            return (
              <Link
                key={index}
                href={link.url}
                target={link.target}
                sx={styles.link}
              >
                {link.type === "email" && <EmailIcon sx={styles.iconLink} />}
                {link.type === "phone" && <PhoneIcon sx={styles.iconLink} />}
                {displayUrl}
              </Link>
            );
          }

          return (
            <Link
              key={index}
              href={link.url}
              sx={styles.link}
              target={link.target}
            >
              {link.text}
            </Link>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <Box component="footer" sx={styles.container}>
      <Container>
        <Grid container spacing={4}>
          {footer.columns?.map((column, idx) => (
            <Grid key={column.title || idx} size={{ xs: 12, sm: 6, md: 4 }}>
              {column.title && (
                <Typography sx={styles.columnTitle}>{column.title}</Typography>
              )}
              <Stack
                sx={{
                  gap: "12px",
                }}
              >
                {column.content?.map((item, itemIndex: number) =>
                  renderContentItem(item, itemIndex),
                )}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Box sx={styles.copyrightContainer}>
          {footer.logo && (
            <Box sx={styles.logoContainer}>
              <Image
                src={footer.logo}
                alt="Logo"
                sizes="120px"
                sx={styles.logo}
              />
            </Box>
          )}
          {footer.copyright && (
            <Typography sx={styles.copyright}>
              {/*
               * `{0}` is spliced, not replaced. Reading the clock here would
               * bake a year into the cached render of this server component;
               * CopyrightYear is a client leaf that reads it per visitor.
               */}
              {footer.copyright
                .split(YEAR_PLACEHOLDER)
                .flatMap((part, index) =>
                  index === 0
                    ? [part]
                    : [<CopyrightYear key={`year-${index}`} />, part],
                )}
            </Typography>
          )}

          <Box sx={styles.languageSwitcherContainer}>
            <LanguageSwitcher />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
