import React from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const Email = (props: SvgIconProps) => {
  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
      {...props}
    >
      <path d="m17.418 3.623-.014-.007c-.098-.053-.887-.44-2.404-.57V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8c0-2.757-2.243-5-5-5S0 5.243 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5.002 5.002 0 0 0-2.582-4.377ZM6 12H4a1 1 0 1 1 0-2h2a1 1 0 1 1 0 2Z" />
    </SvgIcon>
  );
};

export default Email;
