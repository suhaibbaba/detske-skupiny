"use client";

import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  BoxProps,
  Avatar,
  ListItemProps,
  TypographyProps,
  ListProps,
  AvatarProps,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import PageLayout from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/custom/PageHeadingTypography";
import useSafeTranslations from "@/hooks/useSafeTranslations";
import data from "@/data/blogDetail";
import BlogTabs from "@/app/[locale]/blogs/BlogTabs";
import { formatMessage } from "@/utilites/strings";
import { useEffect, useRef, useState } from "react";

interface BlogDetailStyles {
  section?: BoxProps;
  container?: (offsetTop: number) => BoxProps;
  featureItem?: ListItemProps;
  image?: BoxProps;
  detailsHintBox?: (offsetTop: number) => BoxProps;
  authorMeta?: BoxProps;
  authorText?: TypographyProps;
  sectionBox?: BoxProps;
  list?: ListProps;
  authorBox?: BoxProps;
  bioBox?: BoxProps;
  avatar?: AvatarProps;
  sectionHeading?: TypographyProps;
  paragraph?: TypographyProps;
}

const styles: BlogDetailStyles = {
  container: (offsetTop) => ({
    pb: {
      xs: `calc(100px - ${offsetTop / 2}px)`,
      sm: `calc(116px - ${offsetTop / 2}px)`,
    },
  }),
  section: {
    sx: (theme) => ({
      background: theme.palette.gradients.ui2,
      pb: "150px",
    }),
  },
  detailsHintBox: (offsetTop) => ({
    maxWidth: "920px",
    mx: "auto",
    sx: {
      mt: {
        xs: `calc(134px - ${offsetTop / 2}px)`,
        sm: `calc(145px - ${offsetTop / 2}px)`,
      },
      display: "flex",
      flexDirection: "column",
      gap: "80px",
      transform: `translateY(-${offsetTop / 2}px)`,
    },
  }),
  featureItem: {
    disableGutters: true,
    disablePadding: true,
    sx: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
  },
  image: {
    sx: {
      width: "100%",
      maxHeight: "450px",
      objectFit: "cover",
    },
  },
  authorMeta: {
    sx: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "12px",
      mt: "24px",
    },
  },
  authorText: {
    component: "span",
    fontSize: "18px",
    color: "custom.ui13",
    fontWeight: 500,
  },
  sectionBox: {
    sx: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
  },
  list: {
    disablePadding: true,
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr 1fr",
      },
      gap: "12px",
    },
  },
  bioBox: {
    p: "24px",
    sx: (theme) => ({
      display: "flex",
      flexDirection: "column",
      bgcolor: theme.palette.custom.ui15,
      gap: "8px",
      borderRadius: "12px",
      border: `1px solid ${theme.palette.custom.ui14}`,
    }),
  },
  authorBox: {
    sx: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
  },
  avatar: {
    sx: {
      width: "36px",
      height: "36px",
    },
  },
  sectionHeading: {
    variant: "h3",
  },
  paragraph: {
    variant: "body1",
  },
};

const BlogDetailPage = () => {
  const [tabsOffset, setTabsOffset] = useState(0);
  const translate = useSafeTranslations("BlogDetailsPage");

  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tabsRef.current) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const height = tabsRef.current!.getBoundingClientRect().height;
      setTabsOffset(height);
    });

    observer.observe(tabsRef.current);

    return () => {
      observer.disconnect();
    };
  }, [tabsRef.current]);

  const onSelectHandler = () => {};

  return (
    <Box {...styles.container?.(tabsOffset)}>
      <PageLayout fullWidth={false} sectionStyles={styles.section}>
        <Container>
          <PageHeadingTypography
            title={translate(data.heading)}
            description={translate(data.description)}
          />
        </Container>
      </PageLayout>
      <Container>
        <BlogTabs
          ref={tabsRef}
          tabs={data.tabs}
          selected={data.tabs[1]}
          onSelect={onSelectHandler}
        />
        {tabsRef.current && (
          <Box
            {...styles.detailsHintBox?.(tabsOffset)}
            data-test-selector="details-hint"
          >
            <Box>
              <Typography variant="h2" mb="24px">
                {data.title}
              </Typography>
              <Box component="img" src={data.details.image} {...styles.image} />
              <Box {...styles.authorMeta}>
                {formatMessage(
                  `{0}{1}{2}${data.details.date} • ${data.details.readTime}`,
                  translate("By"),
                  <Avatar
                    alt={data.details.authorName}
                    src={data.details.authorImage}
                    {...styles.avatar}
                  />,
                  <Typography {...styles.authorText} key="author">
                    {data.details.authorName}
                  </Typography>,
                )}
              </Box>
            </Box>

            {data.details.sections.map((section) => (
              <Box key={section.heading} {...styles.sectionBox}>
                {section.intro && (
                  <Typography {...styles.paragraph}>
                    {translate(section.intro)}
                  </Typography>
                )}
                <Typography {...styles.sectionHeading}>
                  {translate(section.heading)}
                </Typography>
                {Array.isArray(section.content) ? (
                  <List {...styles.list}>
                    {section.content.map((item) => (
                      <ListItem key={item} {...styles.featureItem}>
                        <ListItemIcon sx={{ minWidth: "initial" }}>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={translate(item)} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography {...styles.paragraph}>
                    {translate(section.content)}
                  </Typography>
                )}
              </Box>
            ))}

            {data.details.authorBio && (
              <Box {...styles.bioBox}>
                <Box {...styles.authorBox}>
                  {formatMessage(
                    `{0}{1}`,
                    <Avatar
                      alt={data.details.authorName}
                      src={data.details.authorImage}
                      {...styles.avatar}
                    />,
                    <Typography {...styles.authorText} key="author">
                      {data.details.authorName}
                    </Typography>,
                  )}
                </Box>
                <Typography {...styles.paragraph}>
                  {data.details.authorBio}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BlogDetailPage;
