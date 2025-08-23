import BlogsPageClient from "@/app/[locale]/blogs/BlogsPageClient";
import { getBlogs } from "@/sanity/queries/page";

const BlogsPage = async () => {
  const data = await getBlogs();

  return (
    <BlogsPageClient
      blogs={data.blogs}
      categories={data.categories ?? []}
      content={data.content}
      writers={data.writers ?? []}
    />
  );
};

export default BlogsPage;
