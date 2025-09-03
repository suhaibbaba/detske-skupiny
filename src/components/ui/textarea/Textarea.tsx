import * as React from "react";
import { alpha, TextareaAutosize as BaseTextareaAutosize } from "@mui/material";
import { styled } from "@mui/system";
import { TextareaAutosizeProps } from "@mui/material/TextareaAutosize";

export default function Textarea(props: TextareaAutosizeProps) {
  return <TextareaAutosize {...props} />;
}

const TextareaAutosize = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  padding: 12px 16px;
  border-radius: 24px;
  border: 1px solid ${theme.palette.custom.ui2};
  width: 100%;
  transition: all 0.3s ease;
  font-size: 15px;
  font-weight: normal;
  
  /* firefox */
  &:focus-visible {
    outline: 0;
  }

  &:hover {
    border-color: ${alpha(theme.palette.common.black, 0.87)};
  }

  &:focus {
    border-width: 1px;
    border-color: ${theme.palette.custom.ui4};
  }
  
  & input::placeholder: {
    color: #6B7280;
    opacity: 1;
    fontSize: 14px;
  }
`,
);
