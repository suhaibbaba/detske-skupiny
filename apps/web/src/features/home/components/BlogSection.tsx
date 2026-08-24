import { Box, Container, Typography } from "@mui/material";
import BlogCard from "@/features/blog/components/BlogCard";
import { fetchMiniBlogs } from "@/features/blog/queries";
import { sharedClassNames } from "@/features/home/utils";
import type { SxProps, Theme } from "@mui/material/styles";

interface Props {
  fields: {
    title: string;
    description: string;
  };
  /** Supplied by Zone, which spreads the page's route params onto sections. */
  locale: string;
}

const styles = {
  section: {
    bgcolor: "custom.surfaceLilac",
    pt: { xs: "100px", md: "120px" },
    pb: "100px",
    textAlign: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heading: { mb: "12px" },
  description: { mb: "68px" },
  blogsWrapper: {
    display: "flex",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    justifyContent: "center",
    gap: "50px",
  },
} satisfies Record<string, SxProps<Theme>>;

const BlogSection = async ({ fields, locale }: Props) => {
  const { blogs } = await fetchMiniBlogs({ numberOfBlogs: 2, locale });

  if (!blogs) {
    return null;
  }

  return (
    <Box sx={styles.section} className={sharedClassNames.blog}>
      <Container sx={styles.container}>
        <Box>
          <Typography sx={styles.heading} variant="h1">
            {fields.title}
          </Typography>
          <Typography sx={styles.description}>{fields.description}</Typography>
        </Box>
        <Box sx={styles.blogsWrapper}>
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default BlogSection;
