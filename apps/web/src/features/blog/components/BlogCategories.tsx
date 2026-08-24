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
  button: {
    boxSizing: "content-box",
    flex: "1 0 0",
    padding: "10px 20px",
    maxWidth: "230px",
    borderRadius: "24px",
    borderColor: "custom.divider",
    bgcolor: "var(--mui-palette-common-white)",
    color: "var(--mui-palette-text-primary)",
  },
  activeButton: {
    boxSizing: "content-box",
    flex: "1 0 0",
    padding: "10px 20px",
    maxWidth: "230px",
    borderRadius: "24px",
  },
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
          {...(!categorySelected ? styles.activeButton : styles.button)}
        >
          {translate("all")}
        </Button>
        {categories.map((category) => {
          return (
            <Button
              key={category.name}
              onClick={() => onSelect(category)}
              {...(category.slug === categorySelected
                ? styles.activeButton
                : styles.button)}
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
