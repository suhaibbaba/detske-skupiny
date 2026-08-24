"use client";

import { useState } from "react";
import Lightbox, { type SlideImage } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface Props {
  /** The gallery grid, rendered on the server and passed straight through. */
  children: React.ReactNode;
  slides: SlideImage[];
}

/**
 * Opens a lightbox for whichever gallery image was clicked.
 *
 * The grid this wraps used to live in here, which made every `<Image>` in it -
 * and the school page's LCP element among them - client code, for two pieces
 * of state: whether the lightbox is open and which slide it is on.
 *
 * The grid arrives as `children` now and stays server-rendered. Which image
 * was clicked comes from a `data-gallery-index` attribute read off the event
 * target rather than from a closure per tile, which is what let the tiles move
 * out.
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
      <Lightbox
        plugins={[Zoom]}
        open={openAt !== null}
        close={() => setOpenAt(null)}
        index={openAt ?? 0}
        slides={slides}
        controller={{
          closeOnPullDown: true,
          closeOnBackdropClick: true,
        }}
        carousel={{
          preload: 0,
        }}
        animation={{ zoom: 500 }}
        zoom={{
          maxZoomPixelRatio: 1,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: false,
        }}
      />
    </>
  );
};

export default GalleryLightbox;
