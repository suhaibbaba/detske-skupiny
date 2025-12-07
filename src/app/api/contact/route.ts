import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (body.name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (body.message.trim().length < 5) {
      return NextResponse.json(
        { error: "Message must be at least 5 characters" },
        { status: 400 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;
    const senderName = "Dětské skupinky - Kontaktní formulář";

    if (!apiKey) {
      console.error("BREVO_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
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
          email: body.email,
          name: body.name,
        },
        subject: `Nová zpráva z kontaktního formuláře od ${body.name}`,
        htmlContent: `
            <h2>Nová zpráva z kontaktního formuláře</h2>
            <p><strong>Jméno:</strong> ${escapeHtml(body.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
            <p><strong>Zpráva:</strong></p>
            <p>${escapeHtml(body.message).replace(/\n/g, "<br>")}</p>
          `,
        textContent: `Nová zpráva z kontaktního formuláře

Jméno: ${body.name}
Email: ${body.email}

Zpráva:
${body.message}`,
      }),
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json().catch(() => ({}));
      console.error("Brevo API error:", errorData);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    const result = await brevoResponse.json();
    console.log("Email sent successfully via Brevo:", result);

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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
