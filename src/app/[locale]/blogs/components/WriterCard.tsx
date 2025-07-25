"use client";

import {
  Avatar,
  Box,
  Typography,
  AvatarProps,
  TypographyOwnProps,
  BoxProps,
} from "@mui/material";
import { FC } from "react";

export interface Props {
  image: string;
  name: string;
  bio: string;
}

interface WriterCardStyles {
  container?: BoxProps;
  avatar?: AvatarProps;
  content?: BoxProps;
  name?: TypographyOwnProps;
  bio?: TypographyOwnProps;
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
    color: "custom.ui13",
    fontSize: "24px",
    fontWeight: 500,
  },
  bio: {
    fontSize: "16px",
    fontWeight: 500,
    mt: "4px",
  },
};

const WriterCard: FC<Props> = ({ name, bio, image }) => {
  return (
    <Box {...styles.container}>
      <Avatar alt={name} src={image} {...styles.avatar} />
      <Box {...styles.content}>
        <Typography {...styles.name}>{name}</Typography>
        <Typography {...styles.bio}>{bio}</Typography>
      </Box>
    </Box>
  );
};

export default WriterCard;
