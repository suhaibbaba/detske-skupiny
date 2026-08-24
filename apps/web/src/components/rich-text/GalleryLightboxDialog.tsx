"use client";

import Lightbox, { type SlideImage } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface Props {
  slides: SlideImage[];
  index: number;
  onClose: () => void;
}

/**
 * The open lightbox, and the only module that imports the library.
 *
 * It is a file of its own so that `GalleryLightbox` can reach it through
 * `next/dynamic`: yet-another-react-lightbox and its zoom plugin are the
 * second-largest dependency on the site after MapTiler, and nothing renders
 * from them until a visitor taps a photo. Splitting at the module boundary
 * rather than wrapping `Lightbox` itself matters because `Zoom` is a plugin
 * function, not a component - `dynamic()` cannot stand in for it.
 *
 * The stylesheet is imported here too, so it travels with the chunk.
 */
const GalleryLightboxDialog = ({ slides, index, onClose }: Props) => (
  <Lightbox
    plugins={[Zoom]}
    open
    close={onClose}
    index={index}
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
);

export default GalleryLightboxDialog;
