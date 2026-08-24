"use client";

import {
  Box,
  BoxProps,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Link as MuiLink,
  TextField,
  Typography,
  Alert,
  GridBaseProps,
  TypographyOwnProps,
  ButtonProps,
} from "@mui/material";
import Textarea from "@/components/ui/textarea/Textarea";
import { FC, useState } from "react";
import Button from "@/components/ui/button";
import { ContactUsForm } from "@/types";
import useTranslate from "@/hooks/useTranslate";
import RichText from "@/components/rich-text/RichText";
import { parseLinkField } from "@/components/ui/link/parser";
import { useLocale } from "next-intl";
import TurnstileWidget from "@/components/forms/TurnstileWidget";
import type { ContactPayload } from "@/lib/contact/schema";

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
  honeypot?: BoxProps;
}

const PRIVACY_POLICY_URL = "/ochrana-osobnich-udaju.pdf";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

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
    sx: { mb: "12px" },
  },
  description: {
    sx: { mb: "24px" },
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
  // Visually hidden, but still reachable for bots that parse the DOM.
  // Deliberately not `display: none` - naive bots skip those.
  honeypot: {
    sx: {
      position: "absolute",
      left: "-9999px",
      top: "auto",
      width: "1px",
      height: "1px",
      overflow: "hidden",
      opacity: 0,
    },
  },
};

const ContactForm: FC<Props> = ({ contactUsForm }) => {
  const translate = useTranslate();
  const locale = useLocale();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Both were `useMemo`. Neither feeds a dependency array, and a regex test
  // over one short string costs less than the comparison that would skip it -
  // the React Compiler memoizes them anyway if it decides it is worth it.
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const isValid =
    form.name.trim().length >= 2 &&
    isEmailValid &&
    form.message.trim().length >= 5 &&
    agree &&
    // Without a site key the widget is not rendered at all (dev fallback).
    (!TURNSTILE_SITE_KEY || turnstileToken.length > 0);

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

    const payload: ContactPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      consent: true,
      turnstileToken: turnstileToken || undefined,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // `website` is the honeypot - it is not part of the payload schema.
        body: JSON.stringify({ ...payload, website }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to send");
      }

      setStatus("ok");
      setForm({ name: "", email: "", message: "" });
      setAgree(false);
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to send");
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
    }
  };

  if (!contactUsForm) {
    return null;
  }

  const { title, description, privacyPolicy, sendMessageCta } = contactUsForm;
  const link = parseLinkField(sendMessageCta?.link, { locale });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      <Box {...styles.container}>
        <Typography {...styles.title}>{title}</Typography>
        <Typography {...styles.description}>{description}</Typography>

        {status === "ok" && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {translate("contactFormSuccessMessageSent")}
          </Alert>
        )}
        {status === "error" && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {translate("contactFormFailedMessageSent")}
          </Alert>
        )}

        <Grid container rowSpacing="24px" columnSpacing="32px">
          <Grid {...styles.halfWidthGrid}>
            <TextField
              name="name"
              value={form.name}
              onChange={onChange("name")}
              placeholder={translate("contactFormNamePlaceholder")}
              variant="outlined"
              fullWidth
              className="rounded"
              size="small"
              required
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
          </Grid>
          <Grid {...styles.halfWidthGrid}>
            <TextField
              name="email"
              type="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder={translate("contactFormEmailPlaceholder")}
              variant="outlined"
              fullWidth
              className="rounded"
              size="small"
              required
              error={form.email.length > 0 && !isEmailValid}
              helperText={
                form.email.length > 0 && !isEmailValid
                  ? translate("invalidEmail")
                  : ""
              }
              slotProps={{ htmlInput: { maxLength: 200 } }}
            />
          </Grid>
          <Grid {...styles.fullWidthGrid}>
            <Textarea
              name="message"
              value={form.message}
              onChange={onChange("message")}
              aria-label="message"
              minRows={5}
              maxRows={7}
              placeholder={translate("contactFormMessagePlaceholder")}
              required
              maxLength={2000}
            />
          </Grid>
          <Grid {...styles.fullWidthGrid}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="consent"
                    required
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                }
                label={
                  <Box>
                    {privacyPolicy?.length ? (
                      <RichText sx={{ fontSize: "12px" }} compactParagraphs>
                        {privacyPolicy}
                      </RichText>
                    ) : (
                      // TODO(sanity): add dictionary key `contactFormConsentLabel`
                      // (used only when the `privacyPolicy` rich text is empty).
                      <Typography
                        sx={{
                          fontSize: "12px",
                        }}
                      >
                        {translate("contactFormConsentLabel")}
                      </Typography>
                    )}
                    {/* TODO(sanity): add dictionary key `contactFormPrivacyPolicyLinkLabel`
                        for the link text below. */}
                    <MuiLink
                      href={PRIVACY_POLICY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        fontSize: "12px",
                      }}
                    >
                      {translate("contactFormPrivacyPolicyLinkLabel")}
                    </MuiLink>
                  </Box>
                }
              />
            </FormGroup>
          </Grid>
        </Grid>

        {/* Honeypot: hidden from humans and assistive tech, tempting for bots. */}
        <Box
          component="input"
          type="text"
          name="website"
          value={website}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setWebsite(e.target.value)
          }
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          {...styles.honeypot}
        />

        {TURNSTILE_SITE_KEY && (
          <TurnstileWidget
            siteKey={TURNSTILE_SITE_KEY}
            onVerify={setTurnstileToken}
            onExpire={() => setTurnstileToken("")}
            resetKey={turnstileResetKey}
          />
        )}

        <Grid {...styles.fullWidthGrid}>
          <Button
            type="submit"
            variant={sendMessageCta?.variant}
            fullWidth
            {...styles.cta}
            disabled={!isValid || status === "sending"}
            aria-busy={status === "sending"}
          >
            {status === "sending" ? `${translate("sending")}...` : link.text}
          </Button>
        </Grid>
      </Box>
    </form>
  );
};

export default ContactForm;
