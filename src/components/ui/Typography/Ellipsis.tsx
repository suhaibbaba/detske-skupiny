import { Theme, Typography, TypographyProps } from "@mui/material";
import React from "react";
import { SxProps } from "@mui/material/styles";

interface Props extends TypographyProps {
  limitOfLine: number;
}

const ellipsisStyles: TypographyProps["sx"] = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
};

const Ellipsis: React.FC<Props> = ({ children, limitOfLine, sx, ...props }) => {
  const mergedSx: SxProps<Theme> = [
    ellipsisStyles,
    { WebkitLineClamp: limitOfLine },
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []), // <- no undefined in the array
  ];

  return (
    <Typography {...props} sx={mergedSx}>
      {children}
    </Typography>
  );
};

export default Ellipsis;
