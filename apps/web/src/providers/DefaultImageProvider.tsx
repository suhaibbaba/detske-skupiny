import { getSettings } from "@/sanity/queries/settings";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { DefaultImageClientProvider } from "./DefaultImageClientProvider";

export async function DefaultImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { defaultImage } = await getSettings();
  const defaultImageUrl = urlImageFor(defaultImage);

  return (
    <DefaultImageClientProvider defaultImageUrl={defaultImageUrl}>
      {children}
    </DefaultImageClientProvider>
  );
}
