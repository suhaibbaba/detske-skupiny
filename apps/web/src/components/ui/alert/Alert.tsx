import { Alert as MuiAlert, AlertProps } from "@mui/material";
import useTranslate from "@/hooks/useTranslate";
import { FC } from "react";

interface ExAlertProps extends AlertProps {
  message?: string;
}

const Alert: FC<ExAlertProps> = ({ message, ...otherProps }) => {
  const translate = useTranslate();

  return <MuiAlert {...otherProps}>{translate(message || "")}</MuiAlert>;
};

export default Alert;
