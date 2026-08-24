import { NextRequest, NextResponse } from "next/server";
import { contactSchema, type ContactPayload } from "@/lib/contact/schema";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileVerifyResponse {
  success?: boolean;
  "error-codes"?: string[];
}

/**
 * Verifies the Turnstile token server-side.
 *
 * Without TURNSTILE_SECRET_KEY we log a warning and skip verification so local
 * development works without Cloudflare keys. Whenever the secret is set - which
 * production always is - the token is verified.
 */
async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.warn(
      "TURNSTILE_SECRET_KEY is not set - skipping captcha verification (development fallback)",
    );
    return true;
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, response: token ?? "" }),
    });

    const result = (await response.json()) as TurnstileVerifyResponse;

    if (result?.success !== true) {
      console.error("Turnstile verification failed:", result?.["error-codes"]);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Turnstile verification request failed:", error);
    return false;
  }
}

/** The one and only success shape - also returned to bots caught by the honeypot. */
function successResponse() {
  return NextResponse.json(
    { success: true, message: "Email sent successfully" },
    { status: 200 },
  );
}

async function sendEmail(data: ContactPayload) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderName = "Dětské skupinky - Kontaktní formulář";

  if (!apiKey) {
    console.error("BREVO_API_KEY is not configured");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 },
    );
  }

  // Send email via Brevo API
  // Using the Brevo transactional email endpoint
  const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: "formulare@detskeskupinky.cz", // Must be verified sender in Brevo
      },
      to: [
        {
          email: "formulare@detskeskupinky.cz",
        },
      ],
      replyTo: {
        email: data.email,
        name: data.name,
      },
      subject: `Nová zpráva z kontaktního formuláře od ${data.name}`,
      htmlContent: `
            <h2>Nová zpráva z kontaktního formuláře</h2>
            <p><strong>Jméno:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Zpráva:</strong></p>
            <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
          `,
      textContent: `Nová zpráva z kontaktního formuláře

Jméno: ${data.name}
Email: ${data.email}

Zpráva:
${data.message}`,
    }),
  });

  if (!brevoResponse.ok) {
    const errorData = await brevoResponse.json().catch(() => ({}));
    console.error("Brevo API error:", errorData);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }

  return successResponse();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Honeypot first: bots fill every field they find. Answer exactly like a
    // successful submission so they never learn they were detected, but drop
    // the message silently.
    const honeypot = (body as { website?: unknown }).website;
    if (typeof honeypot === "string" && honeypot.trim().length > 0) {
      return successResponse();
    }

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      // Validation details stay on the server - never echo zod issues back.
      console.error("Contact form validation failed:", parsed.error.issues);
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const isHuman = await verifyTurnstile(parsed.data.turnstileToken);

    if (!isHuman) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400 },
      );
    }

    return await sendEmail(parsed.data);
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
