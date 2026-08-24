/**
 * next/font is a compiler macro - outside the Next build it is not a real
 * module, so calling `Nunito(...)` or `localFont(...)` at import time fails.
 * This stub returns the same shape the macro produces at build time, and is
 * aliased for both `next/font/google` and `next/font/local` in vitest.config.
 */
const font = () => ({
  className: "test-font",
  style: { fontFamily: "Nunito, sans-serif" },
  variable: "--font-test",
});

export const Nunito = font;

/** `next/font/local` is called as the module's default export. */
export const localFont = font;

/**
 * The default export has to be callable (that is how `next/font/local` is
 * used) and also indexable by family name (that is how `next/font/google`
 * would be, if anything imported it as a namespace).
 */
const fontProxy = new Proxy(font, {
  get: (target, prop) => (prop in target ? (target as never)[prop] : font),
});

export default fontProxy;
