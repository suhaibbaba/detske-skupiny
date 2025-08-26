import * as React from "react";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { PortableTextBlock } from "@portabletext/types";
import Link from "@/components/ui/link";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import CheckList from "@/components/shared/CheckList";
import { SanityRichTextField } from "@/sanity/types";

/**
 * Utility: detect if a block renderer received only whitespace/empty content.
 * PortableText can pass arrays/strings; we defensively check both.
 */
function isEmptyContent(nodeChildren: React.ReactNode): boolean {
  if (nodeChildren == null) return true;
  if (typeof nodeChildren === "string") return nodeChildren.trim().length === 0;
  if (Array.isArray(nodeChildren)) {
    return nodeChildren.every((child) => {
      if (child == null) return true;
      if (typeof child === "string") return child.trim().length === 0;
      // If any child is a React element or non-empty string, not empty
      return false;
    });
  }
  // React elements/nodes are considered non-empty
  return false;
}

interface RichTextProps extends Omit<TypographyProps, "children"> {
  /** Portable Text value from Sanity */
  children?: SanityRichTextField;
  /**
   * Tighten paragraph spacing so consecutive paragraphs feel closer to a <br/>.
   * Useful when authors hit Enter to mimic a line break.
   */
  compactParagraphs?: boolean;
}

function RichText({
  children,
  compactParagraphs = false,
  ...typographyProps
}: RichTextProps) {
  if (!children?.length) return null;

  // Shared text styles: render Shift+Enter (`\n`) as actual line breaks
  const textSx = {
    whiteSpace: "pre-line",
    ...(typographyProps.sx || {}),
  };

  const paragraphMargin = compactParagraphs
    ? 0.5
    : ((typographyProps as any)?.mb ?? 2);

  const components: PortableTextComponents = {
    /* ===================== Block-level ===================== */
    block: {
      h1: ({ children }) =>
        isEmptyContent(children) ? null : (
          <Typography
            variant="h1"
            component="h1"
            sx={textSx}
            {...typographyProps}
          >
            {children}
          </Typography>
        ),
      h2: ({ children }) =>
        isEmptyContent(children) ? null : (
          <Typography
            variant="h2"
            component="h2"
            sx={textSx}
            {...typographyProps}
          >
            {children}
          </Typography>
        ),
      h3: ({ children }) =>
        isEmptyContent(children) ? null : (
          <Typography
            variant="h3"
            component="h3"
            sx={textSx}
            {...typographyProps}
          >
            {children}
          </Typography>
        ),
      h4: ({ children }) =>
        isEmptyContent(children) ? null : (
          <Typography
            variant="h4"
            component="h4"
            sx={textSx}
            {...typographyProps}
          >
            {children}
          </Typography>
        ),
      h5: ({ children }) =>
        isEmptyContent(children) ? null : (
          <Typography
            variant="h5"
            component="h5"
            sx={textSx}
            {...typographyProps}
          >
            {children}
          </Typography>
        ),
      h6: ({ children }) =>
        isEmptyContent(children) ? null : (
          <Typography
            variant="h6"
            component="h6"
            sx={textSx}
            {...typographyProps}
          >
            {children}
          </Typography>
        ),
      normal: ({ children }) =>
        // Enter on an empty row in Studio creates a new (often empty) paragraph; skip it.
        isEmptyContent(children) ? null : (
          <Typography
            sx={{ ...textSx, mb: paragraphMargin }}
            {...typographyProps}
          >
            {children}
          </Typography>
        ),
      blockquote: ({ children }) =>
        isEmptyContent(children) ? null : (
          <Box
            sx={{ borderLeft: 3, borderColor: "divider", pl: 2, py: 1, my: 2 }}
          >
            <Typography
              variant="body1"
              sx={{ fontStyle: "italic", ...textSx }}
              {...typographyProps}
            >
              {children}
            </Typography>
          </Box>
        ),
    },

    /* ===================== Lists ===================== */
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
      // If you also added a *list type* "check" in your block schema, you can support it here too.
      // For custom object-based checklists, see `types.checklist` below.
      // check: ({ children }) => ( ...your icon-list ul container... ),
    },
    listItem: {
      bullet: ({ children }) => (
        <Box component="li">
          <Typography sx={textSx} {...typographyProps}>
            {children}
          </Typography>
        </Box>
      ),
      number: ({ children }) => (
        <Box component="li">
          <Typography sx={textSx} {...typographyProps}>
            {children}
          </Typography>
        </Box>
      ),
      // check: ({ children }) => ( ...your icon-list li item... ),
    },

    /* ===================== Inline marks ===================== */
    marks: {
      strong: ({ children }) => (
        <Typography
          component="span"
          fontWeight={700}
          variant="inherit"
          sx={textSx}
        >
          {children}
        </Typography>
      ),
      em: ({ children }) => (
        <Typography
          component="span"
          fontStyle="italic"
          variant="inherit"
          sx={textSx}
        >
          {children}
        </Typography>
      ),
      link: ({ children, value }) => {
        const isExternal = value?.href?.startsWith("http");
        const target = value?.openInNewTab
          ? "_blank"
          : isExternal
            ? "_blank"
            : undefined;
        return (
          <Link
            href={value?.href}
            target={target}
            rel={target ? "noreferrer" : undefined}
          >
            {children}
          </Link>
        );
      },
      // Colored text annotation (requires `@sanity/color-input` and your `coloredText` schema)
      color: ({ children, value }) => (
        <Typography
          component="span"
          variant="inherit"
          sx={{ color: value?.color?.hex, ...textSx }}
        >
          {children}
        </Typography>
      ),
    },

    /* ===================== Custom object types ===================== */
    types: {
      // Inline/standalone images in rich text
      image: ({ value }) => (
        <Box
          component="img"
          src={urlImageFor(value)}
          alt={value?.alt || ""}
          loading="lazy"
          sx={{ maxWidth: "100%", borderRadius: 2, display: "block", my: 2 }}
        />
      ),

      /**
       * Checklist object support:
       * Schema must define an object type "checklist" with `items: {text: string}[]`,
       * and your component <CheckList items={...} /> renders the UI (icons, columns, etc).
       */
      checklist: ({ value }) => {
        const items = Array.isArray(value?.items) ? value.items : [];
        if (!items.length) return null;
        return <CheckList items={items} />;
      },
      spacer: ({ value }) => {
        // Map presets to px; keep LG=80 as requested
        const presetMap: Record<string, number> = {
          xs: 16,
          sm: 32,
          md: 48,
          lg: 80,
          xl: 120,
        };
        const base =
          value?.preset === "custom"
            ? Number(value?.custom ?? 0)
            : presetMap[value?.preset ?? "lg"]; // default to 80 if not set
        const mobile =
          typeof value?.mobile === "number" ? value.mobile : undefined;

        return (
          <Box
            aria-hidden
            sx={{
              height: { xs: mobile ?? base, md: base },
              // If you use vertical rhythm via margins instead, switch to: my: { xs: ..., md: ... }
            }}
          />
        );
      },
    },
  };

  return (
    <Box
      sx={{
        // Reset bottom margin for the last Typography or block element
        "& > *:last-child": {
          mb: 0,
        },
      }}
    >
      <PortableText
        value={children as PortableTextBlock[]}
        components={components}
      />
    </Box>
  );
}

export default RichText;
