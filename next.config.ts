import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const EN_DOMAIN = process.env.NEXT_PUBLIC_EN_DOMAIN ?? "localhost";
const CZ_DOMAIN = process.env.NEXT_PUBLIC_CZ_DOMAIN ?? "localhost";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [`*.school.local`],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
