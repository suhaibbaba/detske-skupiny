"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { SlideImage } from "yet-another-react-lightbox";

/**
 * The lightbox itself is fetched when someone opens one, not before.
 *
 * `ssr: false` because a closed lightbox emits no markup and the module is
 * only ever reached from a click. Mounting it only once `openAt` is set is
 * what keeps the import lazy - a statically rendered `<Lightbox open={false}>`
 * would pull the chunk in on hydration anyway.
 */
const LightboxDialog = dynamic(
  () => import("@/components/rich-text/GalleryLightboxDialog"),
  { ssr: false },
);

interface Props {
  /** The gallery grid, rendered on the server and passed straight through. */
  children: React.ReactNode;
  slides: SlideImage[];
}

/**
 * Opens a lightbox for whichever gallery image was clicked.
 *
 * This owns two pieces of state - whether the lightbox is open and which slide
 * it is on - and nothing else. The grid arrives as `children` and stays
 * server-rendered, so every `<Image>` in it, the school page's LCP element
 * among them, is out of the client bundle.
 *
 * Which image was clicked comes from a `data-gallery-index` attribute read off
 * the event target rather than from a closure per tile, which is what keeps the
 * tiles on the server.
 */
const GalleryLightbox = ({ children, slides }: Props) => {
  const [openAt, setOpenAt] = useState<number | null>(null);

  const openFromClick = (event: React.MouseEvent<HTMLElement>) => {
    const tile = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-gallery-index]",
    );
    if (!tile) return;

    const index = Number(tile.dataset.galleryIndex);
    if (Number.isInteger(index)) setOpenAt(index);
  };

  return (
    <>
      <div onClick={openFromClick}>{children}</div>
      {openAt !== null && (
        <LightboxDialog
          slides={slides}
          index={openAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </>
  );
};

export default GalleryLightbox;
