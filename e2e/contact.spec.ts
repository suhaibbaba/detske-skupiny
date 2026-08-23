import { expect, test } from "@playwright/test";
import { PATHS } from "./helpers";

const NAME = "input[name='name']";
const EMAIL = "input[name='email']";
const MESSAGE = "textarea[name='message'], [aria-label='message']";
const CONSENT = "input[name='consent']";
const HONEYPOT = "input[name='website']";

async function fillValidForm(page: import("@playwright/test").Page) {
  await page.locator(NAME).fill("Jana Nováková");
  await page.locator(EMAIL).fill("jana@example.cz");
  await page.locator(MESSAGE).first().fill("Dobrý den, mám zájem o místo.");
}

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATHS.contact);
    await page.waitForLoadState("networkidle");
  });

  test("renders all fields", async ({ page }) => {
    await expect(page.locator(NAME)).toBeVisible();
    await expect(page.locator(EMAIL)).toBeVisible();
    await expect(page.locator(MESSAGE).first()).toBeVisible();
    await expect(page.locator(CONSENT)).toBeAttached();
  });

  test("submit is blocked until consent is given", async ({ page }) => {
    await fillValidForm(page);

    const submit = page.getByRole("button", { name: /.+/ }).last();
    // Everything is filled except consent, so the button must stay disabled.
    await expect(page.locator(CONSENT)).not.toBeChecked();
    await expect(submit).toBeDisabled();

    await page.locator(CONSENT).check();
    await expect(submit).toBeEnabled();
  });

  test("submit stays blocked for an invalid email", async ({ page }) => {
    await page.locator(NAME).fill("Jana");
    await page.locator(EMAIL).fill("not-an-email");
    await page.locator(MESSAGE).first().fill("Dobrý den, mám zájem.");
    await page.locator(CONSENT).check();

    await expect(page.getByRole("button", { name: /.+/ }).last()).toBeDisabled();
  });

  test("the honeypot is hidden from users", async ({ page }) => {
    const honeypot = page.locator(HONEYPOT);
    await expect(honeypot).toBeAttached();
    await expect(honeypot).toBeHidden();
    await expect(honeypot).toHaveAttribute("aria-hidden", "true");
  });

  test("a filled honeypot looks successful but is dropped", async ({
    page,
  }) => {
    // Intercept so the assertion is about what the server was told and what it
    // answered - no mail is sent either way, the route short-circuits.
    let requestBody: Record<string, unknown> | null = null;
    let responseStatus = 0;

    await page.route("**/api/contact", async (route) => {
      requestBody = JSON.parse(route.request().postData() ?? "{}");
      const response = await route.fetch();
      responseStatus = response.status();
      await route.fulfill({ response });
    });

    await fillValidForm(page);
    await page.locator(CONSENT).check();

    // Fill the honeypot the way a bot would - it is hidden, so set it directly.
    await page.locator(HONEYPOT).evaluate((element) => {
      const input = element as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(input, "http://spam.example");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    await page.getByRole("button", { name: /.+/ }).last().click();

    await expect.poll(() => responseStatus).toBe(200);
    expect(requestBody).not.toBeNull();
    expect(requestBody!.website).toBe("http://spam.example");

    // The user-visible result is indistinguishable from a real success.
    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("a valid submission reports success", async ({ page }) => {
    // Stub the API so the suite never sends real mail through Brevo.
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Email sent successfully",
        }),
      }),
    );

    await fillValidForm(page);
    await page.locator(CONSENT).check();
    await page.getByRole("button", { name: /.+/ }).last().click();

    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
  });

  test("a server error is surfaced to the user", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Failed to send email" }),
      }),
    );

    await fillValidForm(page);
    await page.locator(CONSENT).check();
    await page.getByRole("button", { name: /.+/ }).last().click();

    await expect(page.getByRole("alert")).toBeVisible();
  });
});
