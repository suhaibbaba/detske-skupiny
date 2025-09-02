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
} from "@/app/[locale]/blogs/components/BlogCard";
import { fetchMiniBlogs } from "@/sanity/queries";
import { sharedClassNames } from "@/app/[locale]/home/utility";

interface Props {
  locale: string;
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
  blogsWrapper?: BoxProps;
  blogCard?: BlogsCardStylesType;
}

const styles: BlogSectionStyles = {
  section: {
    sx: {
      bgcolor: "custom.ui5",
      pt: { xs: "100px", md: "120px" },
      pb: "100px",
      textAlign: "center",
    },
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
  blogsWrapper: {
    sx: {
      display: "flex",
      flexDirection: {
        xs: "column",
        sm: "row",
      },
      justifyContent: "center",
      gap: "50px",
    },
  },
};

const BlogSection = async ({ locale, fields }: Props) => {
  const { blogs } = await fetchMiniBlogs({ locale, numberOfBlogs: 2 });

  if (!blogs) {
    return null;
  }
  return (
    <Box {...styles.section} className={sharedClassNames.blog}>
      <Container {...styles.container}>
        <Box>
          <Typography {...styles.heading}>{fields.title}</Typography>
          <Typography {...styles.description}>{fields.description}</Typography>
        </Box>
        <Box {...styles.blogsWrapper}>
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              extendedStyles={styles.blogCard}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default BlogSection;
