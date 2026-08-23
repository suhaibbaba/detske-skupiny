/**
 * next/font/google is a compiler macro - outside the Next build it is not a
 * real module, so the theme's `Nunito(...)` call fails. This stub returns the
 * same shape the macro produces at build time.
 */
const font = () => ({
  className: "test-font",
  style: { fontFamily: "Nunito, sans-serif" },
  variable: "--font-test",
});

export const Nunito = font;

// Any other family the app adds later resolves through the same stub.
const fontProxy = new Proxy({} as Record<string, typeof font>, {
  get: () => font,
});

export default fontProxy;
