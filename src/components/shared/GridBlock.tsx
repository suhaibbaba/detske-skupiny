import Box from "@mui/material/Box";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { Grid } from "@mui/material";
import * as React from "react";
import { SanityImageField, SanityRichTextField } from "@/sanity/types";
import RichText from "@/sanity/components/RichText";

export interface GridItemBase {
  _key: string;
  _type: "gridItem";
  type: "image" | "text";
  horizontalAlign?: string;
  verticalAlign?: string;
}

export interface GridItemImage extends GridItemBase {
  type: "image";
  image: SanityImageField & { alt?: string; maxWidth?: number };
}

export interface GridItemText extends GridItemBase {
  type: "text";
  text: SanityRichTextField;
}

export type GridItem = GridItemImage | GridItemText;

interface Props {
  value: {
    columns: number;
    gap: string;
    margin: number;
    items: GridItem[];
    mobileColumns: number;
    tabletColumns: number;
    verticalAlign: string;
  };
}

const GridBlock = ({ value }: Props) => {
  const columns = value.columns || 2;
  const mobileColumns = value.mobileColumns || 1;
  const tabletColumns = value.tabletColumns || 2;
  const gap = parseInt(value.gap || "0");
  const margin = value.margin || 4;

  const getJustifyContent = (align: string) => {
    switch (align) {
      case "center":
        return "center";
      case "right":
        return "flex-end";
      case "left":
      default:
        return "flex-start";
    }
  };

  const getAlignItems = (align: string) => {
    switch (align) {
      case "center":
        return "center";
      case "end":
        return "flex-end";
      case "start":
      default:
        return "flex-start";
    }
  };

  const renderItem = (item: GridItem) => {
    const horizontalAlign = item.horizontalAlign || "left";
    const verticalAlign = item.verticalAlign || value.verticalAlign || "start";

    if (item.type === "image" && item.image) {
      const imageStyle = {
        maxWidth: item.image.maxWidth ? `${item.image.maxWidth}px` : "100%",
      };

      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: getJustifyContent(horizontalAlign),
            alignItems: getAlignItems(verticalAlign),
            height: "100%",
          }}
        >
          <Box
            component="img"
            src={urlImageFor(item.image)}
            alt={item.image.alt || ""}
            sx={{
              width:
                horizontalAlign === "left" || horizontalAlign === "right"
                  ? "auto"
                  : "100%",
              height: "auto",
              borderRadius: 2,
              ...imageStyle,
            }}
          />
        </Box>
      );
    } else if (item.type === "text" && item.text) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: getJustifyContent(horizontalAlign),
            alignItems: getAlignItems(verticalAlign),
            height: "100%",
            textAlign: horizontalAlign,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <RichText>{item.text}</RichText>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ my: margin }}>
      <Grid
        container
        spacing={gap}
        alignItems={value.verticalAlign || "flex-start"}
      >
        {value.items?.map((item, index) => (
          <Grid
            size={{
              xs: 12 / mobileColumns,
              md: 12 / tabletColumns,
              lg: 12 / columns,
            }}
            key={index}
          >
            {renderItem(item)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GridBlock;
