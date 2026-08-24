import type { SxProps, Theme } from "@mui/material/styles";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { FC } from "react";
import CheckIcon from "@mui/icons-material/Check";

export interface ListProps {
  items: { text?: string }[];
}

const styles = {
  list: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr 1fr",
    },
    gap: "12px",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
} satisfies Record<string, SxProps<Theme>>;

const CheckList: FC<ListProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <List sx={styles.list} disablePadding>
      {items.map((item) => (
        <ListItem
          key={item.text}
          sx={styles.listItem}
          disableGutters
          disablePadding
        >
          <ListItemIcon sx={{ minWidth: "initial" }}>
            <CheckIcon color="success" />
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );
};

export default CheckList;
