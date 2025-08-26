"use client";

import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import BlogCard, {
  BlogsCardStylesType,
} from "@/app/[locale]/blog/components/BlogCard";

interface Props {
  fields: {
    title: string;
    description: string;
  };
}

interface BlogSectionStyles {
  section?: BoxProps;
  container?: ContainerProps;
  heading?: TypographyProps;
  description?: TypographyProps;
  grid?: BoxProps;
  blogCard?: BlogsCardStylesType;
}

const styles: BlogSectionStyles = {
  section: {
    sx: (theme) => ({
      bgcolor: theme.palette.custom.ui5,
      pt: { xs: "100px", md: "120px" },
      pb: "100px",
      textAlign: "center",
    }),
  },
  container: {
    sx: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  heading: {
    variant: "h1",
    mb: "12px",
  },
  description: {
    mb: "68px",
  },
  grid: {
    sx: {
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
      gap: "50px",
      width: "100%",
    },
  },
  blogCard: {
    card: {
      sx: {
        maxWidth: "initial",
      },
    },
  },
};

const BlogSection = ({ fields }: Props) => {
  return (
    <Box {...styles.section} data-test-selector="blog-section">
      <Container {...styles.container}>
        <Box>
          <Typography {...styles.heading}>{fields.title}</Typography>
          <Typography {...styles.description}>{fields.description}</Typography>
        </Box>
        {/*<Box {...styles.grid}>*/}
        {/*  {data.blog.map((blog, idx) => (*/}
        {/*    <BlogCard*/}
        {/*      key={idx}*/}
        {/*      title={blog.title}*/}
        {/*      image={blog.image}*/}
        {/*      tag={blog.tag}*/}
        {/*      description={blog.description}*/}
        {/*      author={blog.author}*/}
        {/*      date={blog.date}*/}
        {/*      readTime={blog.readTime}*/}
        {/*      authorImage={blog.authorImage}*/}
        {/*      extendedStyles={styles.blogCard}*/}
        {/*    />*/}
        {/*  ))}*/}
        {/*</Box>*/}
      </Container>
    </Box>
  );
};

export default BlogSection;
