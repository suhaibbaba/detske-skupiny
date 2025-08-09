import * as React from "react";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { SanityRichText } from "@/sanity/types";
import { PortableTextBlock } from "@portabletext/types";
import Link from "@/components/ui/link";

interface RichTextProps extends Omit<TypographyProps, "children"> {
  children?: SanityRichText;
}

function RichText({ children, ...typographyProps }: RichTextProps) {
  if (!children?.length) {
    return null;
  }

  const components: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <Typography variant="h1" component="h1" {...typographyProps}>
          {children}
        </Typography>
      ),
      h2: ({ children }) => (
        <Typography variant="h2" component="h2" {...typographyProps}>
          {children}
        </Typography>
      ),
      h3: ({ children }) => (
        <Typography variant="h3" component="h3" {...typographyProps}>
          {children}
        </Typography>
      ),
      h4: ({ children }) => (
        <Typography variant="h4" component="h4" {...typographyProps}>
          {children}
        </Typography>
      ),
      h5: ({ children }) => (
        <Typography variant="h5" component="h5" {...typographyProps}>
          {children}
        </Typography>
      ),
      h6: ({ children }) => (
        <Typography variant="h6" component="h5" {...typographyProps}>
          {children}
        </Typography>
      ),
      normal: ({ children }) => (
        <Typography {...typographyProps}>{children}</Typography>
      ),
      blockquote: ({ children }) => (
        <Box
          sx={{ borderLeft: 3, borderColor: "divider", pl: 2, py: 1, my: 2 }}
        >
          <Typography
            variant="body1"
            sx={{ fontStyle: "italic" }}
            {...typographyProps}
          >
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
          <Typography {...typographyProps}>{children}</Typography>
        </Box>
      ),
      number: ({ children }) => (
        <Box component="li">
          <Typography {...typographyProps}>{children}</Typography>
        </Box>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <Typography component="span" fontWeight={700} variant="inherit">
          {children}
        </Typography>
      ),
      em: ({ children }) => (
        <Typography component="span" fontStyle="italic" variant="inherit">
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
      coloredText: ({ children, value }) => (
        <Typography
          component="span"
          variant="inherit"
          sx={{ color: value?.color?.hex }}
        >
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

  return (
    <PortableText
      value={children as PortableTextBlock[]}
      components={components}
    />
  );
}
export default RichText;
