import React, { ReactNode, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Box, Button } from "@mui/material";
import { EmblaOptionsType } from "embla-carousel";
import { Property } from "csstype";

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

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

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
