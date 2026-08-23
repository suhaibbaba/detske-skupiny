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

const alias = {
  "@": srcPath,
  // next/font/google is a build-time macro; the theme calls it at import time.
  "next/font/google": fontStub,
};

const TEST_ENV = {
  NEXT_PUBLIC_SANITY_PROJECT_ID: "testproj",
  NEXT_PUBLIC_SANITY_DATASET: "test",
  NEXT_PUBLIC_EN_DOMAIN: "en.school.local",
  NEXT_PUBLIC_CZ_DOMAIN: "cs.school.local",
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
