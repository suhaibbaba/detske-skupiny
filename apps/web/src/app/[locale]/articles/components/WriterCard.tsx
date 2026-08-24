import {
  Avatar,
  Box,
  Typography,
  AvatarProps,
  TypographyOwnProps,
  BoxProps,
} from "@mui/material";
import { Author } from "@/types/blog";

type Props = Author;

interface WriterCardStyles {
  container?: BoxProps;
  avatar?: AvatarProps;
  content?: BoxProps;
  name?: TypographyOwnProps;
  role?: TypographyOwnProps;
}

const styles: WriterCardStyles = {
  container: {
    sx: {
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      maxWidth: "296px",
      gap: "16px",
    },
  },
  avatar: {
    sx: {
      width: 140,
      height: 140,
    },
  },
  content: {
    sx: {
      padding: 0,
      textAlign: "center",
    },
  },
  name: {
    sx: {
      color: "custom.ui13",
      fontWeight: 500,
      fontSize: "24px",
    },
  },
  role: {
    sx: {
      mt: "4px",
      fontWeight: 500,
      fontSize: "16px",
    },
  },
};

const WriterCard = ({ name, role, image }: Props) => {
  return (
    <Box {...styles.container} data-test-selector="WriterCard">
      <Avatar alt={name} src={image} {...styles.avatar} />
      <Box {...styles.content}>
        <Typography {...styles.name}>{name}</Typography>
        <Typography {...styles.role}>{role}</Typography>
      </Box>
    </Box>
  );
};

export default WriterCard;
