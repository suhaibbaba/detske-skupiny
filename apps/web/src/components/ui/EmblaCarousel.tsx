"use client";

/**
 * Embla owns a ref to a scroll container and drives it with pointer events, so
 * this is where the client boundary belongs - not on `SchoolsCarousel`, which
 * would pull every card that carousel renders into the client bundle.
 */
import React, { ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Box } from "@mui/material";
import { EmblaOptionsType } from "embla-carousel";
import { Property } from "csstype";
import Button from "@/components/ui/button";

type EmblaCarouselProps = {
  options?: EmblaOptionsType;
  children: ReactNode;
  withControls?: boolean;
  gap?: number;
};

export default function EmblaCarousel({
  options,
  children,
  withControls = false,
  gap = 24,
}: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  // Plain functions: they are only ever passed to onClick, never to a
  // dependency array, so their identity does not need to be stable.
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <Box>
      <Box
        ref={emblaRef}
        sx={{
          overflow: "hidden",
          width: "100%",
          p: "6px",
          m: "-6px",
          display: "flex",
          justifyContent:
            (options?.align as Property.JustifyContent) || "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: `${gap}px`,
          }}
        >
          {React.Children.map(children, (child, i) => (
            <Box
              key={i}
              sx={{
                flex: "0 0 auto",
              }}
            >
              {child}
            </Box>
          ))}
        </Box>
      </Box>

      {withControls && (
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={scrollPrev}>
            Prev
          </Button>
          <Button variant="contained" onClick={scrollNext}>
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
