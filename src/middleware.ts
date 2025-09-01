import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/routing";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname starts with a supported locale
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  // If not, redirect to default locale
  if (!hasLocale) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match everything except:
    // - /api
    // - /trpc
    // - /_next
    // - /_vercel
    // - paths containing a dot (e.g., .ico, .png, .js)
    "/",
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
