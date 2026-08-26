"use client";

import { Box, Stack } from "@mui/material";
import React, { FC } from "react";
import { BlogCategory } from "@/types";
import Button from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useTranslate from "@/hooks/useTranslate";
import type { SxProps, Theme } from "@mui/material/styles";
import { custom } from "@/theme/custom";

interface Props {
  categories?: BlogCategory[];
  categorySelected?: string;
}

/**
 * The shape both pills share. They differed only in the three colour lines in
 * `styles.button`, and repeated these five in full on each.
 */
const pill = {
  boxSizing: "content-box",
  flex: "1 0 0",
  padding: "10px 20px",
  maxWidth: "230px",
  borderRadius: "24px",
} satisfies SxProps<Theme>;

/**
 * The two pills share this half of their styling through `sx`, never through a
 * JSX spread onto `<Button>`. MUI v9 has no system props on components, so a
 * spread declaration lands on the DOM node as a bare attribute
 * (`padding="10px 20px"`) and styles nothing - and it typechecks, because a
 * JSX spread is not excess-property checked.
 *
 * `sx` takes an array and composes it with later entries winning, which is what
 * carries the shared half. BlogCategories.test.tsx asserts the declarations
 * reach CSS and that nothing lands on the DOM node.
 */
const styles = {
  container: {
    bgcolor: "custom.surfaceLilac",
    width: "100%",
    py: "16px",
    px: "24px",
    borderRadius: "32px",
    display: "flex",
    justifyContent: "center",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "custom.divider",
    transform: "translateY(-50%)",
    boxShadow: custom.shadows.card,
  },
  stack: {
    flexWrap: "wrap",
    gap: "12px",
    width: "100%",
    justifyContent: "center",
  },
  /** Unselected: white, with the divider hairline and body-text ink. */
  button: [
    pill,
    {
      borderColor: "custom.divider",
      bgcolor: "common.white",
      color: "text.primary",
    },
  ],
  /** Selected: the theme's own contained-button colours. */
  activeButton: [pill],
} satisfies Record<string, SxProps<Theme>>;

const BlogCategories: FC<Props> = ({ categories, categorySelected }) => {
  const translate = useTranslate();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onSelect = (category: BlogCategory) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!category.slug || category.slug === "all") {
      params.delete("category");
    } else {
      params.set("category", category.slug);
    }

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: true });
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <Box sx={styles.container}>
      <Stack sx={styles.stack} direction="row">
        <Button
          onClick={() =>
            onSelect({
              // The "all" pill is not a document; `id` is only ever compared
              // against a real category's, which cannot be this.
              id: "all",
              name: "All",
              slug: "all",
            })
          }
          sx={!categorySelected ? styles.activeButton : styles.button}
        >
          {translate("all")}
        </Button>
        {categories.map((category) => {
          return (
            <Button
              key={category.name}
              onClick={() => onSelect(category)}
              sx={
                category.slug === categorySelected
                  ? styles.activeButton
                  : styles.button
              }
            >
              {category.name}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};

export default BlogCategories;
