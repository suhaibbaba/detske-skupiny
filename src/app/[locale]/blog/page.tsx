import BlogsPageClient from "@/app/[locale]/blog/blogsPageClient";
import { fetchBlogPage } from "@/sanity/queries";
import { PageProps } from "@/types";

const BlogsPage = async ({ params }: PageProps) => {
  const { locale } = await params;
  const { blogs, writers, content, categories } = await fetchBlogPage({
    locale,
  });

  return (
    <BlogsPageClient
      blogs={blogs}
      categories={categories}
      content={content}
      writers={writers}
    />
  );
};

export default BlogsPage;
