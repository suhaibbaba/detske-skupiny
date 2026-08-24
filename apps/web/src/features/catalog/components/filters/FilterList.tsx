"use client";

import {
  alpha,
  Box,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import MinusIcon from "@mui/icons-material/Remove";
import { getLocalizedRoutes } from "@/routes";
import { CategoryItem } from "@/features/catalog/queries";
import Button from "@/components/ui/button";
import { normalizeSlug } from "@/lib/sanity/helper";
import DoneIcon from "@mui/icons-material/Done";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import useTranslate from "@/hooks/useTranslate";
import SearchIcon from "@/components/icons/Search";
import { useLocale } from "next-intl";
import type { SxProps, Theme } from "@mui/material/styles";
import SectionHeading from "@/components/ui/SectionHeading";

interface Props {
  title: string;
  showDivider?: boolean;
  showSearch?: boolean;
  items?: CategoryItem[];
  selectedSlug?: string;
  initialItemsCount?: number;
}

const styles = {
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    pr: "14px",
    maxHeight: "600px",
    overflow: "auto",
  },
  itemButton: (theme) => ({
    justifyContent: "space-between",
    minHeight: "auto",
    p: "2px",
    "&:hover:not(.selected)": {
      bgcolor: alpha(theme.palette.custom.borderLilac, 0.3),
    },
    "&.selected": {
      border: `1px solid ${theme.palette.custom.borderLilac}`,
    },
  }),
  itemContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "5px",
  },
  itemIcon: {
    color: "custom.textSecondary",
  },
  itemSelectedIcon: {
    fontSize: "18px",
    color: "custom.accentLilac",
  },
  itemText: { color: "custom.textSecondary" },
  itemCount: {
    width: "28px",
    height: "28px",
    aspectRatio: 1,
    fontSize: 11,
    color: "custom.textHeading",
    fontWeight: 400,
    border: "1px solid #E0C3F9",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: "2px",
  },
  divider: {
    mt: "20px",
    mb: "16px",
    bgcolor: "common.ui18",
  },
  showMoreIcon: {
    width: 16,
    height: 16,
    mr: "8px",
  },
  showMoreButton: {
    mt: "8px",
    color: "primary.main",
    fontSize: "14px",
    transition: "color 300ms ease-in-out",
    "&:hover": {
      bgcolor: "transparent",
      color: "custom.borderLilac",
    },
  },
  searchInput: {
    width: "100%",
    marginBottom: "12px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        transition: "all 0.5s ease",
        borderColor: "custom.accentLilac",
      },
      // Hover state border color
      "&:hover fieldset": {
        borderColor: "custom.textLilac",
      },
      // Focused state border color
      "&.Mui-focused fieldset": {
        borderColor: "custom.textLilac",
      },
    },
  },
} satisfies Record<string, SxProps<Theme>>;

const FilterList: FC<Props> = ({
  title,
  items: itemsProps,
  showDivider,
  showSearch = true,
  selectedSlug,
  initialItemsCount = 15,
}) => {
  const locale = useLocale();
  const translate = useTranslate();
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");
  const items = itemsProps?.filter(Boolean);

  if (!items || items.length === 0) {
    return null;
  }

  // Filter items based on search
  const filteredItems = search
    ? items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  const shouldShowToggle = items.length > initialItemsCount;
  const displayedItems = showAll
    ? filteredItems
    : filteredItems.slice(0, initialItemsCount);

  return (
    <Box>
      {showDivider && <Divider sx={styles.divider} />}
      <SectionHeading dense>{title}</SectionHeading>
      {showSearch && shouldShowToggle && (
        <TextField
          placeholder={translate("search")}
          sx={styles.searchInput}
          size="small"
          value={search}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: "primary.main",
                      fontSize: 16,
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      <Box sx={styles.listContainer}>
        {displayedItems.map((district) => {
          const selected =
            normalizeSlug(selectedSlug) === normalizeSlug(district.slug);

          return (
            <React.Fragment key={district.id}>
              <Button
                sx={styles.itemButton}
                href={getLocalizedRoutes(locale).catalogs(district.slug)}
                variant="text"
                className={selected ? "selected" : ""}
                scroll={false}
              >
                <Box sx={styles.itemContainer} key={`container_${district.id}`}>
                  {selected ? (
                    <DoneIcon
                      key={`${district.id}_done`}
                      sx={styles.itemSelectedIcon}
                    />
                  ) : (
                    <MinusIcon
                      key={`${district.id}_minus`}
                      sx={styles.itemIcon}
                    />
                  )}
                  <Typography key={`${district.id}_name`} sx={styles.itemText}>
                    {district.name}
                  </Typography>
                </Box>
                <Typography sx={styles.itemCount}>{district.count}</Typography>
              </Button>
            </React.Fragment>
          );
        })}
      </Box>
      {shouldShowToggle && (
        <Button
          sx={styles.showMoreButton}
          variant="text"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <RemoveIcon sx={styles.showMoreIcon} />
          ) : (
            <AddIcon sx={styles.showMoreIcon} />
          )}
          {showAll ? translate("showLess") : translate("showMore")}
        </Button>
      )}
    </Box>
  );
};

export default FilterList;
