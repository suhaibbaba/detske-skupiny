import { getSettings } from "@/lib/sanity/settings";
import { urlImageFor } from "@/lib/sanity/imageUrl";
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
