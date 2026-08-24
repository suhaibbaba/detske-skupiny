import {
  List,
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemText,
  ListProps as MuiListProps,
} from "@mui/material";
import { FC } from "react";
import CheckIcon from "@mui/icons-material/Check";

export interface ListProps {
  items: { text?: string }[];
}

interface CheckListStyles {
  list?: MuiListProps;
  listItem?: ListItemProps;
}

const styles: CheckListStyles = {
  list: {
    disablePadding: true,
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr 1fr",
      },
      gap: "12px",
    },
  },
  listItem: {
    disableGutters: true,
    disablePadding: true,
    sx: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
  },
};

const CheckList: FC<ListProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <List {...styles.list}>
      {items.map((item) => (
        <ListItem key={item.text} {...styles.listItem}>
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
