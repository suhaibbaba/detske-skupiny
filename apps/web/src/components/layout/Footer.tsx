import {
  Box,
  Typography,
  Container,
  Grid,
  Stack,
  BoxProps,
  TypographyOwnProps,
  StackProps,
  LinkProps,
  SvgIconProps,
} from "@mui/material";
import { fetchFooterPage } from "@/sanity/queries/footer";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { parseLinkField } from "@/components/ui/link/parser";
import Link from "@/components/ui/link/Link";
import EmailIcon from "@/components/icons/Email";
import PhoneIcon from "@/components/icons/Phone";
import { FooterContent } from "@/types/footer";
import LanguageSwitcher from "@/components/ui/Language/LanguageSwitcher";
import Image, { type ImageProps } from "@/components/ui/image";

interface FooterStyles {
  container?: BoxProps;
  copyrightContainer?: BoxProps;
  logoContainer?: BoxProps;
  logo?: ImageProps;
  columnTitle?: TypographyOwnProps;
  columnText?: TypographyOwnProps;
  copyright?: TypographyOwnProps;
  link?: LinkProps;
  iconLink?: SvgIconProps;
  languageSwitcherContainer?: BoxProps;
}

const styles: FooterStyles = {
  container: {
    sx: {
      backgroundColor: "primary.dark",
      pt: "64px",
      pb: "32px",
    },
  },
  copyrightContainer: {
    sx: {
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
  },
  logoContainer: {
    sx: {
      position: "relative",
      display: "flex",
      justifyContent: "flex-start",
      width: 120,
      height: 30,
    },
  },
  logo: {
    sx: {
      width: "auto",
      height: "auto",
      maxWidth: "100%",
      maxHeight: "100%",
    },
  },
  columnTitle: {
    sx: {
      fontSize: "14px",
      fontWeight: 600,
      color: "white",
      textTransform: "uppercase",
      mb: "16px",
    },
  },
  columnText: {
    sx: {
      fontSize: "16px",
      fontWeight: 400,
      color: "white",
      mb: "4px",
      whiteSpace: "pre-line",
    },
  },
  copyright: {
    sx: {
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
  },
  link: {
    sx: {
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
  },
  iconLink: {
    sx: {
      color: "var(--mui-palette-secondary-light)",
      width: "15px",
      height: "15px",
    },
  },
  languageSwitcherContainer: {
    sx: {
      display: "flex",
      justifyContent: {
        sm: "flex-start",
        md: "flex-end",
      },
    },
  },
};

const Footer = async ({ locale }: { locale: string }) => {
  const { footer } = await fetchFooterPage(locale);

  if (!footer) {
    return null;
  }

  const renderContentItem = (item: FooterContent, index: number) => {
    switch (item._type) {
      case "textItem":
        return (
          <Typography key={index} {...styles.columnText}>
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
                {...styles.link}
              >
                {link.type === "email" && <EmailIcon {...styles.iconLink} />}
                {link.type === "phone" && <PhoneIcon {...styles.iconLink} />}
                {displayUrl}
              </Link>
            );
          }

          return (
            <Link
              key={index}
              href={link.url}
              {...styles.link}
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
    <Box component="footer" {...styles.container}>
      <Container>
        <Grid container spacing={4}>
          {footer.columns?.map((column, idx) => (
            <Grid key={column.title || idx} size={{ xs: 12, sm: 6, md: 4 }}>
              {column.title && (
                <Typography {...styles.columnTitle}>{column.title}</Typography>
              )}
              <Stack gap="12px">
                {column.content?.map((item, itemIndex: number) =>
                  renderContentItem(item, itemIndex),
                )}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Box {...styles.copyrightContainer}>
          {footer.logo && (
            <Box {...styles.logoContainer}>
              <Image
                src={footer.logo}
                alt="Logo"
                sizes="120px"
                {...styles.logo}
              />
            </Box>
          )}
          {footer.copyright && (
            <Typography {...styles.copyright}>
              {footer.copyright.replace(
                "{0}",
                new Date().getFullYear().toString(),
              )}
            </Typography>
          )}

          <Box {...styles.languageSwitcherContainer}>
            <LanguageSwitcher />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
