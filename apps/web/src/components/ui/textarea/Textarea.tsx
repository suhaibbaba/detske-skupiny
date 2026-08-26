"use client";

import * as React from "react";
import { alpha, TextareaAutosize as BaseTextareaAutosize } from "@mui/material";
import { styled } from "@mui/system";
import { TextareaAutosizeProps } from "@mui/material/TextareaAutosize";

export default function Textarea(props: TextareaAutosizeProps) {
  return <TextareaAutosize {...props} />;
}

/**
 * The contact form's message field.
 *
 * `"use client"` because `styled()` is Emotion, and Emotion's `styled` is a
 * client module - a server module that calls it throws. Its only call site,
 * `ContactForm`, is already a client component, so the directive states a fact
 * about this module rather than moving a boundary.
 *
 * The focus ring comes from the shared `:focus-visible` rule in
 * theme/components.ts. The `:focus` rule below only changes the border colour,
 * so suppressing that ring here would leave a keyboard user with a 1px
 * hairline as the only indicator.
 */
const TextareaAutosize = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  padding: 12px 16px;
  border-radius: 24px;
  border: 1px solid ${theme.palette.custom.inputBorder};
  width: 100%;
  transition: all 0.3s ease;
  font-size: 15px;
  font-weight: normal;
  
  &:hover {
    border-color: ${alpha(theme.palette.common.black, 0.87)};
  }

  &:focus {
    border-width: 1px;
    border-color: ${theme.palette.custom.inputBorderFocused};
  }
  
  & input::placeholder: {
    color: #6B7280;
    opacity: 1;
    fontSize: 14px;
  }
`,
);
