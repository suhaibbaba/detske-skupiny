import * as React from "react";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { RichTextProps } from "@/sanity/types";
import { PortableTextBlock } from "@portabletext/types";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <Typography variant="h3" component="h1">
        {children}
      </Typography>
    ),
    h2: ({ children }) => (
      <Typography variant="h4" component="h2">
        {children}
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography variant="h5" component="h3">
        {children}
      </Typography>
    ),
    normal: ({ children }) => <Typography>{children}</Typography>,
    blockquote: ({ children }) => (
      <Box sx={{ borderLeft: 3, borderColor: "divider", pl: 2, py: 1, my: 2 }}>
        <Typography variant="body1" sx={{ fontStyle: "italic" }}>
          {children}
        </Typography>
      </Box>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <Box component="ul" sx={{ pl: 3, my: 1 }}>
        {children}
      </Box>
    ),
    number: ({ children }) => (
      <Box component="ol" sx={{ pl: 3, my: 1 }}>
        {children}
      </Box>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <Box component="li">
        <Typography variant="body1">{children}</Typography>
      </Box>
    ),
    number: ({ children }) => (
      <Box component="li">
        <Typography variant="body1">{children}</Typography>
      </Box>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <Typography component="span" fontWeight={700}>
        {children}
      </Typography>
    ),
    em: ({ children }) => (
      <Typography component="span" fontStyle="italic">
        {children}
      </Typography>
    ),
    link: ({ children, value }) => (
      <Link
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
      >
        {children}
      </Link>
    ),
    // Example custom mark from Sanity (coloredText)
    coloredText: ({ children, value }) => (
      <Typography component="span" sx={{ color: value?.color?.hex }}>
        {children}
      </Typography>
    ),
  },
  // Optionally render custom types in Portable Text (images, callouts, etc.)
  types: {
    image: ({ value }) => (
      <Box
        component="img"
        src={value?.asset?.url}
        alt={value?.alt || ""}
        sx={{ maxWidth: "100%", borderRadius: 2 }}
      />
    ),
  },
};

function RichText({ value }: { value?: RichTextProps }) {
  if (!value?.length) return null;
  return (
    <PortableText
      value={value as PortableTextBlock[]}
      components={components}
    />
  );
}

export default RichText;
