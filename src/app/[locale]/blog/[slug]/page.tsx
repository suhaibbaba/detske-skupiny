import { getBlogDetails } from "@/sanity/queries";
import BlogDetailPage from "@/app/[locale]/blog/[slug]/blogDetailsPage";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const { blog, categories, content } = await getBlogDetails({ slug });

  return (
    <BlogDetailPage blog={blog} content={content} categories={categories} />
  );
};

export default Page;
