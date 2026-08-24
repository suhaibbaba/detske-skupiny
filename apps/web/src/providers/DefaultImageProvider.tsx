import { getSettings } from "@/sanity/queries/settings";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { DefaultImageClientProvider } from "./DefaultImageClientProvider";

export async function DefaultImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // `settingsQuery` is `*[_type == "settings"][0]`, so a dataset with no
  // settings document returns null rather than an object with empty fields.
  const settings = await getSettings();
  const defaultImageUrl = urlImageFor(settings?.defaultImage);

  return (
    <DefaultImageClientProvider defaultImageUrl={defaultImageUrl}>
      {children}
    </DefaultImageClientProvider>
  );
}
