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
 * about this module rather than moving a boundary. See docs/client-surface.md.
 *
 * This used to carry `&:focus-visible { outline: 0 }`, marked "firefox", which
 * removed the only visible focus indicator the control had: the `:focus` rule
 * below changes the border colour but not its width, so a keyboard user
 * landing here saw a 1px hairline shift from grey to purple and nothing else.
 * The ring comes from the `:focus-visible` rule in theme/components.ts now,
 * which every focusable element on the site shares.
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
