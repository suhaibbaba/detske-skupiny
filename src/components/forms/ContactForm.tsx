"use client";

import {
  Box,
  BoxProps,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
  Alert,
  GridBaseProps,
  TypographyOwnProps,
  ButtonProps,
} from "@mui/material";
import Textarea from "@/components/ui/textarea/Textarea";
import { FC, useMemo, useState } from "react";
import Button from "@/components/ui/button";
import { ContactUsForm } from "@/sanity/types";
import useTranslate from "@/hooks/useTranslate";
import RichText from "@/sanity/components/RichText";
import { parseLinkField } from "@/components/ui/link/parser";

interface Props {
  contactUsForm?: ContactUsForm;
}

interface ContactUsStyles {
  container?: BoxProps;
  title?: TypographyOwnProps;
  description?: TypographyOwnProps;
  fullWidthGrid?: GridBaseProps;
  halfWidthGrid?: GridBaseProps;
  cta?: ButtonProps;
}

const styles: ContactUsStyles = {
  container: {
    sx: {
      display: "flex",
      flexDirection: "column",
      bgcolor: "common.white",
      p: "32px",
      borderRadius: "16px",
    },
  },
  title: {
    variant: "h3",
    mb: "12px",
  },
  description: {
    mb: "24px",
  },
  fullWidthGrid: {
    size: 12,
  },
  halfWidthGrid: {
    size: {
      xs: 12,
      sm: 6,
    },
  },
  cta: {
    sx: {
      mt: "24px",
    },
  },
};

const ContactForm: FC<Props> = ({ contactUsForm }) => {
  const translate = useTranslate();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  const isEmailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    [form.email],
  );

  const isValid = useMemo(
    () =>
      form.name.trim().length >= 2 &&
      isEmailValid &&
      form.message.trim().length >= 5 &&
      agree,
    [form, isEmailValid, agree],
  );

  const onChange =
    (field: "name" | "email" | "message") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((s) => ({ ...s, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || status === "sending") return;

    setStatus("sending");
    setErrorMsg("");

    // TODO: Handle contact us
    // try {
    //   const res = await fetch("/api/contact", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(form),
    //   });
    //
    //   if (!res.ok) {
    //     const data = await res.json().catch(() => ({}));
    //     throw new Error(data?.error || "Failed to send");
    //   }
    //
    //   setStatus("ok");
    //   setForm({ name: "", email: "", message: "" });
    //   setAgree(false);
    // } catch (err: any) {
    //   setStatus("error");
    //   setErrorMsg(err?.message || "Failed to send");
    // }
  };

  if (!contactUsForm) {
    return null;
  }

  const { title, description, privacyPolicy, sendMessageCta } = contactUsForm;
  const link = parseLinkField(sendMessageCta.link);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      <Box {...styles.container}>
        <Typography {...styles.title}>{title}</Typography>
        <Typography {...styles.description}>{description}</Typography>

        {status === "ok" && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {translate("Message sent successfully.")}
          </Alert>
        )}
        {status === "error" && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg || translate("Failed to send. Try again.")}
          </Alert>
        )}

        <Grid container rowSpacing="24px" columnSpacing="32px">
          <Grid {...styles.halfWidthGrid}>
            <TextField
              name="name"
              value={form.name}
              onChange={onChange("name")}
              placeholder={translate("Your name")}
              variant="outlined"
              fullWidth
              className="rounded"
              size="small"
              required
            />
          </Grid>
          <Grid {...styles.halfWidthGrid}>
            <TextField
              name="email"
              type="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder={translate("name@example.com")}
              variant="outlined"
              fullWidth
              className="rounded"
              size="small"
              required
              error={form.email.length > 0 && !isEmailValid}
              helperText={
                form.email.length > 0 && !isEmailValid
                  ? translate("Enter a valid email")
                  : ""
              }
            />
          </Grid>
          <Grid {...styles.fullWidthGrid}>
            <Textarea
              name="message"
              value={form.message}
              onChange={onChange("message") as any}
              aria-label="message"
              minRows={5}
              maxRows={7}
              placeholder={translate("Write text here ...")}
              required
            />
          </Grid>
          <Grid {...styles.fullWidthGrid}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                }
                label={<RichText fontSize="12px">{privacyPolicy}</RichText>}
              />
            </FormGroup>
          </Grid>
        </Grid>
        <Grid {...styles.fullWidthGrid}>
          <Button
            type="submit"
            variant={sendMessageCta.variant}
            fullWidth
            {...styles.cta}
            disabled={!isValid || status === "sending"}
            aria-busy={status === "sending"}
          >
            {status === "sending" ? translate("Sending...") : link.text}
          </Button>
        </Grid>
      </Box>
    </form>
  );
};

export default ContactForm;
