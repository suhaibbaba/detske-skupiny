import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";

export default createMiddleware(routing);

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
