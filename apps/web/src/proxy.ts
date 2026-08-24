import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";
import { NextRequest } from "next/server";

// Next 16 renames the `middleware` convention to `proxy`. The file runs on the
// Node.js runtime, so no `runtime` segment config is needed here.
//
// next-intl still ships its handler under `next-intl/middleware` - only the
// Next.js file convention was renamed, not next-intl's API.
const intlProxy = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  return intlProxy(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
