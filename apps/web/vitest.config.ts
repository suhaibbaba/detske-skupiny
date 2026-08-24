import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

/**
 * Sanity's createClient throws without a projectId, and modules that build
 * image URLs pull the client in at import time. These are dummy values - no
 * test makes a network call.
 */
const fontStub = fileURLToPath(
  new URL("./src/test/next-font-stub.ts", import.meta.url),
);

const serverOnlyStub = fileURLToPath(
  new URL("./src/test/server-only-stub.ts", import.meta.url),
);

const alias = {
  "@": srcPath,
  // next/font/google is a build-time macro; the theme calls it at import time.
  "next/font/google": fontStub,
  // `server-only` throws on import outside an RSC. The query modules are
  // imported by queries.test.ts purely to read the GROQ they export.
  "server-only": serverOnlyStub,
};

const TEST_ENV = {
  SANITY_PROJECT_ID: "testproj",
  SANITY_DATASET: "test",
  NEXT_PUBLIC_EN_DOMAIN: "en.school.local",
  // The variable routing.ts actually reads is NEXT_PUBLIC_CS_DOMAIN; this
  // was spelled CZ, so the Czech origin silently fell back to "localhost" and
  // the two locales shared a host. The SEO tests assert on both origins.
  NEXT_PUBLIC_CS_DOMAIN: "cs.school.local",
};

/**
 * Two projects instead of one config with `environmentMatchGlobs`: that option
 * was removed in Vitest 4, and `projects` is its supported replacement. The
 * split is the same - pure functions run in `node`, anything that renders runs
 * in `jsdom`.
 */
export default defineConfig({
  plugins: [react()],
  esbuild: { jsx: "automatic" },
  resolve: { alias },
  test: {
    projects: [
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: "unit",
          environment: "node",
          env: TEST_ENV,
          globals: true,
          include: ["src/**/*.test.ts"],
        },
      },
      {
        plugins: [react()],
        resolve: { alias },
        esbuild: { jsx: "automatic" },
        test: {
          name: "components",
          environment: "jsdom",
          env: TEST_ENV,
          globals: true,
          include: ["src/**/*.test.tsx"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
  },
});
