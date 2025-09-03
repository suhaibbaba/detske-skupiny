"use client";

import { Box, Stack, BoxProps, ButtonProps, StackProps } from "@mui/material";
import React, { FC } from "react";
import { BlogCategory } from "@/types";
import Button from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useTranslate from "@/hooks/useTranslate";

interface Props {
  categories?: BlogCategory[];
  categorySelected?: string;
}

interface BlogTabsStyles {
  container?: BoxProps;
  stack?: StackProps;
  button?: ButtonProps;
  activeButton?: ButtonProps;
}

const styles: BlogTabsStyles = {
  container: {
    bgcolor: "custom.ui5",
    sx: {
      width: "100%",
      py: "16px",
      px: "24px",
      borderRadius: "32px",
      display: "flex",
      justifyContent: "center",
      border: `1px solid var(--mui-palette-custom-ui12)`,
      transform: "translateY(-50%)",
      boxShadow: "var(--mui-palette-shadows-ui1)",
    },
  },
  stack: {
    justifyContent: "center",
    width: "100%",
    direction: "row",
    gap: "12px",
    flexWrap: "wrap",
  },
  button: {
    variant: "outlined",
    sx: {
      boxSizing: "content-box",
      flex: "1 0 0",
      padding: "10px 20px",
      maxWidth: "230px",
      borderRadius: "24px",
      borderColor: "var(--mui-palette-custom-ui12)",
      bgcolor: "var(--mui-palette-common-white)",
      color: "var(--mui-palette-text-primary)",
    },
  },
  activeButton: {
    variant: "primary",
    sx: {
      boxSizing: "content-box",
      flex: "1 0 0",
      padding: "10px 20px",
      maxWidth: "230px",
      borderRadius: "24px",
    },
  },
};

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
    <Box {...styles.container}>
      <Stack {...styles.stack}>
        <Button
          onClick={() =>
            onSelect({
              name: "All",
              slug: "all",
            })
          }
          {...(!categorySelected ? styles.activeButton : styles.button)}
        >
          {translate("All")}
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
